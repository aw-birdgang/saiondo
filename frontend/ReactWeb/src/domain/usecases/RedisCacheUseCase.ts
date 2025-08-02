import type { IUserRepository } from '../repositories/IUserRepository';
import type { IChannelRepository } from '../repositories/IChannelRepository';
import type { IMessageRepository } from '../repositories/IMessageRepository';
import { DomainErrorFactory } from '../errors/DomainError';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  defaultTTL?: number; // seconds
}

export interface CacheOperation {
  operation: 'get' | 'set' | 'del' | 'exists' | 'expire' | 'ttl';
  key: string;
  value?: any;
  ttl?: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  memoryUsage: number;
  connectedClients: number;
}

export interface CachePattern {
  pattern: string;
  keys: string[];
  count: number;
}

export class RedisCacheUseCase {
  private redisClient: any; // Redis client instance
  private config: RedisConfig;
  private isConnected = false;
  private stats = { hits: 0, misses: 0, keys: 0, memoryUsage: 0, connectedClients: 0 };

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    config: RedisConfig
  ) {
    this.config = {
      host: 'localhost',
      port: 6379,
      keyPrefix: 'saiondo:',
      defaultTTL: 300, // 5 minutes
      ...config,
    };
    this.initializeRedis();
  }

  private async initializeRedis(): Promise<void> {
    try {
      // In real implementation, this would initialize Redis client
      // For now, we'll simulate Redis operations
      console.log('Initializing Redis connection...');
      this.isConnected = true;
      console.log('Redis connected successfully');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      this.isConnected = false;
    }
  }

  async getUserWithCache(userId: string): Promise<any> {
    try {
      const cacheKey = this.generateKey('user', userId);
      
      // Try to get from cache
      const cached = await this.get(cacheKey);
      if (cached) {
        this.stats.hits++;
        return cached;
      }

      this.stats.misses++;

      // If not in cache, fetch from repository
      const user = await this.userRepository.findById(userId);
      if (user) {
        const userData = user.toJSON();
        await this.set(cacheKey, userData, this.config.defaultTTL);
      }
      
      return user;
    } catch (error) {
      console.error('Failed to get user with cache:', error);
      // Fallback to direct repository call
      return await this.userRepository.findById(userId);
    }
  }

  async getChannelWithCache(channelId: string): Promise<any> {
    try {
      const cacheKey = this.generateKey('channel', channelId);
      
      // Try to get from cache
      const cached = await this.get(cacheKey);
      if (cached) {
        this.stats.hits++;
        return cached;
      }

      this.stats.misses++;

      // If not in cache, fetch from repository
      const channel = await this.channelRepository.findById(channelId);
      if (channel) {
        const channelData = channel.toJSON();
        await this.set(cacheKey, channelData, this.config.defaultTTL);
      }
      
      return channel;
    } catch (error) {
      console.error('Failed to get channel with cache:', error);
      // Fallback to direct repository call
      return await this.channelRepository.findById(channelId);
    }
  }

  async getMessagesWithCache(channelId: string, limit = 50, offset = 0): Promise<any[]> {
    try {
      const cacheKey = this.generateKey('messages', `${channelId}:${limit}:${offset}`);
      
      // Try to get from cache
      const cached = await this.get(cacheKey);
      if (cached) {
        this.stats.hits++;
        return cached;
      }

      this.stats.misses++;

      // If not in cache, fetch from repository
      const messages = await this.messageRepository.findByChannelId(channelId, limit, offset);
      const messageData = messages.map(message => message.toJSON());
      
      // Cache for shorter time for messages
      await this.set(cacheKey, messageData, 120); // 2 minutes
      
      return messageData;
    } catch (error) {
      console.error('Failed to get messages with cache:', error);
      // Fallback to direct repository call
      const messages = await this.messageRepository.findByChannelId(channelId, limit, offset);
      return messages.map(message => message.toJSON());
    }
  }

  async invalidateUserCache(userId: string): Promise<void> {
    try {
      const userKey = this.generateKey('user', userId);
      await this.del(userKey);
      
      // Also invalidate related caches
      const patterns = [
        this.generateKey('messages', `*`),
        this.generateKey('channel', `*`),
      ];
      
      for (const pattern of patterns) {
        await this.deletePattern(pattern);
      }
    } catch (error) {
      console.error('Failed to invalidate user cache:', error);
    }
  }

  async invalidateChannelCache(channelId: string): Promise<void> {
    try {
      const channelKey = this.generateKey('channel', channelId);
      await this.del(channelKey);
      
      // Invalidate message caches for this channel
      const messagePattern = this.generateKey('messages', `${channelId}:*`);
      await this.deletePattern(messagePattern);
    } catch (error) {
      console.error('Failed to invalidate channel cache:', error);
    }
  }

  async batchGetUsers(userIds: string[]): Promise<Map<string, any>> {
    try {
      const result = new Map<string, any>();
      const uncachedIds: string[] = [];
      
      // Check cache for all users
      for (const userId of userIds) {
        const cacheKey = this.generateKey('user', userId);
        const cached = await this.get(cacheKey);
        if (cached) {
          result.set(userId, cached);
          this.stats.hits++;
        } else {
          uncachedIds.push(userId);
          this.stats.misses++;
        }
      }
      
      // Fetch uncached users in parallel
      if (uncachedIds.length > 0) {
        const userPromises = uncachedIds.map(async (userId) => {
          try {
            const user = await this.userRepository.findById(userId);
            if (user) {
              const userData = user.toJSON();
              const cacheKey = this.generateKey('user', userId);
              await this.set(cacheKey, userData, this.config.defaultTTL);
              return { userId, user: userData };
            }
            return { userId, user: null };
          } catch (error) {
            console.error(`Failed to fetch user ${userId}:`, error);
            return { userId, user: null };
          }
        });
        
        const userResults = await Promise.all(userPromises);
        
        for (const { userId, user } of userResults) {
          if (user) {
            result.set(userId, user);
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Failed to batch get users:', error);
      // Fallback to direct repository calls
      const result = new Map<string, any>();
      for (const userId of userIds) {
        const user = await this.userRepository.findById(userId);
        if (user) {
          result.set(userId, user.toJSON());
        }
      }
      return result;
    }
  }

  async getCacheStats(): Promise<CacheStats> {
    try {
      // In real implementation, this would get actual Redis stats
      return {
        ...this.stats,
        keys: await this.getKeyCount(),
        memoryUsage: await this.getMemoryUsage(),
        connectedClients: await this.getConnectedClients(),
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        hits: this.stats.hits,
        misses: this.stats.misses,
        keys: 0,
        memoryUsage: 0,
        connectedClients: 0,
      };
    }
  }

  async flushCache(): Promise<void> {
    try {
      const pattern = this.generateKey('*');
      await this.deletePattern(pattern);
      console.log('Cache flushed successfully');
    } catch (error) {
      console.error('Failed to flush cache:', error);
    }
  }

  async getKeysByPattern(pattern: string): Promise<string[]> {
    try {
      const fullPattern = this.generateKey(pattern);
      // In real implementation, this would use Redis SCAN command
      return [];
    } catch (error) {
      console.error('Failed to get keys by pattern:', error);
      return [];
    }
  }

  async setHash(key: string, hash: Record<string, any>, ttl?: number): Promise<void> {
    try {
      const fullKey = this.generateKey(key);
      // In real implementation, this would use Redis HSET
      await this.set(fullKey, hash, ttl || this.config.defaultTTL);
    } catch (error) {
      console.error('Failed to set hash:', error);
    }
  }

  async getHash(key: string): Promise<Record<string, any> | null> {
    try {
      const fullKey = this.generateKey(key);
      // In real implementation, this would use Redis HGETALL
      return await this.get(fullKey);
    } catch (error) {
      console.error('Failed to get hash:', error);
      return null;
    }
  }

  async incrementCounter(key: string, increment = 1): Promise<number> {
    try {
      const fullKey = this.generateKey(key);
      // In real implementation, this would use Redis INCR
      const current = await this.get(fullKey) || 0;
      const newValue = current + increment;
      await this.set(fullKey, newValue, this.config.defaultTTL);
      return newValue;
    } catch (error) {
      console.error('Failed to increment counter:', error);
      return 0;
    }
  }

  async setWithExpiry(key: string, value: any, ttl: number): Promise<void> {
    try {
      const fullKey = this.generateKey(key);
      await this.set(fullKey, value, ttl);
    } catch (error) {
      console.error('Failed to set with expiry:', error);
    }
  }

  async getTTL(key: string): Promise<number> {
    try {
      const fullKey = this.generateKey(key);
      // In real implementation, this would use Redis TTL
      return 0;
    } catch (error) {
      console.error('Failed to get TTL:', error);
      return -1;
    }
  }

  async isConnected(): Promise<boolean> {
    return this.isConnected;
  }

  async reconnect(): Promise<void> {
    try {
      console.log('Attempting to reconnect to Redis...');
      await this.initializeRedis();
    } catch (error) {
      console.error('Failed to reconnect to Redis:', error);
    }
  }

  // Private helper methods
  private generateKey(...parts: string[]): string {
    return `${this.config.keyPrefix}${parts.join(':')}`;
  }

  private async get(key: string): Promise<any> {
    // In real implementation, this would use Redis GET
    // For now, return null to simulate cache miss
    return null;
  }

  private async set(key: string, value: any, ttl?: number): Promise<void> {
    // In real implementation, this would use Redis SET with EX
    console.log(`Setting cache key: ${key}, TTL: ${ttl}s`);
  }

  private async del(key: string): Promise<void> {
    // In real implementation, this would use Redis DEL
    console.log(`Deleting cache key: ${key}`);
  }

  private async deletePattern(pattern: string): Promise<void> {
    // In real implementation, this would use Redis SCAN + DEL
    console.log(`Deleting cache pattern: ${pattern}`);
  }

  private async getKeyCount(): Promise<number> {
    // In real implementation, this would use Redis DBSIZE
    return 0;
  }

  private async getMemoryUsage(): Promise<number> {
    // In real implementation, this would use Redis INFO memory
    return 0;
  }

  private async getConnectedClients(): Promise<number> {
    // In real implementation, this would use Redis INFO clients
    return 0;
  }
} 