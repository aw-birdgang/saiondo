import { UserActivityService } from '../services/UserActivityService';
import type {
  ActivityLog,
  ActivityLogRequest,
  ActivityLogResponse,
  ActivityStats,
  UserActivitySummary
} from '../dto/UserActivityDto';

export class UserActivityLogUseCase {
  constructor(private readonly userActivityService: UserActivityService) {}

  async logActivity(request: ActivityLogRequest): Promise<ActivityLogResponse> {
    return await this.userActivityService.logActivity(request);
  }

  async getUserActivityLogs(
    userId: string,
    limit = 50,
    offset = 0,
    action?: string
  ): Promise<ActivityLog[]> {
    return await this.userActivityService.getUserActivityLogs(userId, limit, offset, action);
  }

  async getChannelActivityLogs(
    channelId: string,
    limit = 50,
    offset = 0
  ): Promise<ActivityLog[]> {
    return await this.userActivityService.getChannelActivityLogs(channelId, limit, offset);
  }

  async getActivityStats(timeRange: 'day' | 'week' | 'month' = 'day'): Promise<ActivityStats> {
    return await this.userActivityService.getActivityStats(timeRange);
  }

  async getUserActivitySummary(userId: string): Promise<UserActivitySummary | null> {
    return await this.userActivityService.getUserActivitySummary(userId);
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
    return await this.userActivityService.searchActivityLogs(query, filters, limit, offset);
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
    return await this.userActivityService.exportActivityLogs(format, filters);
  }

  async cleanupOldLogs(daysToKeep: number = 30): Promise<void> {
    return await this.userActivityService.cleanupOldLogs(daysToKeep);
  }
} 