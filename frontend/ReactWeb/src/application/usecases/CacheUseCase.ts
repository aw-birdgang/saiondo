import type {IUserRepository} from '../../domain/repositories/IUserRepository';
import type {IChannelRepository} from '../../domain/repositories/IChannelRepository';
import type {IMessageRepository} from '../../domain/repositories/IMessageRepository';
import type {CacheStats} from '../dto/CacheDto';

export class CacheUseCase {
  private cache = new Map<string, any>();
  private stats = { hits: 0, misses: 0, size: 0, maxSize: 1000 };
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly options: { ttl?: number; maxSize?: number } = {}
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
    const cached = this.getFromCache<any[]>(cacheKey);
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
  }

  async invalidateMessageCaches(channelId: string): Promise<void> {
    // Delete all message caches for this channel
    const cacheKey = this.generateCacheKey({ type: 'message', id: channelId });
    this.deleteFromCache(cacheKey);
  }

  async getCacheStats(): Promise<CacheStats> {
    return {
      ...this.stats,
      totalKeys: this.cache.size,
      memoryUsage: 0,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      missRate: this.stats.misses / (this.stats.hits + this.stats.misses) || 0
    };
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.stats.size = 0;
  }

  async warmupCache(userIds: string[], channelIds: string[]): Promise<void> {
    // Pre-load frequently accessed data into cache
    for (const userId of userIds) {
      await this.getUserWithCache(userId);
    }

    for (const channelId of channelIds) {
      await this.getChannelWithCache(channelId);
    }
  }

  private generateCacheKey(key: { type: string; id: string; subKey?: string }): string {
    return `${key.type}:${key.id}${key.subKey ? `:${key.subKey}` : ''}`;
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
    return entry.data;
  }

  private setCache<T>(key: string, data: T, ttl?: number): void {
    const entry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    // Check if cache is full
    if (this.cache.size >= this.stats.maxSize) {
      this.evictOldestEntry();
    }

    this.cache.set(key, entry);
    this.stats.size = this.cache.size;
  }

  private deleteFromCache(key: string): void {
    this.cache.delete(key);
    this.stats.size = this.cache.size;
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

  async batchGetUsers(userIds: string[]): Promise<Map<string, any>> {
    const result = new Map<string, any>();
    const uncachedUserIds: string[] = [];

    // First, try to get from cache
    for (const userId of userIds) {
      const cached = await this.getUserWithCache(userId);
      if (cached) {
        result.set(userId, cached);
      } else {
        uncachedUserIds.push(userId);
      }
    }

    // Then, fetch uncached users from repository
    for (const userId of uncachedUserIds) {
      const user = await this.userRepository.findById(userId);
      if (user) {
        const userData = user.toJSON();
        result.set(userId, userData);
        this.setCache(this.generateCacheKey({ type: 'user', id: userId }), userData);
      }
    }

    return result;
  }
}
