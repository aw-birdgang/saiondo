export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  summary: {
    totalMetrics: number;
    averageDuration: number;
    slowestMetric: PerformanceMetric | null;
    fastestMetric: PerformanceMetric | null;
  };
}

export interface MonitoringConfig {
  enabled: boolean;
  maxMetrics: number;
  slowThreshold: number; // milliseconds
  enableConsoleLogging: boolean;
  enableRemoteReporting: boolean;
  remoteEndpoint?: string;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private config: MonitoringConfig;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private activeMetrics: Map<string, PerformanceMetric> = new Map();

  private constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = {
      enabled: true,
      maxMetrics: 1000,
      slowThreshold: 1000, // 1 second
      enableConsoleLogging: true,
      enableRemoteReporting: false,
      ...config,
    };
  }

  static getInstance(config?: Partial<MonitoringConfig>): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(config);
    }
    return PerformanceMonitor.instance;
  }

  /**
   * 성능 측정 시작
   */
  start(name: string, metadata?: Record<string, any>): string {
    if (!this.config.enabled) return '';

    const metricId = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata,
    };

    this.activeMetrics.set(metricId, metric);

    if (this.config.enableConsoleLogging) {
      console.log(`🚀 Performance: Started measuring "${name}"`, metadata);
    }

    return metricId;
  }

  /**
   * 성능 측정 종료
   */
  end(metricId: string, additionalMetadata?: Record<string, any>): PerformanceMetric | null {
    if (!this.config.enabled || !metricId) return null;

    const metric = this.activeMetrics.get(metricId);
    if (!metric) {
      console.warn(`Performance metric not found: ${metricId}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetric = {
      ...metric,
      endTime,
      duration,
      metadata: {
        ...metric.metadata,
        ...additionalMetadata,
      },
    };

    // 활성 메트릭에서 제거
    this.activeMetrics.delete(metricId);

    // 완료된 메트릭 저장
    this.metrics.set(metricId, completedMetric);

    // 메트릭 수 제한
    if (this.metrics.size > this.config.maxMetrics) {
      const firstKey = this.metrics.keys().next().value;
      this.metrics.delete(firstKey);
    }

    // 느린 작업 로깅
    if (duration > this.config.slowThreshold) {
      this.logSlowMetric(completedMetric);
    }

    if (this.config.enableConsoleLogging) {
      console.log(`✅ Performance: "${metric.name}" completed in ${duration.toFixed(2)}ms`);
    }

    return completedMetric;
  }

  /**
   * 비동기 작업 성능 측정
   */
  async measure<T>(
    name: string,
    asyncFn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const metricId = this.start(name, metadata);

    try {
      const result = await asyncFn();
      this.end(metricId, { success: true });
      return result;
    } catch (error) {
      this.end(metricId, { success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * 동기 작업 성능 측정
   */
  measureSync<T>(
    name: string,
    syncFn: () => T,
    metadata?: Record<string, any>
  ): T {
    const metricId = this.start(name, metadata);

    try {
      const result = syncFn();
      this.end(metricId, { success: true });
      return result;
    } catch (error) {
      this.end(metricId, { success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * 성능 보고서 생성
   */
  getReport(): PerformanceReport {
    const metrics = Array.from(this.metrics.values());
    
    if (metrics.length === 0) {
      return {
        metrics: [],
        summary: {
          totalMetrics: 0,
          averageDuration: 0,
          slowestMetric: null,
          fastestMetric: null,
        },
      };
    }

    const durations = metrics.map(m => m.duration || 0).filter(d => d > 0);
    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    
    const slowestMetric = metrics.reduce((slowest, current) => 
      (current.duration || 0) > (slowest.duration || 0) ? current : slowest
    );
    
    const fastestMetric = metrics.reduce((fastest, current) => 
      (current.duration || Infinity) < (fastest.duration || Infinity) ? current : fastest
    );

    return {
      metrics: [...metrics],
      summary: {
        totalMetrics: metrics.length,
        averageDuration,
        slowestMetric,
        fastestMetric,
      },
    };
  }

  /**
   * 특정 메트릭 조회
   */
  getMetric(metricId: string): PerformanceMetric | undefined {
    return this.metrics.get(metricId);
  }

  /**
   * 메트릭 필터링
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(metric => metric.name === name);
  }

  /**
   * 느린 메트릭 조회
   */
  getSlowMetrics(threshold?: number): PerformanceMetric[] {
    const slowThreshold = threshold || this.config.slowThreshold;
    return Array.from(this.metrics.values()).filter(
      metric => (metric.duration || 0) > slowThreshold
    );
  }

  /**
   * 메트릭 정리
   */
  clear(): void {
    this.metrics.clear();
    this.activeMetrics.clear();
  }

  /**
   * 설정 업데이트
   */
  updateConfig(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 활성 메트릭 조회
   */
  getActiveMetrics(): PerformanceMetric[] {
    return Array.from(this.activeMetrics.values());
  }

  /**
   * 느린 메트릭 로깅
   */
  private logSlowMetric(metric: PerformanceMetric): void {
    const duration = metric.duration || 0;
    const threshold = this.config.slowThreshold;
    
    console.warn(
      `🐌 Slow Performance: "${metric.name}" took ${duration.toFixed(2)}ms ` +
      `(threshold: ${threshold}ms)`,
      metric.metadata
    );

    // 원격 리포팅
    if (this.config.enableRemoteReporting && this.config.remoteEndpoint) {
      this.reportToRemote(metric).catch(error => {
        console.error('Failed to report slow metric to remote:', error);
      });
    }
  }

  /**
   * 원격 서버에 리포팅
   */
  private async reportToRemote(metric: PerformanceMetric): Promise<void> {
    if (!this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'performance_metric',
          metric,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to report to remote:', error);
    }
  }
}

// 편의 함수들
export const performanceMonitor = PerformanceMonitor.getInstance();

export const startPerformanceMeasurement = (name: string, metadata?: Record<string, any>) => 
  performanceMonitor.start(name, metadata);

export const endPerformanceMeasurement = (metricId: string, additionalMetadata?: Record<string, any>) => 
  performanceMonitor.end(metricId, additionalMetadata);

export const measurePerformance = <T>(
  name: string,
  asyncFn: () => Promise<T>,
  metadata?: Record<string, any>
) => performanceMonitor.measure(name, asyncFn, metadata);

export const measurePerformanceSync = <T>(
  name: string,
  syncFn: () => T,
  metadata?: Record<string, any>
) => performanceMonitor.measureSync(name, syncFn, metadata);

export default PerformanceMonitor; 