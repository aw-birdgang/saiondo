/**
 * System Health Use Case DTOs
 * 시스템 건강 상태 관련 Request/Response 인터페이스
 */

export interface SystemHealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  components: {
    performance: 'healthy' | 'degraded' | 'unhealthy';
    security: 'healthy' | 'degraded' | 'unhealthy';
    cache: 'healthy' | 'degraded' | 'unhealthy';
    analytics: 'healthy' | 'degraded' | 'unhealthy';
    database: 'healthy' | 'degraded' | 'unhealthy';
  };
  metrics: {
    responseTime: number;
    errorRate: number;
    cacheHitRate: number;
    activeUsers: number;
    securityViolations: number;
  };
  alerts: Array<{
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: Date;
    component: string;
  }>;
  recommendations: string[];
  lastUpdated: Date;
}

export interface HealthCheckResult {
  component: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  details?: Record<string, any>;
  error?: string;
}

export interface SystemMetrics {
  performance: {
    averageResponseTime: number;
    p95ResponseTime: number;
    errorRate: number;
    throughput: number;
  };
  security: {
    totalViolations: number;
    blockedIPs: number;
    rateLimitExceeded: number;
  };
  cache: {
    hitRate: number;
    totalSize: number;
    evictions: number;
  };
  analytics: {
    activeUsers: number;
    totalEvents: number;
    sessionCount: number;
  };
  database: {
    connectionCount: number;
    queryTime: number;
    errorCount: number;
  };
}

export interface OptimizationRecommendation {
  category: 'performance' | 'security' | 'cache' | 'database';
  priority: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

export interface SystemBackup {
  timestamp: Date;
  data: {
    healthStatus: SystemHealthStatus;
    metrics: SystemMetrics;
    cacheSnapshot: any;
    securitySnapshot: any;
  };
}

export interface RestartPreparation {
  canRestart: boolean;
  warnings: string[];
  cleanupTasks: string[];
} 