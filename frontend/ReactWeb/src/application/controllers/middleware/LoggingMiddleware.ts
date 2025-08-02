import { BaseMiddleware } from '../interfaces/IControllerMiddleware';
import type { ControllerContext, ControllerResult } from '../interfaces/IController';
import { Logger } from '../../../shared/utils/Logger';

/**
 * 로깅 미들웨어
 * Controller 실행 전후에 상세한 로그를 기록
 */
export class LoggingMiddleware extends BaseMiddleware {
  private readonly logger = new Logger('LoggingMiddleware');

  constructor() {
    super('LoggingMiddleware', 10); // 높은 우선순위
  }

  async beforeExecute(
    controllerName: string,
    operation: string,
    params: any,
    context: ControllerContext
  ): Promise<void> {
    this.logger.info(`[${controllerName}] Starting operation: ${operation}`, {
      flowId: context.requestId,
      userId: context.userId,
      sessionId: context.sessionId,
      params: this.sanitizeParams(params),
      timestamp: context.timestamp
    });
  }

  async afterExecute(
    controllerName: string,
    operation: string,
    result: ControllerResult,
    context: ControllerContext
  ): Promise<void> {
    const logLevel = result.success ? 'info' : 'error';
    const message = result.success 
      ? `[${controllerName}] Completed operation: ${operation}`
      : `[${controllerName}] Failed operation: ${operation}`;

    this.logger[logLevel](message, {
      flowId: result.flowId,
      userId: context.userId,
      sessionId: context.sessionId,
      executionTime: result.executionTime,
      success: result.success,
      error: result.error?.message,
      timestamp: context.timestamp
    });
  }

  async onError(
    controllerName: string,
    operation: string,
    error: Error,
    context: ControllerContext
  ): Promise<void> {
    this.logger.error(`[${controllerName}] Error in operation: ${operation}`, {
      flowId: context.requestId,
      userId: context.userId,
      sessionId: context.sessionId,
      error: error.message,
      stack: error.stack,
      timestamp: context.timestamp
    });
  }

  /**
   * 민감한 정보를 제거하여 로깅에 안전한 파라미터 생성
   */
  private sanitizeParams(params: any): any {
    if (!params) return params;
    
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization', 'apiKey'];
    const sanitized = { ...params };
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
} 