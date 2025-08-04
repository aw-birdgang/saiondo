import type { CacheService } from '../services/CacheService';
import type { RedisCacheStats } from '../dto/RedisCacheDto';
import type { IUseCase } from './interfaces/IUseCase';

export class RedisCacheUseCase implements IUseCase<string, any> {
  constructor(private readonly cacheService: CacheService) {}

  async execute(userId: string): Promise<any> {
    return this.getUserWithCache(userId);
  }

  async getUserWithCache(userId: string): Promise<any> {
    try {
      return await this.cacheService.getUserWithCache(userId);
    } catch (error) {
      console.error('Failed to get user with cache:', error);
      return null;
    }
  }

  async getChannelWithCache(channelId: string): Promise<any> {
    try {
      return await this.cacheService.getChannelWithCache(channelId);
    } catch (error) {
      console.error('Failed to get channel with cache:', error);
      return null;
    }
  }

  async getMessagesWithCache(channelId: string, limit?: number, offset?: number): Promise<any[]> {
    try {
      return await this.cacheService.getMessagesWithCache(channelId, limit, offset);
    } catch (error) {
      console.error('Failed to get messages with cache:', error);
      return [];
    }
  }

  async invalidateUserCache(userId: string): Promise<void> {
    try {
      await this.cacheService.invalidateUserCache(userId);
    } catch (error) {
      console.error('Failed to invalidate user cache:', error);
    }
  }

  async invalidateChannelCache(channelId: string): Promise<void> {
    try {
      await this.cacheService.invalidateChannelCache(channelId);
    } catch (error) {
      console.error('Failed to invalidate channel cache:', error);
    }
  }

  async invalidateMessageCaches(channelId: string): Promise<void> {
    try {
      await this.cacheService.invalidateMessageCaches(channelId);
    } catch (error) {
      console.error('Failed to invalidate message caches:', error);
    }
  }

  async getCacheStats(): Promise<RedisCacheStats> {
    try {
      const stats = await this.cacheService.getCacheStats();
      return {
        totalKeys: stats.totalKeys || 0,
        memoryUsage: stats.memoryUsage || 0,
        hitRate: stats.hitRate || 0,
        missRate: stats.missRate || 0,
        connectedClients: 0, // CacheService doesn't provide connected clients
        uptime: 0, // CacheService doesn't provide uptime
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        totalKeys: 0,
        memoryUsage: 0,
        hitRate: 0,
        missRate: 0,
        connectedClients: 0,
        uptime: 0,
      };
    }
  }

  async clearCache(): Promise<void> {
    try {
      await this.cacheService.clearCache();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  async warmupCache(userIds: string[], channelIds: string[]): Promise<void> {
    try {
      await this.cacheService.warmupCache(userIds, channelIds);
    } catch (error) {
      console.error('Failed to warmup cache:', error);
    }
  }

  async batchGetUsers(userIds: string[]): Promise<Map<string, any>> {
    try {
      return await this.cacheService.batchGetUsers(userIds);
    } catch (error) {
      console.error('Failed to batch get users:', error);
      return new Map();
    }
  }
}
