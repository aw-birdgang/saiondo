import type { ILogger } from '../../../domain/interfaces/ILogger';

/**
 * 캐시 인터페이스
 */
export interface ICache {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttl?: number): void;
  delete(key: string): void;
  clear(): void;
  has(key: string): boolean;
  keys(): string[];
}

/**
 * 메모리 캐시 구현체
 */
export class MemoryCache implements ICache {
  private cache = new Map<string, { value: any; expiry?: number }>();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // TTL 체크
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value as T;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const expiry = ttl ? Date.now() + ttl * 1000 : undefined;
    this.cache.set(key, { value, expiry });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

/**
 * 캐시 서비스의 기본 추상 클래스
 * 공통 캐싱 기능을 제공
 */
export abstract class BaseCacheService {
  protected cache: ICache;
  protected logger?: ILogger;

  constructor(cache?: ICache, logger?: ILogger) {
    this.cache = cache || new MemoryCache();
    this.logger = logger;
  }

  /**
   * 캐시에서 데이터 조회
   */
  protected async getCached<T>(
    key: string, 
    ttl: number = 300 // 기본 5분
  ): Promise<T | null> {
    try {
      const cached = this.cache.get<T>(key);
      if (cached) {
        this.logger?.debug(`Cache hit for key: ${key}`);
        return cached;
      }
      
      this.logger?.debug(`Cache miss for key: ${key}`);
      return null;
    } catch (error) {
      this.logger?.error(`Failed to get cached data for key: ${key}`, { error });
      return null;
    }
  }

  /**
   * 캐시에 데이터 저장
   */
  protected async setCached<T>(
    key: string, 
    data: T, 
    ttl: number = 300
  ): Promise<void> {
    try {
      this.cache.set(key, data, ttl);
      this.logger?.debug(`Cached data for key: ${key} with TTL: ${ttl}s`);
    } catch (error) {
      this.logger?.error(`Failed to cache data for key: ${key}`, { error });
    }
  }

  /**
   * 캐시 무효화 (단일 키)
   */
  protected invalidateCache(key: string): void {
    try {
      this.cache.delete(key);
      this.logger?.debug(`Invalidated cache for key: ${key}`);
    } catch (error) {
      this.logger?.error(`Failed to invalidate cache for key: ${key}`, { error });
    }
  }

  /**
   * 패턴 기반 캐시 무효화
   */
  protected invalidateCachePattern(pattern: string): void {
    try {
      const keys = this.cache.keys();
      const matchingKeys = keys.filter(key => key.includes(pattern));
      
      matchingKeys.forEach(key => {
        this.cache.delete(key);
        this.logger?.debug(`Invalidated cache for pattern: ${pattern}, key: ${key}`);
      });
    } catch (error) {
      this.logger?.error(`Failed to invalidate cache pattern: ${pattern}`, { error });
    }
  }

  /**
   * 캐시 통계 조회
   */
  protected getCacheStats(): CacheStats {
    const keys = this.cache.keys();
    return {
      totalKeys: keys.length,
      keys: keys,
      size: keys.length // 간단한 구현, 실제로는 메모리 사용량을 측정해야 함
    };
  }

  /**
   * 캐시 전체 클리어
   */
  protected clearCache(): void {
    try {
      this.cache.clear();
      this.logger?.info('Cache cleared');
    } catch (error) {
      this.logger?.error('Failed to clear cache', { error });
    }
  }

  /**
   * 캐시 키 생성
   * 서비스별로 일관된 캐시 키를 생성할 수 있도록 도움
   */
  protected generateCacheKey(prefix: string, ...parts: (string | number)[]): string {
    const sanitizedParts = parts.map(part => 
      String(part).replace(/[^a-zA-Z0-9_-]/g, '_')
    );
    return `${prefix}:${sanitizedParts.join(':')}`;
  }

  /**
   * 캐시 TTL 계산
   * 데이터 타입에 따라 적절한 TTL을 계산
   */
  protected calculateTTL(dataType: CacheDataType): number {
    const ttlMap: Record<CacheDataType, number> = {
      'user_profile': 1800,    // 30분
      'channel_info': 900,     // 15분
      'channel_list': 900,     // 15분
      'message_list': 300,     // 5분
      'analytics_report': 3600, // 1시간
      'search_results': 600,   // 10분
      'permissions': 1800,     // 30분
      'temporary': 60,         // 1분
      'session': 3600,         // 1시간
    };
    
    return ttlMap[dataType] || 300; // 기본 5분
  }
}

// 타입 정의
export interface CacheStats {
  totalKeys: number;
  keys: string[];
  size: number;
}

export type CacheDataType = 
  | 'user_profile'
  | 'channel_info'
  | 'channel_list'
  | 'message_list'
  | 'analytics_report'
  | 'search_results'
  | 'permissions'
  | 'temporary'
  | 'session'; 