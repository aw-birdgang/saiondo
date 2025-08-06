import { BaseMiddleware } from '@/application/controllers/interfaces/IControllerMiddleware';
import type {
  ControllerContext,
  ControllerResult,
} from '@/application/controllers/interfaces/IController';
import { Logger } from '@/shared/utils/Logger';

/**
 * 성능 모니터링 미들웨어
 * Controller 실행 시간과 성능 메트릭을 추적
 */
export class PerformanceMiddleware extends BaseMiddleware {
  private readonly logger = new Logger('PerformanceMiddleware');
  private performanceMetrics: Map<
    string,
    {
      totalExecutions: number;
      totalTime: number;
      minTime: number;
      maxTime: number;
      lastExecution: Date;
    }
  > = new Map();

  constructor() {
    super('PerformanceMiddleware', 20);
  }

  async beforeExecute(
    controllerName: string,
    operation: string,
    params: any,
    context: ControllerContext
  ): Promise<void> {
    // 실행 시작 시간을 context에 저장
    (context as any).startTime = performance.now();
  }

  async afterExecute(
    controllerName: string,
    operation: string,
    result: ControllerResult,
    context: ControllerContext
  ): Promise<void> {
    const key = `${controllerName}.${operation}`;
    const executionTime = result.executionTime;

    // 성능 메트릭 업데이트
    const currentMetrics = this.performanceMetrics.get(key) || {
      totalExecutions: 0,
      totalTime: 0,
      minTime: Infinity,
      maxTime: 0,
      lastExecution: new Date(),
    };

    currentMetrics.totalExecutions++;
    currentMetrics.totalTime += executionTime;
    currentMetrics.minTime = Math.min(currentMetrics.minTime, executionTime);
    currentMetrics.maxTime = Math.max(currentMetrics.maxTime, executionTime);
    currentMetrics.lastExecution = new Date();

    this.performanceMetrics.set(key, currentMetrics);

    // 성능 경고 로그
    if (executionTime > 1000) {
      // 1초 이상
      this.logger.warn(
        `Slow operation detected: ${key} took ${executionTime.toFixed(2)}ms`,
        {
          flowId: result.flowId,
          executionTime,
          avgTime: (
            currentMetrics.totalTime / currentMetrics.totalExecutions
          ).toFixed(2),
          totalExecutions: currentMetrics.totalExecutions,
        }
      );
    }

    // 성능 통계 로그 (주기적으로)
    if (currentMetrics.totalExecutions % 10 === 0) {
      this.logPerformanceStats(key, currentMetrics);
    }
  }

  async onError(
    controllerName: string,
    operation: string,
    error: Error,
    context: ControllerContext
  ): Promise<void> {
    const key = `${controllerName}.${operation}`;
    const startTime = (context as any).startTime;

    if (startTime) {
      const executionTime = performance.now() - startTime;
      this.logger.error(`Operation failed with performance impact: ${key}`, {
        flowId: context.requestId,
        executionTime: executionTime.toFixed(2),
        error: error.message,
      });
    }
  }

  /**
   * 성능 통계 로그
   */
  private logPerformanceStats(key: string, metrics: any): void {
    const avgTime = metrics.totalTime / metrics.totalExecutions;

    this.logger.info(`Performance stats for ${key}:`, {
      totalExecutions: metrics.totalExecutions,
      averageTime: avgTime.toFixed(2),
      minTime: metrics.minTime.toFixed(2),
      maxTime: metrics.maxTime.toFixed(2),
      lastExecution: metrics.lastExecution,
    });
  }

  /**
   * 성능 메트릭 조회
   */
  getPerformanceMetrics(): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, metrics] of this.performanceMetrics.entries()) {
      result[key] = {
        ...metrics,
        averageTime: metrics.totalTime / metrics.totalExecutions,
      };
    }

    return result;
  }

  /**
   * 특정 작업의 성능 메트릭 조회
   */
  getOperationMetrics(controllerName: string, operation: string): any {
    const key = `${controllerName}.${operation}`;
    const metrics = this.performanceMetrics.get(key);

    if (!metrics) return null;

    return {
      ...metrics,
      averageTime: metrics.totalTime / metrics.totalExecutions,
    };
  }

  /**
   * 성능 메트릭 초기화
   */
  clearMetrics(): void {
    this.performanceMetrics.clear();
    this.logger.info('Performance metrics cleared');
  }
}
