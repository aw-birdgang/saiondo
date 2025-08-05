import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type {
  PerformanceAlert,
  PerformanceMetric,
  PerformanceReport,
} from '../dto/PerformanceDto';

export class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];
  private alerts: PerformanceAlert[] = [];
  private readonly maxMetrics = 10000;
  private readonly maxAlerts = 1000;
  private readonly slowThreshold = 1000; // 1초
  private readonly errorRateThreshold = 0.05; // 5%

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository
  ) {}

  /**
   * 성능 측정을 위한 데코레이터 함수
   */
  async measurePerformance<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now();
    let success = true;
    let error: string | undefined;

    try {
      const result = await fn();
      return result;
    } catch (err) {
      success = false;
      error = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      const duration = Date.now() - startTime;
      this.recordMetric({
        operation,
        duration,
        timestamp: new Date(),
        success,
        error,
        metadata,
      });

      // 성능 알림 체크
      this.checkPerformanceAlerts(operation, duration, success);
    }
  }

  /**
   * 성능 메트릭 기록
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // 최대 개수 제한
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // 실시간 알림 체크
    this.checkRealTimeAlerts(metric);
  }

  /**
   * 성능 리포트 생성
   */
  generateReport(timeRange: { start: Date; end: Date }): PerformanceReport {
    const filteredMetrics = this.metrics.filter(
      metric =>
        metric.timestamp >= timeRange.start && metric.timestamp <= timeRange.end
    );

    if (filteredMetrics.length === 0) {
      return {
        totalOperations: 0,
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        errorRate: 0,
        operationsByType: {},
        slowestOperations: [],
        recentErrors: [],
        timeRange,
      };
    }

    const durations = filteredMetrics
      .map(m => m.duration)
      .sort((a, b) => a - b);
    const successfulOperations = filteredMetrics.filter(m => m.success);
    const failedOperations = filteredMetrics.filter(m => !m.success);

    // 작업 타입별 통계
    const operationsByType: Record<string, number> = {};
    filteredMetrics.forEach(metric => {
      operationsByType[metric.operation] =
        (operationsByType[metric.operation] || 0) + 1;
    });

    // 가장 느린 작업들
    const slowestOperations = filteredMetrics
      .filter(m => m.duration > this.slowThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    // 최근 에러들
    const recentErrors = failedOperations
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalOperations: filteredMetrics.length,
      averageResponseTime:
        durations.reduce((sum, d) => sum + d, 0) / durations.length,
      p95ResponseTime: this.calculatePercentile(durations, 95),
      p99ResponseTime: this.calculatePercentile(durations, 99),
      errorRate: failedOperations.length / filteredMetrics.length,
      operationsByType,
      slowestOperations,
      recentErrors,
      timeRange,
    };
  }

  /**
   * 성능 알림 생성
   */
  createAlert(alert: PerformanceAlert): void {
    this.alerts.push(alert);

    // 최대 개수 제한
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(-this.maxAlerts);
    }

    // 로그 출력
    console.warn(
      `[Performance Alert] ${alert.severity.toUpperCase()}: ${alert.message}`,
      alert.metadata
    );
  }

  /**
   * 알림 조회
   */
  getAlerts(severity?: PerformanceAlert['severity']): PerformanceAlert[] {
    if (severity) {
      return this.alerts.filter(alert => alert.severity === severity);
    }
    return [...this.alerts];
  }

  /**
   * 성능 최적화 권장사항 생성
   */
  generateOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentReport = this.generateReport({ start: oneHourAgo, end: now });

    // 느린 응답 시간 권장사항
    if (recentReport.averageResponseTime > 500) {
      recommendations.push(
        '평균 응답 시간이 500ms를 초과합니다. 캐싱을 고려해보세요.'
      );
    }

    if (recentReport.p95ResponseTime > 1000) {
      recommendations.push(
        '95% 응답 시간이 1초를 초과합니다. 데이터베이스 쿼리를 최적화하세요.'
      );
    }

    // 에러율 권장사항
    if (recentReport.errorRate > 0.01) {
      recommendations.push(
        '에러율이 1%를 초과합니다. 에러 처리 로직을 점검하세요.'
      );
    }

    // 느린 작업별 권장사항
    recentReport.slowestOperations.forEach(operation => {
      recommendations.push(
        `${operation.operation} 작업이 ${operation.duration}ms로 느립니다. 최적화가 필요합니다.`
      );
    });

    return recommendations;
  }

  /**
   * 메모리 사용량 모니터링
   */
  getMemoryUsage(): { used: number; total: number; percentage: number } {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      };
    }

    // 브라우저에서 memory API가 없는 경우
    return {
      used: 0,
      total: 0,
      percentage: 0,
    };
  }

  /**
   * 성능 메트릭 초기화
   */
  clearMetrics(): void {
    this.metrics = [];
    this.alerts = [];
  }

  /**
   * 특정 작업의 성능 통계
   */
  getOperationStats(
    operation: string,
    timeRange?: { start: Date; end: Date }
  ): {
    count: number;
    averageDuration: number;
    errorRate: number;
    minDuration: number;
    maxDuration: number;
  } {
    let filteredMetrics = this.metrics.filter(m => m.operation === operation);

    if (timeRange) {
      filteredMetrics = filteredMetrics.filter(
        m => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      );
    }

    if (filteredMetrics.length === 0) {
      return {
        count: 0,
        averageDuration: 0,
        errorRate: 0,
        minDuration: 0,
        maxDuration: 0,
      };
    }

    const durations = filteredMetrics.map(m => m.duration);
    const errors = filteredMetrics.filter(m => !m.success).length;

    return {
      count: filteredMetrics.length,
      averageDuration:
        durations.reduce((sum, d) => sum + d, 0) / durations.length,
      errorRate: errors / filteredMetrics.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
    };
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * values.length) - 1;
    return values[index] || 0;
  }

  private checkPerformanceAlerts(
    operation: string,
    duration: number,
    success: boolean
  ): void {
    // 느린 응답 시간 알림
    if (duration > this.slowThreshold) {
      this.createAlert({
        type: 'slow_response',
        severity:
          duration > 5000 ? 'critical' : duration > 2000 ? 'high' : 'medium',
        message: `${operation} 작업이 ${duration}ms로 느립니다.`,
        timestamp: new Date(),
        metadata: { operation, duration },
      });
    }

    // 에러 알림
    if (!success) {
      this.createAlert({
        type: 'high_error_rate',
        severity: 'high',
        message: `${operation} 작업에서 에러가 발생했습니다.`,
        timestamp: new Date(),
        metadata: { operation },
      });
    }
  }

  private checkRealTimeAlerts(metric: PerformanceMetric): void {
    // 실시간 에러율 체크
    const recentMetrics = this.metrics.filter(
      m => m.timestamp.getTime() > Date.now() - 5 * 60 * 1000 // 최근 5분
    );

    if (recentMetrics.length > 10) {
      const errorRate =
        recentMetrics.filter(m => !m.success).length / recentMetrics.length;
      if (errorRate > this.errorRateThreshold) {
        this.createAlert({
          type: 'high_error_rate',
          severity: 'critical',
          message: `최근 5분간 에러율이 ${(errorRate * 100).toFixed(1)}%입니다.`,
          timestamp: new Date(),
          metadata: { errorRate, recentCount: recentMetrics.length },
        });
      }
    }
  }
}
