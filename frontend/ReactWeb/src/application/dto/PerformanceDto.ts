/**
 * Performance Monitoring Use Case DTOs
 * 성능 모니터링 관련 Request/Response 인터페이스
 */

export interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceReport {
  totalOperations: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  operationsByType: Record<string, number>;
  slowestOperations: PerformanceMetric[];
  recentErrors: PerformanceMetric[];
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface PerformanceAlert {
  type: 'slow_response' | 'high_error_rate' | 'memory_usage' | 'cpu_usage';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface PerformanceConfig {
  maxMetrics?: number;
  maxAlerts?: number;
  slowThreshold?: number;
  errorRateThreshold?: number;
} 