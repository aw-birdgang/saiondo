import { Logger } from '../../shared/utils/Logger';
import { FlowTracker } from '../../shared/utils/FlowTracker';
import { ErrorHandler } from '../../shared/utils/ErrorHandler';
import type { IController, ControllerContext, ControllerResult } from './interfaces/IController';
import type { IMiddlewareChain } from './interfaces/IControllerMiddleware';
import { MiddlewareChain } from './middleware/MiddlewareChain';
import { LoggingMiddleware } from './middleware/LoggingMiddleware';
import { PerformanceMiddleware } from './middleware/PerformanceMiddleware';
import { CachingMiddleware } from './middleware/CachingMiddleware';
import { ValidationMiddleware } from './middleware/ValidationMiddleware';

/**
 * Base Controller - 모든 Controller의 기본 클래스
 * 공통 기능: 로깅, 흐름 추적, 에러 처리, 성능 모니터링, 미들웨어 시스템
 */
export abstract class BaseController implements IController {
  protected readonly logger: Logger;
  protected readonly flowTracker: FlowTracker;
  protected readonly errorHandler: ErrorHandler;
  protected readonly middlewareChain: IMiddlewareChain;
  
  public readonly name: string;
  private isInitialized = false;
  private lastActivity = new Date();
  private metrics = {
    totalOperations: 0,
    successfulOperations: 0,
    failedOperations: 0,
    totalExecutionTime: 0,
    lastOperationTime: new Date()
  };

  constructor(controllerName: string) {
    this.name = controllerName;
    this.logger = new Logger(controllerName);
    this.flowTracker = new FlowTracker();
    this.errorHandler = new ErrorHandler();
    this.middlewareChain = new MiddlewareChain();
    
    // 기본 미들웨어 등록
    this.setupDefaultMiddlewares();
  }

  /**
   * 기본 미들웨어 설정
   */
  private setupDefaultMiddlewares(): void {
    this.middlewareChain.addMiddleware(new ValidationMiddleware());
    this.middlewareChain.addMiddleware(new LoggingMiddleware());
    this.middlewareChain.addMiddleware(new CachingMiddleware());
    this.middlewareChain.addMiddleware(new PerformanceMiddleware());
  }

  /**
   * Controller 초기화
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    this.logger.info('Initializing controller');
    this.isInitialized = true;
    this.lastActivity = new Date();
  }

  /**
   * Controller 정리
   */
  async cleanup(): Promise<void> {
    this.logger.info('Cleaning up controller');
    this.isInitialized = false;
  }

  /**
   * Controller 활성화 상태 확인
   */
  isActive(): boolean {
    return this.isInitialized;
  }

  /**
   * 컨트롤러 메서드 실행을 래핑하는 공통 메서드
   */
  public async executeWithTracking<T>(
    operation: string,
    params: any,
    operationFn: () => Promise<T>
  ): Promise<T> {
    const flowId = this.flowTracker.startFlow(this.name, operation);
    const context: ControllerContext = {
      requestId: flowId,
      timestamp: new Date(),
      metadata: { params }
    };
    
    try {
      this.metrics.totalOperations++;
      this.lastActivity = new Date();
      this.metrics.lastOperationTime = new Date();

      const startTime = performance.now();
      
      // 미들웨어 체인을 통한 실행
      const result = await this.middlewareChain.execute(
        this.name,
        operation,
        params,
        context,
        operationFn
      );
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      if (result.success) {
        this.metrics.successfulOperations++;
        this.metrics.totalExecutionTime += executionTime;
        this.flowTracker.completeFlow(flowId, true);
        return result.data as T;
      } else {
        this.metrics.failedOperations++;
        this.flowTracker.completeFlow(flowId, false, result.error);
        throw result.error;
      }

    } catch (error) {
      this.metrics.failedOperations++;
      this.flowTracker.completeFlow(flowId, false, error);
      throw this.errorHandler.handleError(error, this.name, operation);
    }
  }

  /**
   * 민감한 정보를 제거하여 로깅에 안전한 파라미터 생성
   */
  private sanitizeParams(params: any): any {
    if (!params) return params;
    
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    const sanitized = { ...params };
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  /**
   * 컨트롤러 상태 정보 반환
   */
  public getControllerInfo() {
    return {
      name: this.name,
      activeFlows: this.flowTracker.getActiveFlows(),
      totalFlows: this.flowTracker.getTotalFlows(),
      successRate: this.flowTracker.getSuccessRate(),
      isInitialized: this.isInitialized,
      lastActivity: this.lastActivity
    };
  }

  /**
   * Controller 메트릭 반환
   */
  public getMetrics() {
    return {
      totalOperations: this.metrics.totalOperations,
      successfulOperations: this.metrics.successfulOperations,
      failedOperations: this.metrics.failedOperations,
      averageExecutionTime: this.metrics.totalOperations > 0 
        ? this.metrics.totalExecutionTime / this.metrics.totalOperations 
        : 0,
      lastOperationTime: this.metrics.lastOperationTime
    };
  }
} 