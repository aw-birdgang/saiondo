import type { ControllerContext, ControllerResult } from './IController';

/**
 * Controller 미들웨어 인터페이스
 * Controller 실행 전후에 실행되는 처리 로직
 */
export interface IControllerMiddleware {
  /**
   * 미들웨어 이름
   */
  readonly name: string;

  /**
   * 미들웨어 우선순위 (낮을수록 먼저 실행)
   */
  readonly priority: number;

  /**
   * 실행 전 처리
   */
  beforeExecute?(
    controllerName: string,
    operation: string,
    params: any,
    context: ControllerContext
  ): Promise<void> | void;

  /**
   * 실행 후 처리
   */
  afterExecute?(
    controllerName: string,
    operation: string,
    result: ControllerResult,
    context: ControllerContext
  ): Promise<void> | void;

  /**
   * 에러 발생 시 처리
   */
  onError?(
    controllerName: string,
    operation: string,
    error: Error,
    context: ControllerContext
  ): Promise<void> | void;
}

/**
 * 미들웨어 체인 인터페이스
 */
export interface IMiddlewareChain {
  /**
   * 미들웨어 추가
   */
  addMiddleware(middleware: IControllerMiddleware): void;

  /**
   * 미들웨어 제거
   */
  removeMiddleware(middlewareName: string): void;

  /**
   * 미들웨어 체인 실행
   */
  execute<T>(
    controllerName: string,
    operation: string,
    params: any,
    context: ControllerContext,
    operationFn: () => Promise<T>
  ): Promise<ControllerResult<T>>;
}

/**
 * 기본 미들웨어 구현
 */
export abstract class BaseMiddleware implements IControllerMiddleware {
  constructor(
    public readonly name: string,
    public readonly priority: number = 100
  ) {}

  beforeExecute?(
    controllerName: string,
    operation: string,
    params: any,
    context: ControllerContext
  ): Promise<void> | void {}

  afterExecute?(
    controllerName: string,
    operation: string,
    result: ControllerResult,
    context: ControllerContext
  ): Promise<void> | void {}

  onError?(
    controllerName: string,
    operation: string,
    error: Error,
    context: ControllerContext
  ): Promise<void> | void {}
} 