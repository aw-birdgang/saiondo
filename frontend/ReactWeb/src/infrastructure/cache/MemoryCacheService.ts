export interface ICacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface ICacheService {
  get<T>(key: string): T | null;
  set<T>(key: string, data: T, ttl?: number): void;
  delete(key: string): void;
  clear(): void;
  has(key: string): boolean;
  size(): number;
  keys(): string[];
}

export class MemoryCacheService implements ICacheService {
  private cache = new Map<string, ICacheItem<any>>();
  private maxSize = 1000; // 최대 캐시 항목 수
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.startCleanupInterval();
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // TTL 체크
    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T, ttl: number = 300000): void {
    // 기본 5분
    // 캐시 크기 제한 체크
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    // TTL 체크
    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private startCleanupInterval(): void {
    // 1분마다 만료된 항목 정리
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now > item.timestamp + item.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000);
  }

  stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  // 특화된 메서드들
  getOrSet<T>(key: string, factory: () => T, ttl?: number): T {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = factory();
    this.set(key, data, ttl);
    return data;
  }

  async getOrSetAsync<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await factory();
    this.set(key, data, ttl);
    return data;
  }

  // 캐시 통계
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    missRate: number;
  } {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? this.hitCount / totalRequests : 0;
    const missRate = totalRequests > 0 ? this.missCount / totalRequests : 0;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate,
      missRate,
    };
  }

  private hitCount = 0;
  private missCount = 0;

  // 캐시 히트/미스 추적을 위한 래퍼 메서드
  getWithStats<T>(key: string): T | null {
    const result = this.get<T>(key);
    if (result !== null) {
      this.hitCount++;
    } else {
      this.missCount++;
    }
    return result;
  }

  // 캐시 그룹 관리
  private groups = new Map<string, Set<string>>();

  addToGroup(groupName: string, key: string): void {
    if (!this.groups.has(groupName)) {
      this.groups.set(groupName, new Set());
    }
    this.groups.get(groupName)!.add(key);
  }

  removeFromGroup(groupName: string, key: string): void {
    const group = this.groups.get(groupName);
    if (group) {
      group.delete(key);
      if (group.size === 0) {
        this.groups.delete(groupName);
      }
    }
  }

  clearGroup(groupName: string): void {
    const group = this.groups.get(groupName);
    if (group) {
      for (const key of group) {
        this.delete(key);
      }
      this.groups.delete(groupName);
    }
  }

  // 캐시 프리로딩
  async preload<T>(
    keys: string[],
    factory: (key: string) => Promise<T>,
    ttl?: number
  ): Promise<void> {
    const promises = keys.map(async key => {
      if (!this.has(key)) {
        try {
          const data = await factory(key);
          this.set(key, data, ttl);
        } catch (error) {
          console.warn(`Failed to preload cache for key: ${key}`, error);
        }
      }
    });

    await Promise.all(promises);
  }
}
