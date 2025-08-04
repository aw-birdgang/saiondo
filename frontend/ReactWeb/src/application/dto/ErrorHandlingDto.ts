/**
 * Error Handling Use Case DTOs
 * 에러 처리 관련 Request/Response 인터페이스
 */

export interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'critical';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  operation?: string;
  userAgent?: string;
  url?: string;
}

export interface ErrorReport {
  totalErrors: number;
  errorsByLevel: Record<string, number>;
  errorsByOperation: Record<string, number>;
  recentErrors: ErrorLog[];
  criticalErrors: ErrorLog[];
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface ErrorHandlingConfig {
  enableConsoleLogging?: boolean;
  enableRemoteLogging?: boolean;
  maxLogs?: number;
  logLevel?: ErrorLog['level'];
  remoteEndpoint?: string;
}

export interface ErrorPatternAnalysis {
  mostCommonErrors: Array<{ message: string; count: number }>;
  errorTrends: Array<{ date: string; count: number }>;
  topOperations: Array<{ operation: string; errorCount: number }>;
}

export interface ErrorRecoveryResult {
  success: boolean;
  recoveryMethod?: string;
  message?: string;
  error?: string;
} 