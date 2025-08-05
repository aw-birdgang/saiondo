/**
 * Logger - 애플리케이션 전체 로깅 시스템
 */

// 로깅 서비스 인터페이스
interface LoggingService {
  captureMessage(
    message: string,
    level?: string,
    context?: Record<string, unknown>
  ): void;
  captureException(error: Error, context?: Record<string, unknown>): void;
  setUser(user: { id: string; email?: string; name?: string }): void;
  setTag(key: string, value: string): void;
}

// Sentry 로깅 서비스 구현
class SentryService implements LoggingService {
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Sentry 초기화는 환경 변수에 따라 조건부로 수행
    if (import.meta.env.VITE_SENTRY_DSN) {
      // Sentry가 설정된 경우에만 초기화
      this.isInitialized = true;
    }
  }

  captureMessage(
    message: string,
    level: string = 'info',
    context?: Record<string, unknown>
  ) {
    if (!this.isInitialized) return;

    // Sentry가 설정된 경우에만 메시지 캡처
    // 실제 구현에서는 Sentry SDK를 사용
  }

  captureException(error: Error, context?: Record<string, unknown>) {
    if (!this.isInitialized) return;

    // Sentry가 설정된 경우에만 예외 캡처
    // 실제 구현에서는 Sentry SDK를 사용
  }

  setUser(user: { id: string; email?: string; name?: string }) {
    if (!this.isInitialized) return;

    // Sentry가 설정된 경우에만 사용자 설정
    // 실제 구현에서는 Sentry SDK를 사용
  }

  setTag(key: string, value: string) {
    if (!this.isInitialized) return;

    // Sentry가 설정된 경우에만 태그 설정
    // 실제 구현에서는 Sentry SDK를 사용
  }
}

// LogRocket 로깅 서비스 구현
class LogRocketService implements LoggingService {
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // LogRocket 초기화는 환경 변수에 따라 조건부로 수행
    if (import.meta.env.VITE_LOGROCKET_APP_ID) {
      // LogRocket이 설정된 경우에만 초기화
      this.isInitialized = true;
    }
  }

  captureMessage(
    message: string,
    level: string = 'info',
    context?: Record<string, unknown>
  ) {
    if (!this.isInitialized) return;

    // LogRocket이 설정된 경우에만 메시지 캡처
    // 실제 구현에서는 LogRocket SDK를 사용
  }

  captureException(error: Error, context?: Record<string, unknown>) {
    if (!this.isInitialized) return;

    // LogRocket이 설정된 경우에만 예외 캡처
    // 실제 구현에서는 LogRocket SDK를 사용
  }

  setUser(user: { id: string; email?: string; name?: string }) {
    if (!this.isInitialized) return;

    // LogRocket이 설정된 경우에만 사용자 설정
    // 실제 구현에서는 LogRocket SDK를 사용
  }

  setTag(key: string, value: string) {
    if (!this.isInitialized) return;

    // LogRocket이 설정된 경우에만 태그 설정
    // 실제 구현에서는 LogRocket SDK를 사용
  }
}

export class Logger {
  private readonly context: string;
  private readonly isDevelopment = import.meta.env.MODE === 'development';
  private readonly isProduction = import.meta.env.MODE === 'production';

  // 로깅 서비스들
  private readonly sentry = new SentryService();
  private readonly logRocket = new LogRocketService();

  constructor(context: string) {
    this.context = context;
  }

  /**
   * 정보 로그
   */
  info(message: string, data?: Record<string, unknown>) {
    this.log('INFO', message, data);
  }

  /**
   * 경고 로그
   */
  warn(message: string, data?: Record<string, unknown>) {
    this.log('WARN', message, data);
  }

  /**
   * 에러 로그
   */
  error(message: string, data?: Record<string, unknown>) {
    this.log('ERROR', message, data);
  }

  /**
   * 디버그 로그 (개발 환경에서만)
   */
  debug(message: string, data?: Record<string, unknown>) {
    if (this.isDevelopment) {
      this.log('DEBUG', message, data);
    }
  }

  /**
   * 예외 로그
   */
  exception(error: Error, context?: Record<string, unknown>) {
    this.log('EXCEPTION', error.message, { error, context });

    // 프로덕션에서는 외부 서비스로 예외 전송
    if (this.isProduction) {
      this.sentry.captureException(error, context);
      this.logRocket.captureException(error, context);
    }
  }

  /**
   * 사용자 설정
   */
  setUser(user: { id: string; email?: string; name?: string }) {
    if (this.isProduction) {
      this.sentry.setUser(user);
      this.logRocket.setUser(user);
    }
  }

  /**
   * 태그 설정
   */
  setTag(key: string, value: string) {
    if (this.isProduction) {
      this.sentry.setTag(key, value);
      this.logRocket.setTag(key, value);
    }
  }

  /**
   * 실제 로그 출력
   */
  private log(level: string, message: string, data?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      data,
    };

    // 개발 환경에서는 콘솔에 출력
    if (this.isDevelopment) {
      const consoleMethod =
        level === 'ERROR' || level === 'EXCEPTION'
          ? 'error'
          : level === 'WARN'
            ? 'warn'
            : level === 'DEBUG'
              ? 'debug'
              : 'log';

      console[consoleMethod](
        `[${timestamp}] ${level} [${this.context}] ${message}`,
        data || ''
      );
    }

    // 프로덕션에서는 외부 로깅 서비스로 전송
    if (this.isProduction) {
      this.sendToLoggingServices(level, message, data);
    }
  }

  /**
   * 외부 로깅 서비스로 전송
   */
  private sendToLoggingServices(
    level: string,
    message: string,
    data?: Record<string, unknown>
  ) {
    try {
      // Sentry로 전송
      this.sentry.captureMessage(message, level.toLowerCase(), {
        context: this.context,
        data,
      });

      // LogRocket으로 전송
      this.logRocket.captureMessage(message, level.toLowerCase(), {
        context: this.context,
        data,
      });
    } catch (error) {
      // 로깅 서비스 전송 실패 시 콘솔에 출력
      console.error('Failed to send log to external services:', error);
    }
  }
}

// 전역 로거 인스턴스
export const logger = new Logger('App');
