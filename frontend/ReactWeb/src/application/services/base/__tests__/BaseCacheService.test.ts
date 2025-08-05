import { BaseCacheService, MemoryCache, type ICache } from '../BaseCacheService';
import { ConsoleLogger } from '../../../../domain/interfaces/ILogger';

// 테스트용 Cache Service 구현체
class TestCacheService extends BaseCacheService {
  constructor(cache?: ICache, logger?: ConsoleLogger) {
    super(cache, logger);
  }

  async testGetCached<T>(key: string, ttl: number = 300): Promise<T | null> {
    return await this.getCached<T>(key, ttl);
  }

  async testSetCached<T>(key: string, data: T, ttl: number = 300): Promise<void> {
    return await this.setCached<T>(key, data, ttl);
  }

  testInvalidateCache(key: string): void {
    return this.invalidateCache(key);
  }

  testInvalidateCachePattern(pattern: string): void {
    return this.invalidateCachePattern(pattern);
  }

  testGetCacheStats(): any {
    return this.getCacheStats();
  }

  testClearCache(): void {
    return this.clearCache();
  }

  testGenerateCacheKey(prefix: string, ...parts: (string | number)[]): string {
    return this.generateCacheKey(prefix, ...parts);
  }

  testCalculateTTL(dataType: any): number {
    return this.calculateTTL(dataType);
  }
}

describe('BaseCacheService', () => {
  let cacheService: TestCacheService;
  let mockCache: jest.Mocked<ICache>;
  let mockLogger: jest.Mocked<ConsoleLogger>;

  beforeEach(() => {
    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    };

    cacheService = new TestCacheService(mockCache, mockLogger);
  });

  describe('getCached', () => {
    it('should return cached data when available', async () => {
      const cachedData = { id: 1, name: 'Test' };
      mockCache.get.mockResolvedValue(cachedData);

      const result = await cacheService.testGetCached('test-key');

      expect(result).toEqual(cachedData);
      expect(mockCache.get).toHaveBeenCalledWith('test-key');
    });

    it('should return null when cache miss', async () => {
      mockCache.get.mockResolvedValue(null);

      const result = await cacheService.testGetCached('test-key');

      expect(result).toBeNull();
      expect(mockCache.get).toHaveBeenCalledWith('test-key');
    });

    it('should handle cache errors gracefully', async () => {
      mockCache.get.mockRejectedValue(new Error('Cache error'));

      const result = await cacheService.testGetCached('test-key');

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Cache get error'),
        expect.objectContaining({
          key: 'test-key',
          error: expect.any(Error)
        })
      );
    });
  });

  describe('setCached', () => {
    it('should set data in cache successfully', async () => {
      const data = { id: 1, name: 'Test' };
      mockCache.set.mockResolvedValue();

      await cacheService.testSetCached('test-key', data, 600);

      expect(mockCache.set).toHaveBeenCalledWith('test-key', data, 600);
    });

    it('should use default TTL when not specified', async () => {
      const data = { id: 1, name: 'Test' };
      mockCache.set.mockResolvedValue();

      await cacheService.testSetCached('test-key', data);

      expect(mockCache.set).toHaveBeenCalledWith('test-key', data, 300);
    });

    it('should handle cache set errors gracefully', async () => {
      const data = { id: 1, name: 'Test' };
      mockCache.set.mockRejectedValue(new Error('Cache set error'));

      await cacheService.testSetCached('test-key', data);

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Cache set error'),
        expect.objectContaining({
          key: 'test-key',
          error: expect.any(Error)
        })
      );
    });
  });

  describe('invalidateCache', () => {
    it('should delete cache key successfully', () => {
      mockCache.delete.mockResolvedValue();

      cacheService.testInvalidateCache('test-key');

      expect(mockCache.delete).toHaveBeenCalledWith('test-key');
    });

    it('should handle cache delete errors gracefully', () => {
      mockCache.delete.mockRejectedValue(new Error('Cache delete error'));

      cacheService.testInvalidateCache('test-key');

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Cache delete error'),
        expect.objectContaining({
          key: 'test-key',
          error: expect.any(Error)
        })
      );
    });
  });

  describe('invalidateCachePattern', () => {
    it('should delete cache keys matching pattern', async () => {
      mockCache.keys.mockResolvedValue(['user:1', 'user:2', 'channel:1']);
      mockCache.delete.mockResolvedValue();

      await cacheService.testInvalidateCachePattern('user:*');

      expect(mockCache.keys).toHaveBeenCalled();
      expect(mockCache.delete).toHaveBeenCalledTimes(2);
      expect(mockCache.delete).toHaveBeenCalledWith('user:1');
      expect(mockCache.delete).toHaveBeenCalledWith('user:2');
    });

    it('should handle pattern matching errors gracefully', async () => {
      mockCache.keys.mockRejectedValue(new Error('Pattern matching error'));

      await cacheService.testInvalidateCachePattern('user:*');

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Cache pattern invalidation error'),
        expect.objectContaining({
          pattern: 'user:*',
          error: expect.any(Error)
        })
      );
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', () => {
      mockCache.keys.mockResolvedValue(['key1', 'key2', 'key3']);

      const stats = cacheService.testGetCacheStats();

      expect(stats).toEqual({
        totalKeys: 3,
        hitRate: expect.any(Number),
        missRate: expect.any(Number),
        averageTTL: expect.any(Number)
      });
    });
  });

  describe('clearCache', () => {
    it('should clear all cache successfully', () => {
      mockCache.clear.mockResolvedValue();

      cacheService.testClearCache();

      expect(mockCache.clear).toHaveBeenCalled();
    });

    it('should handle cache clear errors gracefully', () => {
      mockCache.clear.mockRejectedValue(new Error('Cache clear error'));

      cacheService.testClearCache();

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Cache clear error'),
        expect.objectContaining({
          error: expect.any(Error)
        })
      );
    });
  });

  describe('generateCacheKey', () => {
    it('should generate cache key with prefix and parts', () => {
      const key = cacheService.testGenerateCacheKey('user', '123', 'profile');

      expect(key).toBe('user:123:profile');
    });

    it('should handle empty parts', () => {
      const key = cacheService.testGenerateCacheKey('user');

      expect(key).toBe('user');
    });

    it('should handle mixed types', () => {
      const key = cacheService.testGenerateCacheKey('channel', '123', 456, 'messages');

      expect(key).toBe('channel:123:456:messages');
    });
  });

  describe('calculateTTL', () => {
    it('should return correct TTL for different data types', () => {
      expect(cacheService.testCalculateTTL('user_profile')).toBe(1800);
      expect(cacheService.testCalculateTTL('channel_list')).toBe(900);
      expect(cacheService.testCalculateTTL('analytics_report')).toBe(3600);
      expect(cacheService.testCalculateTTL('unknown_type')).toBe(300);
    });
  });
});

describe('MemoryCache', () => {
  let memoryCache: MemoryCache;

  beforeEach(() => {
    memoryCache = new MemoryCache();
  });

  describe('set and get', () => {
    it('should store and retrieve data', async () => {
      const data = { id: 1, name: 'Test' };
      
      await memoryCache.set('test-key', data, 1000);
      const result = await memoryCache.get('test-key');

      expect(result).toEqual(data);
    });

    it('should return null for expired data', async () => {
      const data = { id: 1, name: 'Test' };
      
      await memoryCache.set('test-key', data, 1);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const result = await memoryCache.get('test-key');
      expect(result).toBeNull();
    });

    it('should return null for non-existent key', async () => {
      const result = await memoryCache.get('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete existing key', async () => {
      await memoryCache.set('test-key', 'value', 1000);
      await memoryCache.delete('test-key');
      
      const result = await memoryCache.get('test-key');
      expect(result).toBeNull();
    });

    it('should handle deleting non-existent key', async () => {
      await expect(memoryCache.delete('non-existent')).resolves.not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all cached data', async () => {
      await memoryCache.set('key1', 'value1', 1000);
      await memoryCache.set('key2', 'value2', 1000);
      
      await memoryCache.clear();
      
      expect(await memoryCache.get('key1')).toBeNull();
      expect(await memoryCache.get('key2')).toBeNull();
    });
  });

  describe('has', () => {
    it('should return true for existing key', async () => {
      await memoryCache.set('test-key', 'value', 1000);
      
      const result = await memoryCache.has('test-key');
      expect(result).toBe(true);
    });

    it('should return false for non-existent key', async () => {
      const result = await memoryCache.has('non-existent');
      expect(result).toBe(false);
    });

    it('should return false for expired key', async () => {
      await memoryCache.set('test-key', 'value', 1);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const result = await memoryCache.has('test-key');
      expect(result).toBe(false);
    });
  });

  describe('keys', () => {
    it('should return all non-expired keys', async () => {
      await memoryCache.set('key1', 'value1', 1000);
      await memoryCache.set('key2', 'value2', 1000);
      await memoryCache.set('expired', 'value3', 1);
      
      // Wait for one key to expire
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const keys = await memoryCache.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).not.toContain('expired');
    });
  });
}); 