import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  ActivityLog,
  ActivityStats,
  UserActivitySummary,
  ActivityLogRequest,
  ActivityLogResponse
} from '../dto/UserActivityDto';

export class UserActivityService {
  private activityLogs: ActivityLog[] = [];
  private readonly maxLogs = 10000; // Keep last 10,000 logs in memory

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository
  ) {}

  async logActivity(request: ActivityLogRequest): Promise<ActivityLogResponse> {
    // Validate request
    if (!request.userId || request.userId.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('User ID is required');
    }

    if (!request.action || request.action.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('Action is required');
    }

    if (!request.resource || request.resource.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('Resource is required');
    }

    // Verify user exists
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw DomainErrorFactory.createUserNotFound(request.userId);
    }

    // Create activity log
    const log: ActivityLog = {
      id: this.generateLogId(),
      userId: request.userId,
      action: request.action,
      resource: request.resource,
      resourceId: request.resourceId,
      details: request.details,
      timestamp: new Date(),
      ipAddress: request.ipAddress,
      userAgent: request.userAgent,
      sessionId: request.sessionId,
    };

    // Add to logs
    this.activityLogs.push(log);

    // Keep only recent logs
    if (this.activityLogs.length > this.maxLogs) {
      this.activityLogs = this.activityLogs.slice(-this.maxLogs);
    }

    return {
      success: true,
      logId: log.id,
    };
  }

  async getUserActivityLogs(
    userId: string,
    limit = 50,
    offset = 0,
    action?: string
  ): Promise<ActivityLog[]> {
    let filteredLogs = this.activityLogs.filter(log => log.userId === userId);

    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    return filteredLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(offset, offset + limit);
  }

  async getChannelActivityLogs(
    channelId: string,
    limit = 50,
    offset = 0
  ): Promise<ActivityLog[]> {
    const filteredLogs = this.activityLogs.filter(
      log => log.resource === 'channel' && log.resourceId === channelId
    );

    return filteredLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(offset, offset + limit);
  }

  async getActivityStats(timeRange: 'day' | 'week' | 'month' = 'day'): Promise<ActivityStats> {
    const timeRangeMs = this.getTimeRangeMs(timeRange);
    const cutoffTime = new Date(Date.now() - timeRangeMs);

    const recentLogs = this.activityLogs.filter(log => log.timestamp >= cutoffTime);

    const actionCounts: Record<string, number> = {};
    const userCounts: Record<string, number> = {};

    recentLogs.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      userCounts[log.userId] = (userCounts[log.userId] || 0) + 1;
    });

    const mostActiveUsers = Object.entries(userCounts)
      .map(([userId, actionCount]) => ({ userId, actionCount }))
      .sort((a, b) => b.actionCount - a.actionCount)
      .slice(0, 10);

    return {
      totalActions: recentLogs.length,
      actionsByType: actionCounts,
      mostActiveUsers,
      recentActivity: recentLogs.slice(0, 20),
    };
  }

  async getUserActivitySummary(userId: string): Promise<UserActivitySummary | null> {
    const userLogs = this.activityLogs.filter(log => log.userId === userId);
    
    if (userLogs.length === 0) {
      return null;
    }

    const actionCounts: Record<string, number> = {};
    let totalActions = 0;
    let channelsJoined = 0;
    let messagesSent = 0;
    let filesUploaded = 0;

    userLogs.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      totalActions++;
      
      // Count specific actions
      if (log.action === 'join_channel') channelsJoined++;
      if (log.action === 'send_message') messagesSent++;
      if (log.action === 'upload_file') filesUploaded++;
    });

    const lastActivity = userLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    return {
      userId,
      totalActions,
      lastActivity: lastActivity.timestamp,
      actionsByType: actionCounts,
      channelsJoined,
      messagesSent,
      filesUploaded,
    };
  }

  async searchActivityLogs(
    query: string,
    filters?: {
      userId?: string;
      action?: string;
      resource?: string;
      startDate?: Date;
      endDate?: Date;
    },
    limit = 50,
    offset = 0
  ): Promise<ActivityLog[]> {
    let filteredLogs = this.activityLogs;

    // Apply filters
    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }

    if (filters?.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }

    if (filters?.resource) {
      filteredLogs = filteredLogs.filter(log => log.resource === filters.resource);
    }

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
    }

    // Apply search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.action.toLowerCase().includes(lowerQuery) ||
        log.resource.toLowerCase().includes(lowerQuery) ||
        log.details?.toString().toLowerCase().includes(lowerQuery)
      );
    }

    return filteredLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(offset, offset + limit);
  }

  async exportActivityLogs(
    format: 'json' | 'csv' = 'json',
    filters?: {
      userId?: string;
      action?: string;
      resource?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<string> {
    const logs = await this.searchActivityLogs('', filters, 10000, 0);

    if (format === 'csv') {
      return this.convertToCSV(logs);
    }

    return JSON.stringify(logs, null, 2);
  }

  async cleanupOldLogs(daysToKeep: number = 30): Promise<void> {
    const cutoffTime = new Date(Date.now() - (daysToKeep * 24 * 60 * 60 * 1000));
    this.activityLogs = this.activityLogs.filter(log => log.timestamp >= cutoffTime);
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getTimeRangeMs(timeRange: 'day' | 'week' | 'month'): number {
    switch (timeRange) {
      case 'day':
        return 24 * 60 * 60 * 1000;
      case 'week':
        return 7 * 24 * 60 * 60 * 1000;
      case 'month':
        return 30 * 24 * 60 * 60 * 1000;
      default:
        return 24 * 60 * 60 * 1000;
    }
  }

  private convertToCSV(logs: ActivityLog[]): string {
    const headers = ['ID', 'User ID', 'Action', 'Resource', 'Resource ID', 'Timestamp', 'IP Address', 'User Agent'];
    const rows = logs.map(log => [
      log.id,
      log.userId,
      log.action,
      log.resource,
      log.resourceId || '',
      log.timestamp.toISOString(),
      log.ipAddress || '',
      log.userAgent || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }
} 