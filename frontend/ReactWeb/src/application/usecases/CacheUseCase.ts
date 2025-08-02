import type { IUserRepository } from '../repositories/IUserRepository';
import type { IChannelRepository } from '../repositories/IChannelRepository';
import type { IMessageRepository } from '../repositories/IMessageRepository';
import { DomainErrorFactory } from '../errors/DomainError';

export interface CacheKey {
  type: 'user' | 'channel' | 'message' | 'permission';
  id: string;
  subKey?: string;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds
  maxSize?: number; // Maximum number of entries
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
}

export class CacheUseCase {
  private cache = new Map<string, CacheEntry>();
  private stats = { hits: 0, misses: 0, size: 0, maxSize: 1000 };
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly options: CacheOptions = {}
  ) {
    this.stats.maxSize = options.maxSize || 1000;
  }

  async getUserWithCache(userId: string): Promise<any> {
    const cacheKey = this.generateCacheKey({ type: 'user', id: userId });
    
    // Try to get from cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // If not in cache, fetch from repository
    const user = await this.userRepository.findById(userId);
    if (user) {
      this.setCache(cacheKey, user.toJSON());
    }
    
    return user;
  }

  async getChannelWithCache(channelId: string): Promise<any> {
    const cacheKey = this.generateCacheKey({ type: 'channel', id: channelId });
    
    // Try to get from cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // If not in cache, fetch from repository
    const channel = await this.channelRepository.findById(channelId);
    if (channel) {
      this.setCache(cacheKey, channel.toJSON());
    }
    
    return channel;
  }

  async getMessagesWithCache(channelId: string, limit?: number, offset?: number): Promise<any[]> {
    const cacheKey = this.generateCacheKey({ 
      type: 'message', 
      id: channelId, 
      subKey: `limit_${limit}_offset_${offset}` 
    });
    
    // Try to get from cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // If not in cache, fetch from repository
    const messages = await this.messageRepository.findByChannelId(channelId, limit, offset);
    const messageData = messages.map(message => message.toJSON());
    
    this.setCache(cacheKey, messageData, 2 * 60 * 1000); // 2 minutes TTL for messages
    
    return messageData;
  }

  async invalidateUserCache(userId: string): Promise<void> {
    const cacheKey = this.generateCacheKey({ type: 'user', id: userId });
    this.deleteFromCache(cacheKey);
  }

  async invalidateChannelCache(channelId: string): Promise<void> {
    const cacheKey = this.generateCacheKey({ type: 'channel', id: channelId });
    this.deleteFromCache(cacheKey);
    
    // Also invalidate related message caches
    this.invalidateMessageCaches(channelId);
  }

  async invalidateMessageCaches(channelId: string): Promise<void> {
    // Delete all message caches for this channel
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.includes(`message:${channelId}`)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.deleteFromCache(key));
  }

  async getCacheStats(): Promise<CacheStats> {
    return { ...this.stats, size: this.cache.size };
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.stats.size = 0;
  }

  async warmupCache(userIds: string[], channelIds: string[]): Promise<void> {
    try {
      // Warm up user cache
      const userPromises = userIds.map(userId => 
        this.getUserWithCache(userId).catch(() => null)
      );
      
      // Warm up channel cache
      const channelPromises = channelIds.map(channelId => 
        this.getChannelWithCache(channelId).catch(() => null)
      );
      
      // Wait for all warmup operations to complete
      await Promise.all([...userPromises, ...channelPromises]);
      
      console.log(`Cache warmup completed. Users: ${userIds.length}, Channels: ${channelIds.length}`);
    } catch (error) {
      console.error('Cache warmup failed:', error);
    }
  }

  private generateCacheKey(key: CacheKey): string {
    const { type, id, subKey } = key;
    return subKey ? `${type}:${id}:${subKey}` : `${type}:${id}`;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    // Check if entry has expired
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.deleteFromCache(key);
      this.stats.misses++;
      return null;
    }
    
    this.stats.hits++;
    return entry.data as T;
  }

  private setCache<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.options.ttl || this.defaultTTL,
    };
    
    // Check if cache is full
    if (this.cache.size >= this.stats.maxSize) {
      this.evictOldestEntry();
    }
    
    this.cache.set(key, entry);
    this.stats.size = this.cache.size;
  }

  private deleteFromCache(key: string): void {
    if (this.cache.delete(key)) {
      this.stats.size = this.cache.size;
    }
  }

  private evictOldestEntry(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.deleteFromCache(oldestKey);
    }
  }

  // Batch operations for better performance
  async batchGetUsers(userIds: string[]): Promise<Map<string, any>> {
    const result = new Map<string, any>();
    const uncachedIds: string[] = [];
    
    // Check cache first
    for (const userId of userIds) {
      const cached = this.getFromCache(this.generateCacheKey({ type: 'user', id: userId }));
      if (cached) {
        result.set(userId, cached);
      } else {
        uncachedIds.push(userId);
      }
    }
    
    // Fetch uncached users in parallel
    if (uncachedIds.length > 0) {
      const userPromises = uncachedIds.map(async (userId) => {
        try {
          const user = await this.userRepository.findById(userId);
          if (user) {
            const userData = user.toJSON();
            this.setCache(this.generateCacheKey({ type: 'user', id: userId }), userData);
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
  }
} 