import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { 
  RedisCacheRequest,
  RedisCacheResponse,
  GetRedisCacheRequest,
  GetRedisCacheResponse,
  DeleteRedisCacheRequest,
  DeleteRedisCacheResponse,
  RedisCacheStats
} from '../dto/RedisCacheDto';

export class RedisCacheUseCase {
  private redisClient: any; // Redis client instance
  private defaultTTL = 5 * 60; // 5 minutes in seconds

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly redisUrl: string = 'redis://localhost:6379'
  ) {
    this.initializeRedis();
  }

  private async initializeRedis(): Promise<void> {
    try {
      // In a real implementation, you would use a Redis client library
      // this.redisClient = new Redis(this.redisUrl);
      console.log('Redis client initialized');
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
    }
  }

  async getUserWithCache(userId: string): Promise<any> {
    try {
      const cacheKey = `user:${userId}`;
      
      // Try to get from Redis cache
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      // If not in cache, fetch from repository
      const user = await this.userRepository.findById(userId);
      if (user) {
        await this.setCache(cacheKey, user.toJSON());
      }
      
      return user;
    } catch (error) {
      console.error('Failed to get user with cache:', error);
      return null;
    }
  }

  async getChannelWithCache(channelId: string): Promise<any> {
    try {
      const cacheKey = `channel:${channelId}`;
      
      // Try to get from Redis cache
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      // If not in cache, fetch from repository
      const channel = await this.channelRepository.findById(channelId);
      if (channel) {
        await this.setCache(cacheKey, channel.toJSON());
      }
      
      return channel;
    } catch (error) {
      console.error('Failed to get channel with cache:', error);
      return null;
    }
  }

  async getMessagesWithCache(channelId: string, limit?: number, offset?: number): Promise<any[]> {
    try {
      const cacheKey = `messages:${channelId}:${limit}:${offset}`;
      
      // Try to get from Redis cache
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      // If not in cache, fetch from repository
      const messages = await this.messageRepository.findByChannelId(channelId, limit, offset);
      const messageData = messages.map(message => message.toJSON());
      
      await this.setCache(cacheKey, messageData, 2 * 60); // 2 minutes TTL for messages
      
      return messageData;
    } catch (error) {
      console.error('Failed to get messages with cache:', error);
      return [];
    }
  }

  async invalidateUserCache(userId: string): Promise<void> {
    try {
      const cacheKey = `user:${userId}`;
      await this.deleteFromCache(cacheKey);
    } catch (error) {
      console.error('Failed to invalidate user cache:', error);
    }
  }

  async invalidateChannelCache(channelId: string): Promise<void> {
    try {
      const cacheKey = `channel:${channelId}`;
      await this.deleteFromCache(cacheKey);
      
      // Also invalidate related message caches
      await this.invalidateMessageCaches(channelId);
    } catch (error) {
      console.error('Failed to invalidate channel cache:', error);
    }
  }

  async invalidateMessageCaches(channelId: string): Promise<void> {
    try {
      // In a real implementation, you would use Redis SCAN to find and delete all message keys
      const pattern = `messages:${channelId}:*`;
      // await this.redisClient.del(pattern);
      console.log(`Invalidated message caches for channel: ${channelId}`);
    } catch (error) {
      console.error('Failed to invalidate message caches:', error);
    }
  }

  async getCacheStats(): Promise<RedisCacheStats> {
    try {
      // In a real implementation, you would get actual Redis stats
      return {
        totalKeys: 0,
        memoryUsage: 0,
        hitRate: 0,
        missRate: 0,
        connected: true,
        uptime: 0,
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        totalKeys: 0,
        memoryUsage: 0,
        hitRate: 0,
        missRate: 0,
        connected: false,
        uptime: 0,
      };
    }
  }

  async clearCache(): Promise<void> {
    try {
      // await this.redisClient.flushall();
      console.log('Redis cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  async warmupCache(userIds: string[], channelIds: string[]): Promise<void> {
    try {
      // Pre-load frequently accessed data into cache
      const userPromises = userIds.map(userId => 
        this.getUserWithCache(userId).catch(() => null)
      );
      
      const channelPromises = channelIds.map(channelId => 
        this.getChannelWithCache(channelId).catch(() => null)
      );
      
      await Promise.all([...userPromises, ...channelPromises]);
      console.log(`Cache warmup completed. Users: ${userIds.length}, Channels: ${channelIds.length}`);
    } catch (error) {
      console.error('Cache warmup failed:', error);
    }
  }

  private async getFromCache<T>(key: string): Promise<T | null> {
    try {
      // In a real implementation: const data = await this.redisClient.get(key);
      // return data ? JSON.parse(data) : null;
      return null; // Mock implementation
    } catch (error) {
      console.error('Failed to get from cache:', error);
      return null;
    }
  }

  private async setCache<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const ttlSeconds = ttl || this.defaultTTL;
      // In a real implementation: await this.redisClient.setex(key, ttlSeconds, JSON.stringify(data));
      console.log(`Cached data for key: ${key} with TTL: ${ttlSeconds}s`);
    } catch (error) {
      console.error('Failed to set cache:', error);
    }
  }

  private async deleteFromCache(key: string): Promise<void> {
    try {
      // In a real implementation: await this.redisClient.del(key);
      console.log(`Deleted cache key: ${key}`);
    } catch (error) {
      console.error('Failed to delete from cache:', error);
    }
  }

  async batchGetUsers(userIds: string[]): Promise<Map<string, any>> {
    const result = new Map<string, any>();
    
    try {
      // In a real implementation, you would use Redis MGET for better performance
      for (const userId of userIds) {
        const user = await this.getUserWithCache(userId);
        if (user) {
          result.set(userId, user);
        }
      }
    } catch (error) {
      console.error('Failed to batch get users:', error);
    }
    
    return result;
  }
} 