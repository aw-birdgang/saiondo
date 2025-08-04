import { CacheService } from '../services/CacheService';
import type { CacheStats } from '../dto/CacheDto';

export class CacheUseCase {
  constructor(private readonly cacheService: CacheService) {}

  async getUserWithCache(userId: string): Promise<any> {
    return await this.cacheService.getUserWithCache(userId);
  }

  async getChannelWithCache(channelId: string): Promise<any> {
    return await this.cacheService.getChannelWithCache(channelId);
  }

  async getMessagesWithCache(channelId: string, limit?: number, offset?: number): Promise<any[]> {
    return await this.cacheService.getMessagesWithCache(channelId, limit, offset);
  }

  async invalidateUserCache(userId: string): Promise<void> {
    return await this.cacheService.invalidateUserCache(userId);
  }

  async invalidateChannelCache(channelId: string): Promise<void> {
    return await this.cacheService.invalidateChannelCache(channelId);
  }

  async invalidateMessageCaches(channelId: string): Promise<void> {
    return await this.cacheService.invalidateMessageCaches(channelId);
  }

  async getCacheStats(): Promise<CacheStats> {
    return await this.cacheService.getCacheStats();
  }

  async clearCache(): Promise<void> {
    return await this.cacheService.clearCache();
  }

  async warmupCache(userIds: string[], channelIds: string[]): Promise<void> {
    return await this.cacheService.warmupCache(userIds, channelIds);
  }

  async batchGetUsers(userIds: string[]): Promise<Map<string, any>> {
    return await this.cacheService.batchGetUsers(userIds);
  }
}
