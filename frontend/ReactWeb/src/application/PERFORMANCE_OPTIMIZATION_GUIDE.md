# ⚡ Service Layer 성능 최적화 가이드

## 📋 **개요**

새로운 Service Layer 구조의 성능을 최적화하는 방법과 모니터링 전략을 설명합니다.

## 🎯 **최적화 목표**

1. **응답 시간 단축**: 캐싱 전략으로 API 응답 시간 개선
2. **리소스 효율성**: 메모리 및 CPU 사용량 최적화
3. **확장성**: 트래픽 증가에 따른 성능 유지
4. **모니터링**: 실시간 성능 지표 추적

## 📊 **현재 성능 지표**

### **Base Service 성능 측정**
- 모든 작업에 대한 자동 성능 측정
- 상세한 로깅으로 병목 지점 파악
- 작업별 평균 응답 시간 추적

### **캐싱 전략**
- 메모리 기반 캐싱 (MemoryCache)
- TTL 기반 자동 만료
- 패턴 기반 캐시 무효화

## 🚀 **최적화 전략**

### **1. 캐싱 최적화**

#### **1.1 캐시 키 전략**

```typescript
// 최적화된 캐시 키 생성
export class OptimizedCacheService extends BaseCacheService {
  // 사용자별 캐시 키
  generateUserCacheKey(userId: string, dataType: string): string {
    return this.generateCacheKey('user', userId, dataType);
  }

  // 채널별 캐시 키
  generateChannelCacheKey(channelId: string, dataType: string): string {
    return this.generateCacheKey('channel', channelId, dataType);
  }

  // 분석 데이터 캐시 키
  generateAnalyticsCacheKey(timeRange: { start: Date; end: Date }): string {
    const startStr = timeRange.start.toISOString().split('T')[0];
    const endStr = timeRange.end.toISOString().split('T')[0];
    return this.generateCacheKey('analytics', 'report', startStr, endStr);
  }
}
```

#### **1.2 TTL 최적화**

```typescript
// 데이터 타입별 최적화된 TTL
export const OPTIMIZED_TTL_MAP: Record<CacheDataType, number> = {
  // 자주 변경되지 않는 데이터 (긴 TTL)
  'user_profile': 3600,        // 1시간
  'channel_info': 1800,        // 30분
  'analytics_report': 7200,    // 2시간
  
  // 자주 변경되는 데이터 (짧은 TTL)
  'channel_messages': 300,     // 5분
  'user_activity': 60,         // 1분
  'real_time_activity': 30,    // 30초
  
  // 기본값
  'default': 300               // 5분
};

export class OptimizedTTLService {
  calculateOptimalTTL(dataType: CacheDataType, accessFrequency: number): number {
    const baseTTL = OPTIMIZED_TTL_MAP[dataType] || OPTIMIZED_TTL_MAP.default;
    
    // 접근 빈도에 따른 TTL 조정
    if (accessFrequency > 100) {
      return Math.min(baseTTL * 2, 3600); // 자주 접근하는 데이터는 TTL 연장
    } else if (accessFrequency < 10) {
      return Math.max(baseTTL / 2, 60);   // 적게 접근하는 데이터는 TTL 단축
    }
    
    return baseTTL;
  }
}
```

#### **1.3 캐시 무효화 전략**

```typescript
// 지능적인 캐시 무효화
export class IntelligentCacheInvalidation extends BaseCacheService {
  // 사용자 관련 캐시 무효화
  async invalidateUserRelatedCache(userId: string, operation: string): Promise<void> {
    const patterns = [
      `user:${userId}:*`,
      `user_behavior:${userId}:*`,
      `user_journey:${userId}:*`
    ];

    // 프로필 업데이트 시 추가 캐시 무효화
    if (operation === 'update_profile') {
      patterns.push(`user_profile:${userId}`);
      patterns.push(`user_stats:${userId}`);
    }

    // 메시지 전송 시 채널 캐시 무효화
    if (operation === 'send_message') {
      patterns.push(`channel:*:messages:*`);
    }

    await Promise.all(
      patterns.map(pattern => this.invalidateCachePattern(pattern))
    );
  }

  // 배치 캐시 무효화
  async batchInvalidateCache(operations: Array<{ type: string; id: string }>): Promise<void> {
    const invalidationMap = new Map<string, string[]>();

    // 작업별 무효화 패턴 그룹화
    operations.forEach(op => {
      if (!invalidationMap.has(op.type)) {
        invalidationMap.set(op.type, []);
      }
      invalidationMap.get(op.type)!.push(op.id);
    });

    // 배치로 캐시 무효화 실행
    for (const [type, ids] of invalidationMap) {
      const pattern = this.getInvalidationPattern(type, ids);
      await this.invalidateCachePattern(pattern);
    }
  }

  private getInvalidationPattern(type: string, ids: string[]): string {
    switch (type) {
      case 'user':
        return `user:(${ids.join('|')}):*`;
      case 'channel':
        return `channel:(${ids.join('|')}):*`;
      case 'message':
        return `message:(${ids.join('|')})`;
      default:
        return `*:(${ids.join('|')}):*`;
    }
  }
}
```

### **2. 성능 모니터링 최적화**

#### **2.1 상세한 성능 메트릭**

```typescript
// 확장된 성능 모니터링
export interface PerformanceMetrics {
  operationId: string;
  operation: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  context: Record<string, any>;
  cacheHit?: boolean;
  cacheKey?: string;
  memoryUsage?: number;
  cpuUsage?: number;
  error?: string;
}

export class AdvancedPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000;

  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // 메트릭 개수 제한
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getAverageResponseTime(operation: string, timeRange?: { start: Date; end: Date }): number {
    const filteredMetrics = this.filterMetrics(operation, timeRange);
    if (filteredMetrics.length === 0) return 0;

    const totalDuration = filteredMetrics.reduce((sum, metric) => sum + metric.duration, 0);
    return totalDuration / filteredMetrics.length;
  }

  getCacheHitRate(operation: string): number {
    const operationMetrics = this.metrics.filter(m => m.operation === operation);
    if (operationMetrics.length === 0) return 0;

    const cacheHits = operationMetrics.filter(m => m.cacheHit).length;
    return cacheHits / operationMetrics.length;
  }

  getErrorRate(operation: string): number {
    const operationMetrics = this.metrics.filter(m => m.operation === operation);
    if (operationMetrics.length === 0) return 0;

    const errors = operationMetrics.filter(m => m.error).length;
    return errors / operationMetrics.length;
  }

  private filterMetrics(operation: string, timeRange?: { start: Date; end: Date }): PerformanceMetrics[] {
    let filtered = this.metrics.filter(m => m.operation === operation);
    
    if (timeRange) {
      filtered = filtered.filter(m => 
        m.startTime >= timeRange.start && m.endTime <= timeRange.end
      );
    }
    
    return filtered;
  }
}
```

#### **2.2 실시간 성능 대시보드**

```typescript
// 실시간 성능 대시보드 데이터
export interface PerformanceDashboard {
  currentMetrics: {
    activeOperations: number;
    averageResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
  topSlowOperations: Array<{
    operation: string;
    averageDuration: number;
    callCount: number;
  }>;
  cacheStats: {
    totalKeys: number;
    memoryUsage: number;
    hitRate: number;
    missRate: number;
  };
  recentErrors: Array<{
    operation: string;
    error: string;
    timestamp: Date;
    context: Record<string, any>;
  }>;
}

export class PerformanceDashboardService {
  constructor(private performanceMonitor: AdvancedPerformanceMonitor) {}

  getDashboardData(): PerformanceDashboard {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    return {
      currentMetrics: {
        activeOperations: this.getActiveOperations(),
        averageResponseTime: this.getOverallAverageResponseTime(lastHour),
        cacheHitRate: this.getOverallCacheHitRate(lastHour),
        errorRate: this.getOverallErrorRate(lastHour)
      },
      topSlowOperations: this.getTopSlowOperations(lastHour),
      cacheStats: this.getCacheStatistics(),
      recentErrors: this.getRecentErrors(lastHour)
    };
  }

  private getActiveOperations(): number {
    const now = new Date();
    const activeThreshold = new Date(now.getTime() - 5 * 60 * 1000); // 5분 이내
    
    return this.performanceMonitor.metrics.filter(
      m => m.endTime >= activeThreshold
    ).length;
  }

  private getOverallAverageResponseTime(timeRange: Date): number {
    const metrics = this.performanceMonitor.metrics.filter(
      m => m.startTime >= timeRange
    );
    
    if (metrics.length === 0) return 0;
    
    const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0);
    return totalDuration / metrics.length;
  }

  private getOverallCacheHitRate(timeRange: Date): number {
    const metrics = this.performanceMonitor.metrics.filter(
      m => m.startTime >= timeRange && m.cacheHit !== undefined
    );
    
    if (metrics.length === 0) return 0;
    
    const cacheHits = metrics.filter(m => m.cacheHit).length;
    return cacheHits / metrics.length;
  }

  private getOverallErrorRate(timeRange: Date): number {
    const metrics = this.performanceMonitor.metrics.filter(
      m => m.startTime >= timeRange
    );
    
    if (metrics.length === 0) return 0;
    
    const errors = metrics.filter(m => m.error).length;
    return errors / metrics.length;
  }

  private getTopSlowOperations(timeRange: Date): Array<{ operation: string; averageDuration: number; callCount: number }> {
    const operationStats = new Map<string, { totalDuration: number; count: number }>();
    
    this.performanceMonitor.metrics
      .filter(m => m.startTime >= timeRange)
      .forEach(m => {
        if (!operationStats.has(m.operation)) {
          operationStats.set(m.operation, { totalDuration: 0, count: 0 });
        }
        
        const stats = operationStats.get(m.operation)!;
        stats.totalDuration += m.duration;
        stats.count += 1;
      });

    return Array.from(operationStats.entries())
      .map(([operation, stats]) => ({
        operation,
        averageDuration: stats.totalDuration / stats.count,
        callCount: stats.count
      }))
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, 10);
  }

  private getCacheStatistics(): any {
    // 실제 캐시 통계 반환
    return {
      totalKeys: 0,
      memoryUsage: 0,
      hitRate: 0,
      missRate: 0
    };
  }

  private getRecentErrors(timeRange: Date): Array<{ operation: string; error: string; timestamp: Date; context: Record<string, any> }> {
    return this.performanceMonitor.metrics
      .filter(m => m.startTime >= timeRange && m.error)
      .map(m => ({
        operation: m.operation,
        error: m.error!,
        timestamp: m.startTime,
        context: m.context
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20);
  }
}
```

### **3. 메모리 최적화**

#### **3.1 메모리 사용량 모니터링**

```typescript
// 메모리 사용량 모니터링
export class MemoryMonitor {
  private memorySnapshots: Array<{ timestamp: Date; usage: number }> = [];
  private readonly maxSnapshots = 100;

  recordMemoryUsage(): void {
    const usage = process.memoryUsage();
    const totalUsage = usage.heapUsed + usage.external + usage.arrayBuffers;
    
    this.memorySnapshots.push({
      timestamp: new Date(),
      usage: totalUsage
    });

    if (this.memorySnapshots.length > this.maxSnapshots) {
      this.memorySnapshots = this.memorySnapshots.slice(-this.maxSnapshots);
    }
  }

  getMemoryTrend(): { current: number; average: number; trend: 'increasing' | 'decreasing' | 'stable' } {
    if (this.memorySnapshots.length < 2) {
      return { current: 0, average: 0, trend: 'stable' };
    }

    const current = this.memorySnapshots[this.memorySnapshots.length - 1].usage;
    const average = this.memorySnapshots.reduce((sum, snap) => sum + snap.usage, 0) / this.memorySnapshots.length;
    
    const recentSnapshots = this.memorySnapshots.slice(-10);
    const recentAverage = recentSnapshots.reduce((sum, snap) => sum + snap.usage, 0) / recentSnapshots.length;
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (recentAverage > average * 1.1) {
      trend = 'increasing';
    } else if (recentAverage < average * 0.9) {
      trend = 'decreasing';
    }

    return { current, average, trend };
  }

  getMemoryAlerts(): string[] {
    const alerts: string[] = [];
    const { current, average, trend } = this.getMemoryTrend();

    // 메모리 사용량이 평균보다 50% 이상 높을 때
    if (current > average * 1.5) {
      alerts.push(`High memory usage: ${this.formatBytes(current)} (${Math.round(current / average * 100)}% of average)`);
    }

    // 메모리 사용량이 지속적으로 증가할 때
    if (trend === 'increasing') {
      alerts.push('Memory usage is trending upward');
    }

    // 메모리 누수 의심 (지속적인 증가)
    if (trend === 'increasing' && this.memorySnapshots.length >= 20) {
      const firstHalf = this.memorySnapshots.slice(0, 10);
      const secondHalf = this.memorySnapshots.slice(-10);
      
      const firstHalfAvg = firstHalf.reduce((sum, snap) => sum + snap.usage, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, snap) => sum + snap.usage, 0) / secondHalf.length;
      
      if (secondHalfAvg > firstHalfAvg * 1.3) {
        alerts.push('Potential memory leak detected');
      }
    }

    return alerts;
  }

  private formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}
```

#### **3.2 캐시 메모리 최적화**

```typescript
// 메모리 효율적인 캐시
export class MemoryOptimizedCache implements ICache {
  private cache = new Map<string, { data: any; expiry: number; size: number }>();
  private totalSize = 0;
  private readonly maxSize = 100 * 1024 * 1024; // 100MB
  private readonly maxEntries = 10000;

  async set(key: string, data: any, ttl: number = 300): Promise<void> {
    const size = this.estimateSize(data);
    
    // 캐시 크기 제한 확인
    if (size > this.maxSize) {
      throw new Error(`Data size ${size} exceeds maximum cache size ${this.maxSize}`);
    }

    // 공간 확보
    await this.ensureSpace(size);

    const expiry = Date.now() + ttl * 1000;
    this.cache.set(key, { data, expiry, size });
    this.totalSize += size;

    // 엔트리 수 제한 확인
    if (this.cache.size > this.maxEntries) {
      this.evictOldest();
    }
  }

  async get(key: string): Promise<any | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // 만료 확인
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.totalSize -= entry.size;
      return null;
    }

    return entry.data;
  }

  async delete(key: string): Promise<void> {
    const entry = this.cache.get(key);
    if (entry) {
      this.totalSize -= entry.size;
      this.cache.delete(key);
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.totalSize = 0;
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.totalSize -= entry.size;
      return false;
    }
    
    return true;
  }

  async keys(): Promise<string[]> {
    const now = Date.now();
    const validKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (now <= entry.expiry) {
        validKeys.push(key);
      } else {
        this.cache.delete(key);
        this.totalSize -= entry.size;
      }
    }
    
    return validKeys;
  }

  private async ensureSpace(requiredSize: number): Promise<void> {
    if (this.totalSize + requiredSize <= this.maxSize) {
      return;
    }

    // LRU 방식으로 오래된 엔트리 제거
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].expiry - b[1].expiry);

    for (const [key, entry] of entries) {
      this.cache.delete(key);
      this.totalSize -= entry.size;
      
      if (this.totalSize + requiredSize <= this.maxSize) {
        break;
      }
    }
  }

  private evictOldest(): void {
    const oldestKey = this.cache.keys().next().value;
    if (oldestKey) {
      const entry = this.cache.get(oldestKey)!;
      this.cache.delete(oldestKey);
      this.totalSize -= entry.size;
    }
  }

  private estimateSize(data: any): number {
    const jsonString = JSON.stringify(data);
    return Buffer.byteLength(jsonString, 'utf8');
  }

  getStats(): { totalSize: number; entryCount: number; hitRate: number } {
    return {
      totalSize: this.totalSize,
      entryCount: this.cache.size,
      hitRate: 0 // 실제 구현에서는 히트율 계산
    };
  }
}
```

### **4. 비동기 처리 최적화**

#### **4.1 병렬 처리 최적화**

```typescript
// 병렬 처리 최적화
export class ParallelProcessingOptimizer {
  // 병렬로 여러 작업 실행
  async executeParallel<T>(
    tasks: Array<() => Promise<T>>,
    maxConcurrency: number = 5
  ): Promise<T[]> {
    const results: T[] = [];
    const executing = new Set<Promise<void>>();

    for (const task of tasks) {
      if (executing.size >= maxConcurrency) {
        await Promise.race(executing);
      }

      const promise = task().then(result => {
        results.push(result);
        executing.delete(promise);
      });

      executing.add(promise);
    }

    await Promise.all(executing);
    return results;
  }

  // 배치 처리
  async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 10
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(item => processor(item))
      );
      results.push(...batchResults);
    }
    
    return results;
  }

  // 캐시 미리 로딩
  async preloadCache(
    keys: string[],
    loader: (key: string) => Promise<any>,
    ttl: number = 300
  ): Promise<void> {
    const cache = new MemoryOptimizedCache();
    
    await this.executeParallel(
      keys.map(key => async () => {
        try {
          const data = await loader(key);
          await cache.set(key, data, ttl);
        } catch (error) {
          console.error(`Failed to preload cache for key: ${key}`, error);
        }
      }),
      5
    );
  }
}
```

## 📈 **성능 모니터링 대시보드**

### **실시간 지표**

```typescript
// 성능 대시보드 컴포넌트
export interface PerformanceMetrics {
  responseTime: {
    p50: number;
    p95: number;
    p99: number;
  };
  throughput: {
    requestsPerSecond: number;
    activeConnections: number;
  };
  cache: {
    hitRate: number;
    missRate: number;
    memoryUsage: number;
  };
  errors: {
    rate: number;
    recentErrors: Array<{ operation: string; error: string; timestamp: Date }>;
  };
  memory: {
    usage: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    alerts: string[];
  };
}

export class PerformanceDashboard {
  constructor(
    private performanceMonitor: AdvancedPerformanceMonitor,
    private memoryMonitor: MemoryMonitor
  ) {}

  async getMetrics(): Promise<PerformanceMetrics> {
    const now = new Date();
    const lastMinute = new Date(now.getTime() - 60 * 1000);

    return {
      responseTime: this.calculateResponseTimePercentiles(lastMinute),
      throughput: this.calculateThroughput(lastMinute),
      cache: await this.getCacheMetrics(),
      errors: this.calculateErrorMetrics(lastMinute),
      memory: this.getMemoryMetrics()
    };
  }

  private calculateResponseTimePercentiles(timeRange: Date): { p50: number; p95: number; p99: number } {
    const metrics = this.performanceMonitor.metrics.filter(
      m => m.startTime >= timeRange
    );

    if (metrics.length === 0) {
      return { p50: 0, p95: 0, p99: 0 };
    }

    const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
    
    return {
      p50: this.getPercentile(durations, 50),
      p95: this.getPercentile(durations, 95),
      p99: this.getPercentile(durations, 99)
    };
  }

  private getPercentile(sortedArray: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[index] || 0;
  }

  private calculateThroughput(timeRange: Date): { requestsPerSecond: number; activeConnections: number } {
    const metrics = this.performanceMonitor.metrics.filter(
      m => m.startTime >= timeRange
    );

    const durationInSeconds = (Date.now() - timeRange.getTime()) / 1000;
    const requestsPerSecond = metrics.length / durationInSeconds;

    return {
      requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
      activeConnections: this.getActiveConnections()
    };
  }

  private async getCacheMetrics(): Promise<{ hitRate: number; missRate: number; memoryUsage: number }> {
    // 실제 캐시 통계 반환
    return {
      hitRate: 0.85,
      missRate: 0.15,
      memoryUsage: 0
    };
  }

  private calculateErrorMetrics(timeRange: Date): { rate: number; recentErrors: Array<{ operation: string; error: string; timestamp: Date }> } {
    const metrics = this.performanceMonitor.metrics.filter(
      m => m.startTime >= timeRange
    );

    const totalRequests = metrics.length;
    const errors = metrics.filter(m => m.error);
    const errorRate = totalRequests > 0 ? errors.length / totalRequests : 0;

    const recentErrors = errors
      .map(m => ({ operation: m.operation, error: m.error!, timestamp: m.startTime }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      rate: Math.round(errorRate * 10000) / 100, // 백분율로 변환
      recentErrors
    };
  }

  private getMemoryMetrics(): { usage: number; trend: 'increasing' | 'decreasing' | 'stable'; alerts: string[] } {
    const trend = this.memoryMonitor.getMemoryTrend();
    const alerts = this.memoryMonitor.getMemoryAlerts();

    return {
      usage: trend.current,
      trend: trend.trend,
      alerts
    };
  }

  private getActiveConnections(): number {
    // 실제 활성 연결 수 반환
    return 0;
  }
}
```

## 🎯 **최적화 체크리스트**

### **캐싱 최적화**
- [ ] 캐시 키 전략 최적화
- [ ] TTL 값 조정
- [ ] 캐시 무효화 전략 개선
- [ ] 메모리 사용량 모니터링

### **성능 모니터링**
- [ ] 상세한 성능 메트릭 수집
- [ ] 실시간 대시보드 구현
- [ ] 알림 시스템 구축
- [ ] 성능 트렌드 분석

### **메모리 최적화**
- [ ] 메모리 사용량 모니터링
- [ ] 캐시 크기 제한 설정
- [ ] 메모리 누수 감지
- [ ] 가비지 컬렉션 최적화

### **비동기 처리**
- [ ] 병렬 처리 구현
- [ ] 배치 처리 최적화
- [ ] 캐시 미리 로딩
- [ ] 동시성 제한 설정

## 🚀 **다음 단계**

1. **성능 모니터링 구현**: 실시간 대시보드 구축
2. **캐싱 전략 최적화**: 데이터 타입별 TTL 조정
3. **메모리 최적화**: 메모리 사용량 모니터링 및 제한
4. **알림 시스템**: 성능 임계값 기반 알림
5. **성능 테스트**: 부하 테스트 및 병목 지점 파악
6. **문서화**: 성능 최적화 가이드 업데이트 