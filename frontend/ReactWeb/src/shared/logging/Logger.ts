export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  maxEntries: number;
}

export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private entries: LogEntry[] = [];
  private readonly maxEntries: number;

  private constructor(config: LoggerConfig) {
    this.config = config;
    this.maxEntries = config.maxEntries;
  }

  static getInstance(config?: Partial<LoggerConfig>): Logger {
    if (!Logger.instance) {
      const defaultConfig: LoggerConfig = {
        level: LogLevel.INFO,
        enableConsole: true,
        enableRemote: false,
        maxEntries: 1000,
        ...config,
      };
      Logger.instance = new Logger(defaultConfig);
    }
    return Logger.instance;
  }

  /**
   * 디버그 레벨 로그
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * 정보 레벨 로그
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * 경고 레벨 로그
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * 에러 레벨 로그
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * 치명적 에러 레벨 로그
   */
  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  /**
   * 성능 측정 로그
   */
  time(label: string, fn: () => void | Promise<void>): void {
    const start = performance.now();
    
    try {
      const result = fn();
      if (result instanceof Promise) {
        result.then(() => {
          const duration = performance.now() - start;
          this.info(`Performance: ${label} completed in ${duration.toFixed(2)}ms`);
        }).catch((error) => {
          const duration = performance.now() - start;
          this.error(`Performance: ${label} failed after ${duration.toFixed(2)}ms`, error);
        });
      } else {
        const duration = performance.now() - start;
        this.info(`Performance: ${label} completed in ${duration.toFixed(2)}ms`);
      }
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`Performance: ${label} failed after ${duration.toFixed(2)}ms`, error as Error);
    }
  }

  /**
   * 로그 레벨 설정
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * 로그 설정 업데이트
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 로그 엔트리 조회
   */
  getEntries(level?: LogLevel, limit?: number): LogEntry[] {
    let filtered = this.entries;
    
    if (level !== undefined) {
      filtered = filtered.filter(entry => entry.level >= level);
    }
    
    if (limit) {
      filtered = filtered.slice(-limit);
    }
    
    return [...filtered];
  }

  /**
   * 로그 엔트리 정리
   */
  clear(): void {
    this.entries = [];
  }

  /**
   * 로그 내보내기
   */
  export(): string {
    return JSON.stringify(this.entries, null, 2);
  }

  /**
   * 내부 로그 메서드
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      error,
    };

    // 로그 엔트리 저장
    this.entries.push(entry);
    
    // 최대 엔트리 수 제한
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    // 콘솔 출력
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // 원격 로깅
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.logToRemote(entry).catch(err => {
        console.error('Failed to send log to remote:', err);
      });
    }
  }

  /**
   * 콘솔에 로그 출력
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const levelStr = LogLevel[entry.level];
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const errorStr = entry.error ? `\n${entry.error.stack}` : '';

    const logMessage = `[${timestamp}] ${levelStr}: ${entry.message}${contextStr}${errorStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
      case LogLevel.INFO:
        console.info(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logMessage);
        break;
    }
  }

  /**
   * 원격 서버에 로그 전송
   */
  private async logToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.remoteEndpoint) {
      return;
    }

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to remote:', error);
    }
  }
}

// 편의 함수들
export const logger = Logger.getInstance();

export const debug = (message: string, context?: Record<string, any>) => logger.debug(message, context);
export const info = (message: string, context?: Record<string, any>) => logger.info(message, context);
export const warn = (message: string, context?: Record<string, any>) => logger.warn(message, context);
export const error = (message: string, error?: Error, context?: Record<string, any>) => logger.error(message, error, context);
export const fatal = (message: string, error?: Error, context?: Record<string, any>) => logger.fatal(message, error, context);
export const time = (label: string, fn: () => void | Promise<void>) => logger.time(label, fn);

export default Logger; 