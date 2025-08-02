import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  ActivityLog,
  ActivityLogRequest,
  ActivityLogResponse,
  ActivityStats,
  UserActivitySummary,
  ActivitySearchRequest,
  ActivityExportRequest,
  ActivityExportResponse
} from '../dto/UserActivityDto';

export class UserActivityLogUseCase {
  private activityLogs: ActivityLog[] = [];
  private readonly maxLogs = 10000; // Keep last 10,000 logs in memory

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository
  ) {}

  async logActivity(request: ActivityLogRequest): Promise<ActivityLogResponse> {
    try {
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
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to log activity');
    }
  }

  async getUserActivityLogs(
    userId: string,
    limit = 50,
    offset = 0,
    action?: string
  ): Promise<ActivityLog[]> {
    try {
      let filteredLogs = this.activityLogs.filter(log => log.userId === userId);

      if (action) {
        filteredLogs = filteredLogs.filter(log => log.action === action);
      }

      return filteredLogs
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(offset, offset + limit);
    } catch (error) {
      console.error('Failed to get user activity logs:', error);
      return [];
    }
  }

  async getChannelActivityLogs(
    channelId: string,
    limit = 50,
    offset = 0
  ): Promise<ActivityLog[]> {
    try {
      const filteredLogs = this.activityLogs.filter(
        log => log.resource === 'channel' && log.resourceId === channelId
      );

      return filteredLogs
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(offset, offset + limit);
    } catch (error) {
      console.error('Failed to get channel activity logs:', error);
      return [];
    }
  }

  async getActivityStats(timeRange: 'day' | 'week' | 'month' = 'day'): Promise<ActivityStats> {
    try {
      const now = new Date();
      const timeRangeMs = this.getTimeRangeMs(timeRange);
      const cutoffTime = new Date(now.getTime() - timeRangeMs);

      const recentLogs = this.activityLogs.filter(log => log.timestamp >= cutoffTime);

      // Count actions by type
      const actionsByType: Record<string, number> = {};
      const userActionCounts = new Map<string, number>();

      for (const log of recentLogs) {
        // Count by action type
        actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;

        // Count by user
        userActionCounts.set(log.userId, (userActionCounts.get(log.userId) || 0) + 1);
      }

      // Get most active users
      const mostActiveUsers = Array.from(userActionCounts.entries())
        .map(([userId, count]) => ({ userId, actionCount: count }))
        .sort((a, b) => b.actionCount - a.actionCount)
        .slice(0, 10);

      return {
        totalActions: recentLogs.length,
        actionsByType,
        mostActiveUsers,
        recentActivity: recentLogs.slice(0, 20), // Last 20 activities
      };
    } catch (error) {
      console.error('Failed to get activity stats:', error);
      return {
        totalActions: 0,
        actionsByType: {},
        mostActiveUsers: [],
        recentActivity: [],
      };
    }
  }

  async getUserActivitySummary(userId: string): Promise<UserActivitySummary | null> {
    try {
      const userLogs = this.activityLogs.filter(log => log.userId === userId);
      if (userLogs.length === 0) {
        return null;
      }

      // Count actions by type
      const actionsByType: Record<string, number> = {};
      for (const log of userLogs) {
        actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;
      }

      // Get specific counts
      const channelsJoined = actionsByType['channel_join'] || 0;
      const messagesSent = actionsByType['message_send'] || 0;
      const filesUploaded = actionsByType['file_upload'] || 0;

      // Get last activity
      const lastActivity = userLogs
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
        .timestamp;

      return {
        userId,
        totalActions: userLogs.length,
        lastActivity,
        actionsByType,
        channelsJoined,
        messagesSent,
        filesUploaded,
      };
    } catch (error) {
      console.error('Failed to get user activity summary:', error);
      return null;
    }
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
    try {
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
          (log.details && JSON.stringify(log.details).toLowerCase().includes(lowerQuery))
        );
      }

      return filteredLogs
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(offset, offset + limit);
    } catch (error) {
      console.error('Failed to search activity logs:', error);
      return [];
    }
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
    try {
      const logs = await this.searchActivityLogs('', filters, 10000, 0);

      if (format === 'csv') {
        return this.convertToCSV(logs);
      } else {
        return JSON.stringify(logs, null, 2);
      }
    } catch (error) {
      console.error('Failed to export activity logs:', error);
      return '';
    }
  }

  async cleanupOldLogs(daysToKeep: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const originalCount = this.activityLogs.length;
      this.activityLogs = this.activityLogs.filter(log => log.timestamp >= cutoffDate);

      const removedCount = originalCount - this.activityLogs.length;
      if (removedCount > 0) {
        console.log(`Cleaned up ${removedCount} old activity logs`);
      }
    } catch (error) {
      console.error('Failed to cleanup old logs:', error);
    }
  }

  private generateLogId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `log_${timestamp}_${random}`;
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
    const headers = ['ID', 'User ID', 'Action', 'Resource', 'Resource ID', 'Details', 'Timestamp', 'IP Address', 'User Agent', 'Session ID'];
    const rows = logs.map(log => [
      log.id,
      log.userId,
      log.action,
      log.resource,
      log.resourceId || '',
      log.details ? JSON.stringify(log.details) : '',
      log.timestamp.toISOString(),
      log.ipAddress || '',
      log.userAgent || '',
      log.sessionId || '',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }
} 