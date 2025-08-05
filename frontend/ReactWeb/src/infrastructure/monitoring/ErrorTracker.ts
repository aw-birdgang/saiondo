export interface ErrorEvent {
  id: string;
  message: string;
  stack?: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

export interface ErrorReport {
  errors: ErrorEvent[];
  summary: {
    totalErrors: number;
    errorTypes: Record<string, number>;
    mostFrequentError: string | null;
    averageErrorsPerHour: number;
  };
}

export interface ErrorTrackingConfig {
  enabled: boolean;
  maxErrors: number;
  enableConsoleLogging: boolean;
  enableRemoteReporting: boolean;
  remoteEndpoint?: string;
  captureUserContext: boolean;
  captureStackTraces: boolean;
}

export class ErrorTracker {
  private static instance: ErrorTracker;
  private config: ErrorTrackingConfig;
  private errors: ErrorEvent[] = [];
  private sessionId: string;

  private constructor(config: Partial<ErrorTrackingConfig> = {}) {
    this.config = {
      enabled: true,
      maxErrors: 1000,
      enableConsoleLogging: true,
      enableRemoteReporting: false,
      captureUserContext: true,
      captureStackTraces: true,
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  static getInstance(config?: Partial<ErrorTrackingConfig>): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker(config);
    }
    return ErrorTracker.instance;
  }

  /**
   * 에러 추적
   */
  track(
    error: Error | string,
    context?: Record<string, any>,
    type: 'error' | 'warning' | 'info' = 'error'
  ): string {
    if (!this.config.enabled) return '';

    const errorEvent: ErrorEvent = {
      id: this.generateErrorId(),
      message: typeof error === 'string' ? error : error.message,
      stack:
        this.config.captureStackTraces && error instanceof Error
          ? error.stack
          : undefined,
      type,
      timestamp: new Date(),
      context: this.config.captureUserContext
        ? this.getUserContext()
        : undefined,
      ...context,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.errors.push(errorEvent);

    // 에러 수 제한
    if (this.errors.length > this.config.maxErrors) {
      this.errors = this.errors.slice(-this.config.maxErrors);
    }

    // 콘솔 로깅
    if (this.config.enableConsoleLogging) {
      this.logToConsole(errorEvent);
    }

    // 원격 리포팅
    if (this.config.enableRemoteReporting && this.config.remoteEndpoint) {
      this.reportToRemote(errorEvent).catch(err => {
        console.error('Failed to report error to remote:', err);
      });
    }

    return errorEvent.id;
  }

  /**
   * 비동기 에러 추적
   */
  async trackAsync<T>(
    asyncFn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    try {
      return await asyncFn();
    } catch (error) {
      this.track(
        error instanceof Error ? error : new Error(String(error)),
        context
      );
      throw error;
    }
  }

  /**
   * 동기 에러 추적
   */
  trackSync<T>(syncFn: () => T, context?: Record<string, any>): T {
    try {
      return syncFn();
    } catch (error) {
      this.track(
        error instanceof Error ? error : new Error(String(error)),
        context
      );
      throw error;
    }
  }

  /**
   * 에러 보고서 생성
   */
  getReport(): ErrorReport {
    if (this.errors.length === 0) {
      return {
        errors: [],
        summary: {
          totalErrors: 0,
          errorTypes: {},
          mostFrequentError: null,
          averageErrorsPerHour: 0,
        },
      };
    }

    // 에러 타입별 카운트
    const errorTypes: Record<string, number> = {};
    const errorMessages: Record<string, number> = {};

    this.errors.forEach(error => {
      errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
      errorMessages[error.message] = (errorMessages[error.message] || 0) + 1;
    });

    // 가장 빈번한 에러 찾기
    const mostFrequentError = Object.entries(errorMessages).reduce(
      (most, [message, count]) =>
        count > (most ? errorMessages[most] : 0) ? message : most,
      null as string | null
    );

    // 시간당 평균 에러 수 계산
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentErrors = this.errors.filter(
      error => error.timestamp > oneHourAgo
    );
    const averageErrorsPerHour = recentErrors.length;

    return {
      errors: [...this.errors],
      summary: {
        totalErrors: this.errors.length,
        errorTypes,
        mostFrequentError,
        averageErrorsPerHour,
      },
    };
  }

  /**
   * 특정 에러 조회
   */
  getError(errorId: string): ErrorEvent | undefined {
    return this.errors.find(error => error.id === errorId);
  }

  /**
   * 에러 타입별 필터링
   */
  getErrorsByType(type: 'error' | 'warning' | 'info'): ErrorEvent[] {
    return this.errors.filter(error => error.type === type);
  }

  /**
   * 최근 에러 조회
   */
  getRecentErrors(hours: number = 1): ErrorEvent[] {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.errors.filter(error => error.timestamp > cutoffTime);
  }

  /**
   * 에러 정리
   */
  clear(): void {
    this.errors = [];
  }

  /**
   * 설정 업데이트
   */
  updateConfig(config: Partial<ErrorTrackingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 전역 에러 핸들러 설정
   */
  private setupGlobalErrorHandlers(): void {
    if (typeof window !== 'undefined') {
      // JavaScript 에러
      window.addEventListener('error', event => {
        this.track(event.error || new Error(event.message), {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      });

      // Promise 에러
      window.addEventListener('unhandledrejection', event => {
        this.track(
          event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason)),
          { type: 'unhandledrejection' }
        );
      });
    }
  }

  /**
   * 사용자 컨텍스트 수집
   */
  private getUserContext(): Record<string, any> {
    const context: Record<string, any> = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    };

    // 로컬 스토리지에서 사용자 정보 가져오기
    try {
      const authToken = localStorage.getItem('auth_token');
      if (authToken) {
        context.hasAuthToken = true;
      }
    } catch (error) {
      // 로컬 스토리지 접근 실패 시 무시
    }

    return context;
  }

  /**
   * 콘솔에 에러 로깅
   */
  private logToConsole(errorEvent: ErrorEvent): void {
    const timestamp = errorEvent.timestamp.toISOString();
    const logMessage = `[${timestamp}] ${errorEvent.type.toUpperCase()}: ${errorEvent.message}`;

    switch (errorEvent.type) {
      case 'error':
        console.error(logMessage, errorEvent.context);
        break;
      case 'warning':
        console.warn(logMessage, errorEvent.context);
        break;
      case 'info':
        console.info(logMessage, errorEvent.context);
        break;
    }
  }

  /**
   * 원격 서버에 에러 리포팅
   */
  private async reportToRemote(errorEvent: ErrorEvent): Promise<void> {
    if (!this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'error_event',
          error: errorEvent,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to report error to remote:', error);
    }
  }

  /**
   * 에러 ID 생성
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 세션 ID 생성
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 편의 함수들
export const errorTracker = ErrorTracker.getInstance();

export const trackError = (
  error: Error | string,
  context?: Record<string, any>
) => errorTracker.track(error, context, 'error');

export const trackWarning = (
  warning: Error | string,
  context?: Record<string, any>
) => errorTracker.track(warning, context, 'warning');

export const trackInfo = (
  info: Error | string,
  context?: Record<string, any>
) => errorTracker.track(info, context, 'info');

export const trackAsyncError = <T>(
  asyncFn: () => Promise<T>,
  context?: Record<string, any>
) => errorTracker.trackAsync(asyncFn, context);

export const trackSyncError = <T>(
  syncFn: () => T,
  context?: Record<string, any>
) => errorTracker.trackSync(syncFn, context);

export default ErrorTracker;
