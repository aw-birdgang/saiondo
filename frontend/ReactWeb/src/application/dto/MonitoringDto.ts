/**
 * Monitoring Use Case DTOs
 * 모니터링 관련 Request/Response 인터페이스
 */

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  activeConnections: number;
  requestsPerSecond: number;
}

export interface ApplicationMetrics {
  responseTime: number;
  errorRate: number;
  throughput: number;
  userSessions: number;
  databaseConnections: number;
  cacheHitRate: number;
}

export interface HealthCheckRequest {
  includeMetrics?: boolean;
  includeDetails?: boolean;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  version: string;
  metrics?: SystemMetrics & ApplicationMetrics;
  details?: Record<string, any>;
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  throughput: number;
  activeUsers: number;
}

export interface GetPerformanceMetricsRequest {
  timeRange: '1h' | '24h' | '7d' | '30d';
  granularity?: 'minute' | 'hour' | 'day';
}

export interface GetPerformanceMetricsResponse {
  metrics: PerformanceMetrics[];
  timeRange: string;
  granularity: string;
}

export interface MonitoringConfig {
  enableMetrics?: boolean;
  enableHealthChecks?: boolean;
  metricsInterval?: number;
  healthCheckInterval?: number;
} 