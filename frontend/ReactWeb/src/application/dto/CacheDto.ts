/**
 * Cache Use Case DTOs
 * 캐시 관련 Request/Response 인터페이스
 */

export interface CacheRequest {
  key: string;
  value: any;
  ttl?: number; // Time to live in seconds
}

export interface CacheResponse {
  success: boolean;
  cachedAt: Date;
  expiresAt?: Date;
}

export interface GetCacheRequest {
  key: string;
}

export interface GetCacheResponse {
  value: any;
  cachedAt: Date;
  expiresAt?: Date;
  exists: boolean;
}

export interface DeleteCacheRequest {
  key: string;
}

export interface DeleteCacheResponse {
  success: boolean;
  deleted: boolean;
}

export interface CacheStats {
  totalKeys: number;
  memoryUsage: number;
  hitRate: number;
  missRate: number;
}

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
} 