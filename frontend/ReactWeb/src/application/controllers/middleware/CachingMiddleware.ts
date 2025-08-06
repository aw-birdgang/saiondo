import { BaseMiddleware } from '@/application/controllers/interfaces/IControllerMiddleware';
import type {
  ControllerContext,
  ControllerResult,
} from '@/application/controllers/interfaces/IController';
import { Logger } from '@/shared/utils/Logger';

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * 캐싱 미들웨어
 * Controller 실행 결과를 캐시하여 성능 향상
 */
export class CachingMiddleware extends BaseMiddleware {
  private readonly logger = new Logger('CachingMiddleware');
  private cache: Map<string, CacheEntry> = new Map();
  private readonly defaultTTL = 5 * 60 * 1000; // 5분

  constructor() {
    super('CachingMiddleware', 30);
  }

  async beforeExecute(
    controllerName: string,
    operation: string,
    params: any,
    context: ControllerContext
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(controllerName, operation, params);
    const cachedEntry = this.cache.get(cacheKey);

    if (cachedEntry && !this.isExpired(cachedEntry)) {
      this.logger.info(`Cache hit for ${controllerName}.${operation}`, {
        flowId: context.requestId,
        cacheKey,
      });

      // 캐시된 결과를 context에 저장하여 afterExecute에서 사용
      (context as any).cachedResult = cachedEntry.data;
      (context as any).cacheKey = cacheKey;
    }
  }

  async afterExecute(
    controllerName: string,
    operation: string,
    result: ControllerResult,
    context: ControllerContext
  ): Promise<void> {
    // 캐시된 결과가 있으면 그대로 반환
    if ((context as any).cachedResult) {
      result.data = (context as any).cachedResult;
      result.executionTime = 0; // 캐시된 결과는 실행 시간 0
      return;
    }

    // 성공한 결과만 캐시
    if (result.success && result.data) {
      const cacheKey = this.generateCacheKey(
        controllerName,
        operation,
        (context as any).metadata?.params
      );
      const ttl = this.getTTLForOperation(controllerName, operation);

      this.cache.set(cacheKey, {
        data: result.data,
        timestamp: Date.now(),
        ttl,
      });

      this.logger.info(`Cached result for ${controllerName}.${operation}`, {
        flowId: result.flowId,
        cacheKey,
        ttl,
      });
    }
  }

  async onError(
    controllerName: string,
    operation: string,
    error: Error,
    context: ControllerContext
  ): Promise<void> {
    // 에러 발생 시 캐시 무효화
    const cacheKey = this.generateCacheKey(
      controllerName,
      operation,
      (context as any).metadata?.params
    );
    if (this.cache.has(cacheKey)) {
      this.cache.delete(cacheKey);
      this.logger.info(
        `Invalidated cache for ${controllerName}.${operation} due to error`,
        {
          flowId: context.requestId,
          cacheKey,
          error: error.message,
        }
      );
    }
  }

  /**
   * 캐시 키 생성
   */
  private generateCacheKey(
    controllerName: string,
    operation: string,
    params: any
  ): string {
    const paramsHash = JSON.stringify(params || {});
    return `${controllerName}:${operation}:${this.hashString(paramsHash)}`;
  }

  /**
   * 문자열 해시 생성
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 32bit 정수로 변환
    }
    return hash.toString(36);
  }

  /**
   * 캐시 만료 확인
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * 작업별 TTL 설정
   */
  private getTTLForOperation(
    controllerName: string,
    operation: string
  ): number {
    // 작업별로 다른 TTL 설정
    const ttlMap: Record<string, number> = {
      'UserController:getCurrentUser': 10 * 60 * 1000, // 10분
      'UserController:getUserProfile': 5 * 60 * 1000, // 5분
      'ChannelController:getChannels': 2 * 60 * 1000, // 2분
      'MessageController:getMessages': 1 * 60 * 1000, // 1분
    };

    const key = `${controllerName}:${operation}`;
    return ttlMap[key] || this.defaultTTL;
  }

  /**
   * 캐시 통계 조회
   */
  getCacheStats(): {
    totalEntries: number;
    hitRate: number;
    totalHits: number;
    totalRequests: number;
  } {
    const totalEntries = this.cache.size;
    const totalHits = (this as any).totalHits || 0;
    const totalRequests = (this as any).totalRequests || 0;
    const hitRate = totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0;

    return {
      totalEntries,
      hitRate,
      totalHits,
      totalRequests,
    };
  }

  /**
   * 캐시 무효화
   */
  invalidateCache(pattern?: string): number {
    if (!pattern) {
      const size = this.cache.size;
      this.cache.clear();
      this.logger.info('All cache invalidated', { clearedEntries: size });
      return size;
    }

    let clearedCount = 0;
    for (const [key] of this.cache.entries()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        clearedCount++;
      }
    }

    this.logger.info(`Cache invalidated for pattern: ${pattern}`, {
      clearedEntries: clearedCount,
    });
    return clearedCount;
  }

  /**
   * 만료된 캐시 정리
   */
  cleanupExpiredEntries(): number {
    let cleanedCount = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.info('Expired cache entries cleaned', {
        cleanedEntries: cleanedCount,
      });
    }

    return cleanedCount;
  }
}
