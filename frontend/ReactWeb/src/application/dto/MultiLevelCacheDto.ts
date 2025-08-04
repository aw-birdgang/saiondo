/**
 * Multi-Level Cache Use Case DTOs
 * 다단계 캐시 관련 Request/Response 인터페이스
 */

export interface CacheLevel {
  name: string;
  ttl: number;
  maxSize: number;
  priority: number;
}

export interface MultiLevelCacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  metadata?: Record<string, any>;
}

export interface CacheStats {
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  totalSize: number;
  evictions: number;
  levels: Record<string, {
    hits: number;
    misses: number;
    hitRate: number;
    size: number;
    evictions: number;
  }>;
}

export interface CacheConfig {
  levels: CacheLevel[];
  enableCompression?: boolean;
  enableMetrics?: boolean;
  defaultTTL?: number;
}

export interface CacheLifecycle {
  oldestEntries: Array<{ key: string; age: number; level: string }>;
  mostAccessed: Array<{ key: string; accessCount: number; level: string }>;
  expiringSoon: Array<{ key: string; expiresIn: number; level: string }>;
}

export interface CacheWarmupRequest {
  keys: string[];
  fetcher: (key: string) => Promise<any>;
}

export interface CacheBatchRequest<T> {
  entries: Array<{ key: string; value: T; ttl?: number }>;
} 