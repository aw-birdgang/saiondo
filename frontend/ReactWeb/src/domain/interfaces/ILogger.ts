/**
 * 로깅 인터페이스
 * 다양한 로깅 구현체를 지원하기 위한 추상화
 */
export interface ILogger {
  /**
   * 정보 로그
   */
  info(message: string, context?: Record<string, any>): void;

  /**
   * 경고 로그
   */
  warn(message: string, context?: Record<string, any>): void;

  /**
   * 에러 로그
   */
  error(message: string, context?: Record<string, any>): void;

  /**
   * 디버그 로그
   */
  debug(message: string, context?: Record<string, any>): void;

  /**
   * 트레이스 로그
   */
  trace(message: string, context?: Record<string, any>): void;
}

/**
 * 기본 콘솔 로거 구현체
 */
export class ConsoleLogger implements ILogger {
  info(message: string, context?: Record<string, any>): void {
    console.info(`[INFO] ${message}`, context || '');
  }

  warn(message: string, context?: Record<string, any>): void {
    console.warn(`[WARN] ${message}`, context || '');
  }

  error(message: string, context?: Record<string, any>): void {
    console.error(`[ERROR] ${message}`, context || '');
  }

  debug(message: string, context?: Record<string, any>): void {
    console.debug(`[DEBUG] ${message}`, context || '');
  }

  trace(message: string, context?: Record<string, any>): void {
    console.trace(`[TRACE] ${message}`, context || '');
  }
}
