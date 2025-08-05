import type {
  ErrorLog,
  ErrorReport,
  ErrorHandlingConfig,
  ErrorPatternAnalysis,
  ErrorRecoveryResult,
} from '../dto/ErrorHandlingDto';

export class ErrorHandlingService {
  private errorLogs: ErrorLog[] = [];
  private readonly maxLogs: number;
  private readonly logLevel: ErrorLog['level'];
  private readonly enableConsoleLogging: boolean;
  private readonly enableRemoteLogging: boolean;
  private readonly remoteEndpoint?: string;

  constructor(config: ErrorHandlingConfig = {}) {
    this.maxLogs = config.maxLogs || 1000;
    this.logLevel = config.logLevel || 'info';
    this.enableConsoleLogging = config.enableConsoleLogging !== false;
    this.enableRemoteLogging = config.enableRemoteLogging || false;
    this.remoteEndpoint = config.remoteEndpoint;
  }

  /**
   * 에러 로깅
   */
  logError(
    error: Error | string,
    context?: Record<string, any>,
    level: ErrorLog['level'] = 'error'
  ): void {
    if (!this.shouldLog(level)) return;

    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      level,
      message: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.errorLogs.push(errorLog);

    // 최대 개수 제한
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(-this.maxLogs);
    }

    // 콘솔 로깅
    if (this.enableConsoleLogging) {
      this.logToConsole(errorLog);
    }

    // 원격 로깅
    if (this.enableRemoteLogging && this.remoteEndpoint) {
      this.logToRemote(errorLog).catch(err => {
        console.error('Failed to send error to remote endpoint:', err);
      });
    }
  }

  /**
   * 정보 로깅
   */
  logInfo(message: string, context?: Record<string, any>): void {
    this.logError(message, context, 'info');
  }

  /**
   * 경고 로깅
   */
  logWarn(message: string, context?: Record<string, any>): void {
    this.logError(message, context, 'warn');
  }

  /**
   * 치명적 에러 로깅
   */
  logCritical(error: Error | string, context?: Record<string, any>): void {
    this.logError(error, context, 'critical');
  }

  /**
   * 에러 리포트 생성
   */
  generateErrorReport(timeRange: { start: Date; end: Date }): ErrorReport {
    const filteredLogs = this.errorLogs.filter(
      log => log.timestamp >= timeRange.start && log.timestamp <= timeRange.end
    );

    if (filteredLogs.length === 0) {
      return {
        totalErrors: 0,
        errorsByLevel: {},
        errorsByOperation: {},
        recentErrors: [],
        criticalErrors: [],
        timeRange,
      };
    }

    // 레벨별 에러 수
    const errorsByLevel: Record<string, number> = {};
    filteredLogs.forEach(log => {
      errorsByLevel[log.level] = (errorsByLevel[log.level] || 0) + 1;
    });

    // 작업별 에러 수
    const errorsByOperation: Record<string, number> = {};
    filteredLogs.forEach(log => {
      if (log.operation) {
        errorsByOperation[log.operation] =
          (errorsByOperation[log.operation] || 0) + 1;
      }
    });

    // 최근 에러들 (최근 10개)
    const recentErrors = filteredLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    // 치명적 에러들
    const criticalErrors = filteredLogs.filter(log => log.level === 'critical');

    return {
      totalErrors: filteredLogs.length,
      errorsByLevel,
      errorsByOperation,
      recentErrors,
      criticalErrors,
      timeRange,
    };
  }

  /**
   * 에러 패턴 분석
   */
  analyzeErrorPatterns(): ErrorPatternAnalysis {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentLogs = this.errorLogs.filter(
      log => log.timestamp >= oneWeekAgo
    );

    // 가장 흔한 에러 메시지
    const errorCounts: Record<string, number> = {};
    recentLogs.forEach(log => {
      errorCounts[log.message] = (errorCounts[log.message] || 0) + 1;
    });

    const mostCommonErrors = Object.entries(errorCounts)
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 에러 트렌드 (일별)
    const dailyCounts: Record<string, number> = {};
    recentLogs.forEach(log => {
      const date = log.timestamp.toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    const errorTrends = Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 작업별 에러 수
    const operationCounts: Record<string, number> = {};
    recentLogs.forEach(log => {
      if (log.operation) {
        operationCounts[log.operation] =
          (operationCounts[log.operation] || 0) + 1;
      }
    });

    const topOperations = Object.entries(operationCounts)
      .map(([operation, errorCount]) => ({ operation, errorCount }))
      .sort((a, b) => b.errorCount - a.errorCount)
      .slice(0, 10);

    return {
      mostCommonErrors,
      errorTrends,
      topOperations,
    };
  }

  /**
   * 에러 로그 조회
   */
  getErrorLogs(
    filters?: {
      level?: ErrorLog['level'];
      operation?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
    },
    limit: number = 100
  ): ErrorLog[] {
    let filteredLogs = [...this.errorLogs];

    if (filters?.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level);
    }

    if (filters?.operation) {
      filteredLogs = filteredLogs.filter(
        log => log.operation === filters.operation
      );
    }

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter(
        log => log.timestamp >= filters.startDate!
      );
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter(
        log => log.timestamp <= filters.endDate!
      );
    }

    return filteredLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * 에러 로그 초기화
   */
  clearLogs(): void {
    this.errorLogs = [];
  }

  /**
   * 글로벌 에러 핸들러 설정
   */
  setupGlobalErrorHandling(): void {
    // JavaScript 에러 처리
    window.addEventListener('error', event => {
      const error = event.error || new Error(event.message);
      this.logError(error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Promise rejection 처리
    window.addEventListener('unhandledrejection', event => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));
      this.logError(error, { type: 'unhandledrejection' });
    });

    // 네트워크 에러 처리
    window.addEventListener('offline', () => {
      this.logWarn('Network connection lost');
    });

    window.addEventListener('online', () => {
      this.logInfo('Network connection restored');
    });
  }

  /**
   * 에러 복구 시도
   */
  async attemptErrorRecovery(
    error: Error,
    context?: Record<string, any>
  ): Promise<ErrorRecoveryResult> {
    try {
      // 에러 타입에 따른 복구 로직
      if (error.name === 'NetworkError') {
        // 네트워크 에러 복구 시도
        await this.retryNetworkOperation();
        return { success: true, message: 'Network error recovered' };
      }

      if (error.name === 'QuotaExceededError') {
        // 저장소 공간 부족 복구 시도
        this.clearOldLogs();
        return {
          success: true,
          message: 'Storage quota exceeded, logs cleared',
        };
      }

      // 기타 에러는 복구 불가능으로 간주
      return { success: false, message: 'Error recovery not possible' };
    } catch (recoveryError) {
      this.logError(recoveryError, { originalError: error.message, context });
      return { success: false, message: 'Error recovery failed' };
    }
  }

  private shouldLog(level: ErrorLog['level']): boolean {
    const levels: ErrorLog['level'][] = ['info', 'warn', 'error', 'critical'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const targetLevelIndex = levels.indexOf(level);
    return targetLevelIndex >= currentLevelIndex;
  }

  private logToConsole(errorLog: ErrorLog): void {
    const logMessage = `[${errorLog.level.toUpperCase()}] ${errorLog.message}`;

    switch (errorLog.level) {
      case 'info':
        console.info(logMessage, errorLog.context);
        break;
      case 'warn':
        console.warn(logMessage, errorLog.context);
        break;
      case 'error':
      case 'critical':
        console.error(logMessage, errorLog.context);
        if (errorLog.stack) {
          console.error(errorLog.stack);
        }
        break;
    }
  }

  private async logToRemote(errorLog: ErrorLog): Promise<void> {
    if (!this.remoteEndpoint) return;

    try {
      await fetch(this.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      });
    } catch (error) {
      console.error('Failed to send error to remote endpoint:', error);
    }
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async retryNetworkOperation(): Promise<void> {
    // 네트워크 재연결 시도 로직
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }

  private clearOldLogs(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.errorLogs = this.errorLogs.filter(log => log.timestamp > oneDayAgo);
  }
}
