export interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 1 hour)
  prefix?: string; // Cache key prefix
}

export class LocalStorageCache {
  private readonly defaultTTL = 60 * 60 * 1000; // 1 hour
  private readonly prefix: string;

  constructor(options: CacheOptions = {}) {
    this.prefix = options.prefix || 'app_cache_';
  }

  /**
   * 캐시에 데이터 저장
   */
  set<T>(key: string, value: T, ttl?: number): void {
    try {
      const cacheKey = this.getCacheKey(key);
      const item: CacheItem<T> = {
        value,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTTL,
      };

      localStorage.setItem(cacheKey, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to set cache item:', error);
      // LocalStorage가 가득 찬 경우 오래된 항목들을 정리
      this.cleanup();
    }
  }

  /**
   * 캐시에서 데이터 조회
   */
  get<T>(key: string): T | null {
    try {
      const cacheKey = this.getCacheKey(key);
      const itemStr = localStorage.getItem(cacheKey);

      if (!itemStr) {
        return null;
      }

      const item: CacheItem<T> = JSON.parse(itemStr);

      // TTL 확인
      if (this.isExpired(item)) {
        this.delete(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Failed to get cache item:', error);
      return null;
    }
  }

  /**
   * 캐시에서 데이터 삭제
   */
  delete(key: string): void {
    try {
      const cacheKey = this.getCacheKey(key);
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Failed to delete cache item:', error);
    }
  }

  /**
   * 모든 캐시 데이터 삭제
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * 캐시에 데이터가 존재하는지 확인
   */
  has(key: string): boolean {
    try {
      const cacheKey = this.getCacheKey(key);
      const itemStr = localStorage.getItem(cacheKey);

      if (!itemStr) {
        return false;
      }

      const item: CacheItem<any> = JSON.parse(itemStr);
      return !this.isExpired(item);
    } catch (error) {
      console.error('Failed to check cache item:', error);
      return false;
    }
  }

  /**
   * 캐시 크기 조회
   */
  size(): number {
    try {
      const keys = Object.keys(localStorage);
      return keys.filter(key => key.startsWith(this.prefix)).length;
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  }

  /**
   * 만료된 캐시 항목들 정리
   */
  cleanup(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          try {
            const itemStr = localStorage.getItem(key);
            if (itemStr) {
              const item: CacheItem<any> = JSON.parse(itemStr);
              if (this.isExpired(item)) {
                localStorage.removeItem(key);
              }
            }
          } catch (error) {
            // 잘못된 JSON 형식의 항목 삭제
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Failed to cleanup cache:', error);
    }
  }

  /**
   * 캐시 통계 정보 조회
   */
  getStats(): {
    totalItems: number;
    expiredItems: number;
    validItems: number;
    totalSize: number;
  } {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));

      let expiredCount = 0;
      let validCount = 0;
      let totalSize = 0;

      cacheKeys.forEach(key => {
        try {
          const itemStr = localStorage.getItem(key);
          if (itemStr) {
            totalSize += itemStr.length;
            const item: CacheItem<any> = JSON.parse(itemStr);

            if (this.isExpired(item)) {
              expiredCount++;
            } else {
              validCount++;
            }
          }
        } catch (error) {
          expiredCount++;
        }
      });

      return {
        totalItems: cacheKeys.length,
        expiredItems: expiredCount,
        validItems: validCount,
        totalSize,
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        totalItems: 0,
        expiredItems: 0,
        validItems: 0,
        totalSize: 0,
      };
    }
  }

  private getCacheKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }
}

export default LocalStorageCache;
