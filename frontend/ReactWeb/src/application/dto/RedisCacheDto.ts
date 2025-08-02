/**
 * RedisCache Use Case DTOs
 * Redis 캐시 관련 Request/Response 인터페이스
 */

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  defaultTTL?: number; // seconds
}

export interface RedisCacheRequest {
  key: string;
  value: any;
  ttl?: number;
  namespace?: string;
}

export interface RedisCacheResponse {
  success: boolean;
  cachedAt: Date;
  expiresAt?: Date;
}

export interface GetRedisCacheRequest {
  key: string;
  namespace?: string;
}

export interface GetRedisCacheResponse {
  value: any;
  cachedAt: Date;
  expiresAt?: Date;
  exists: boolean;
}

export interface DeleteRedisCacheRequest {
  key: string;
  namespace?: string;
}

export interface DeleteRedisCacheResponse {
  success: boolean;
  deleted: boolean;
}

export interface RedisCacheStats {
  totalKeys: number;
  memoryUsage: number;
  hitRate: number;
  missRate: number;
  connectedClients: number;
  uptime: number;
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