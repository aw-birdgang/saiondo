import type {
  IControllerMiddleware,
  IMiddlewareChain,
} from '@/application/controllers/interfaces/IControllerMiddleware';
import type {
  ControllerContext,
  ControllerResult,
} from '@/application/controllers/interfaces/IController';
import { Logger } from '@/shared/utils/Logger';

/**
 * 미들웨어 체인 구현체
 * Controller 실행 전후에 미들웨어들을 순차적으로 실행
 */
export class MiddlewareChain implements IMiddlewareChain {
  private middlewares: IControllerMiddleware[] = [];
  private readonly logger = new Logger('MiddlewareChain');

  /**
   * 미들웨어 추가
   */
  addMiddleware(middleware: IControllerMiddleware): void {
    this.middlewares.push(middleware);
    // 우선순위에 따라 정렬 (낮은 숫자가 먼저 실행)
    this.middlewares.sort((a, b) => a.priority - b.priority);
    this.logger.info(
      `Middleware added: ${middleware.name} (priority: ${middleware.priority})`
    );
  }

  /**
   * 미들웨어 제거
   */
  removeMiddleware(middlewareName: string): void {
    const index = this.middlewares.findIndex(m => m.name === middlewareName);
    if (index !== -1) {
      const removed = this.middlewares.splice(index, 1)[0];
      this.logger.info(`Middleware removed: ${removed.name}`);
    }
  }

  /**
   * 미들웨어 체인 실행
   */
  async execute<T>(
    controllerName: string,
    operation: string,
    params: any,
    context: ControllerContext,
    operationFn: () => Promise<T>
  ): Promise<ControllerResult<T>> {
    const startTime = performance.now();
    const flowId = context.requestId;

    try {
      // 실행 전 미들웨어 실행
      await this.executeBeforeMiddlewares(
        controllerName,
        operation,
        params,
        context
      );

      // 실제 작업 실행
      const data = await operationFn();
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      const result: ControllerResult<T> = {
        success: true,
        data,
        executionTime,
        flowId,
        context,
      };

      // 실행 후 미들웨어 실행
      await this.executeAfterMiddlewares(
        controllerName,
        operation,
        result,
        context
      );

      return result;
    } catch (error) {
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      const result: ControllerResult<T> = {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        executionTime,
        flowId,
        context,
      };

      // 에러 처리 미들웨어 실행
      await this.executeErrorMiddlewares(
        controllerName,
        operation,
        error,
        context
      );

      return result;
    }
  }

  /**
   * 실행 전 미들웨어들 실행
   */
  private async executeBeforeMiddlewares(
    controllerName: string,
    operation: string,
    params: any,
    context: ControllerContext
  ): Promise<void> {
    for (const middleware of this.middlewares) {
      if (middleware.beforeExecute) {
        try {
          await middleware.beforeExecute(
            controllerName,
            operation,
            params,
            context
          );
        } catch (error) {
          this.logger.error(
            `Error in beforeExecute middleware ${middleware.name}:`,
            error
          );
        }
      }
    }
  }

  /**
   * 실행 후 미들웨어들 실행
   */
  private async executeAfterMiddlewares(
    controllerName: string,
    operation: string,
    result: ControllerResult,
    context: ControllerContext
  ): Promise<void> {
    for (const middleware of this.middlewares) {
      if (middleware.afterExecute) {
        try {
          await middleware.afterExecute(
            controllerName,
            operation,
            result,
            context
          );
        } catch (error) {
          this.logger.error(
            `Error in afterExecute middleware ${middleware.name}:`,
            error
          );
        }
      }
    }
  }

  /**
   * 에러 처리 미들웨어들 실행
   */
  private async executeErrorMiddlewares(
    controllerName: string,
    operation: string,
    error: any,
    context: ControllerContext
  ): Promise<void> {
    for (const middleware of this.middlewares) {
      if (middleware.onError) {
        try {
          await middleware.onError(controllerName, operation, error, context);
        } catch (middlewareError) {
          this.logger.error(
            `Error in onError middleware ${middleware.name}:`,
            middlewareError
          );
        }
      }
    }
  }

  /**
   * 등록된 미들웨어 목록 반환
   */
  getMiddlewares(): IControllerMiddleware[] {
    return [...this.middlewares];
  }

  /**
   * 미들웨어 체인 초기화
   */
  clear(): void {
    this.middlewares = [];
    this.logger.info('Middleware chain cleared');
  }
}
