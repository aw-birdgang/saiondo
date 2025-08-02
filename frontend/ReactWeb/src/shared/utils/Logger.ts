/**
 * Logger - 애플리케이션 전체 로깅 시스템
 */
export class Logger {
  private readonly context: string;
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

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
      const consoleMethod = level === 'ERROR' ? 'error' : 
                           level === 'WARN' ? 'warn' : 
                           level === 'DEBUG' ? 'debug' : 'log';
      
      console[consoleMethod](`[${timestamp}] ${level} [${this.context}] ${message}`, data || '');
    }

    // 프로덕션에서는 외부 로깅 서비스로 전송 가능
    this.sendToLoggingService(logEntry);
  }

  /**
   * 외부 로깅 서비스로 전송 (향후 확장용)
   */
  private sendToLoggingService(logEntry: any) {
    // TODO: 실제 로깅 서비스 연동 (예: Sentry, LogRocket 등)
    if (process.env.NODE_ENV === 'production') {
      // 프로덕션 로깅 로직
    }
  }
} 