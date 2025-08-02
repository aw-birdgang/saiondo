/**
 * Logger - 애플리케이션 전체 로깅 시스템
 */

// 로깅 서비스 인터페이스
interface LoggingService {
  captureMessage(message: string, level?: string, context?: any): void;
  captureException(error: Error, context?: any): void;
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
    // TODO: 실제 Sentry 초기화
    // import * as Sentry from '@sentry/react';
    // Sentry.init({
    //   dsn: process.env.REACT_APP_SENTRY_DSN,
    //   environment: process.env.NODE_ENV,
    //   integrations: [new Sentry.BrowserTracing()],
    //   tracesSampleRate: 1.0,
    // });
    this.isInitialized = true;
  }

  captureMessage(message: string, level: string = 'info', context?: any) {
    if (!this.isInitialized) return;
    
    // TODO: 실제 Sentry 호출
    // Sentry.captureMessage(message, level);
    console.log(`[Sentry] ${level.toUpperCase()}: ${message}`, context);
  }

  captureException(error: Error, context?: any) {
    if (!this.isInitialized) return;
    
    // TODO: 실제 Sentry 호출
    // Sentry.captureException(error);
    console.error(`[Sentry] EXCEPTION:`, error, context);
  }

  setUser(user: { id: string; email?: string; name?: string }) {
    if (!this.isInitialized) return;
    
    // TODO: 실제 Sentry 호출
    // Sentry.setUser(user);
    console.log(`[Sentry] Set user:`, user);
  }

  setTag(key: string, value: string) {
    if (!this.isInitialized) return;
    
    // TODO: 실제 Sentry 호출
    // Sentry.setTag(key, value);
    console.log(`[Sentry] Set tag: ${key} = ${value}`);
  }
}

// LogRocket 로깅 서비스 구현
class LogRocketService implements LoggingService {
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // TODO: 실제 LogRocket 초기화
    // import LogRocket from 'logrocket';
    // LogRocket.init(process.env.REACT_APP_LOGROCKET_APP_ID);
    this.isInitialized = true;
  }

  captureMessage(message: string, level: string = 'info', context?: any) {
    if (!this.isInitialized) return;
    
    // TODO: 실제 LogRocket 호출
    // LogRocket.captureMessage(message, level);
    console.log(`[LogRocket] ${level.toUpperCase()}: ${message}`, context);
  }

  captureException(error: Error, context?: any) {
    if (!this.isInitialized) return;
    
    // TODO: 실제 LogRocket 호출
    // LogRocket.captureException(error);
    console.error(`[LogRocket] EXCEPTION:`, error, context);
  }

  setUser(user: { id: string; email?: string; name?: string }) {
    if (!this.isInitialized) return;
    
    // TODO: 실제 LogRocket 호출
    // LogRocket.identify(user.id, {
    //   email: user.email,
    //   name: user.name,
    // });
    console.log(`[LogRocket] Set user:`, user);
  }

  setTag(key: string, value: string) {
    if (!this.isInitialized) return;
    
    // TODO: 실제 LogRocket 호출
    // LogRocket.setTag(key, value);
    console.log(`[LogRocket] Set tag: ${key} = ${value}`);
  }
}

export class Logger {
  private readonly context: string;
  private readonly isDevelopment = process.env.NODE_ENV === 'development';
  private readonly isProduction = process.env.NODE_ENV === 'production';
  
  // 로깅 서비스들
  private readonly sentry = new SentryService();
  private readonly logRocket = new LogRocketService();

  constructor(context: string) {
    this.context = context;
  }

  /**
   * 정보 로그
   */
  info(message: string, data?: any) {
    this.log('INFO', message, data);
  }

  /**
   * 경고 로그
   */
  warn(message: string, data?: any) {
    this.log('WARN', message, data);
  }

  /**
   * 에러 로그
   */
  error(message: string, data?: any) {
    this.log('ERROR', message, data);
  }

  /**
   * 디버그 로그 (개발 환경에서만)
   */
  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      this.log('DEBUG', message, data);
    }
  }

  /**
   * 예외 로그
   */
  exception(error: Error, context?: any) {
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
  private log(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      data
    };

    // 개발 환경에서는 콘솔에 출력
    if (this.isDevelopment) {
      const consoleMethod = level === 'ERROR' || level === 'EXCEPTION' ? 'error' : 
                           level === 'WARN' ? 'warn' : 
                           level === 'DEBUG' ? 'debug' : 'log';
      
      console[consoleMethod](`[${timestamp}] ${level} [${this.context}] ${message}`, data || '');
    }

    // 프로덕션에서는 외부 로깅 서비스로 전송
    if (this.isProduction) {
      this.sendToLoggingServices(level, message, data);
    }
  }

  /**
   * 외부 로깅 서비스로 전송
   */
  private sendToLoggingServices(level: string, message: string, data?: any) {
    try {
      // Sentry로 전송
      this.sentry.captureMessage(message, level.toLowerCase(), {
        context: this.context,
        data
      });

      // LogRocket으로 전송
      this.logRocket.captureMessage(message, level.toLowerCase(), {
        context: this.context,
        data
      });
    } catch (error) {
      // 로깅 서비스 전송 실패 시 콘솔에 출력
      console.error('Failed to send log to external services:', error);
    }
  }
}

// 전역 로거 인스턴스
export const logger = new Logger('App'); 