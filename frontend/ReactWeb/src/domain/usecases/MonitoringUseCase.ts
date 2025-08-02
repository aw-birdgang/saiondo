import type { IUserRepository } from '../repositories/IUserRepository';
import type { IChannelRepository } from '../repositories/IChannelRepository';
import type { IMessageRepository } from '../repositories/IMessageRepository';
import { DomainErrorFactory } from '../errors/DomainError';

export interface PerformanceMetric {
  id: string;
  operation: string;
  duration: number; // milliseconds
  timestamp: Date;
  userId?: string;
  channelId?: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number; // seconds
  memoryUsage: number; // percentage
  cpuUsage: number; // percentage
  activeConnections: number;
  lastCheck: Date;
  checks: HealthCheck[];
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  responseTime: number; // milliseconds
  lastCheck: Date;
  details?: string;
}

export interface ErrorLog {
  id: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  stack?: string;
  userId?: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

export interface MonitoringRequest {
  operation: string;
  startTime: number;
  userId?: string;
  channelId?: string;
  metadata?: Record<string, unknown>;
}

export interface MonitoringResponse {
  success: boolean;
  metricId: string;
  duration: number;
}

export class MonitoringUseCase {
  private performanceMetrics: PerformanceMetric[] = [];
  private errorLogs: ErrorLog[] = [];
  private readonly maxMetrics = 10000;
  private readonly maxErrorLogs = 5000;
  private startTime = Date.now();

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository
  ) {}

  async startMonitoring(request: MonitoringRequest): Promise<string> {
    try {
      const metricId = this.generateMetricId();
      
      // Store start time for this operation
      this.performanceMetrics.push({
        id: metricId,
        operation: request.operation,
        duration: 0, // Will be updated when operation completes
        timestamp: new Date(request.startTime),
        userId: request.userId,
        channelId: request.channelId,
        success: false, // Will be updated when operation completes
        metadata: request.metadata,
      });

      return metricId;
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      return '';
    }
  }

  async endMonitoring(metricId: string, success: boolean, errorMessage?: string): Promise<void> {
    try {
      const metric = this.performanceMetrics.find(m => m.id === metricId);
      if (metric) {
        metric.duration = Date.now() - metric.timestamp.getTime();
        metric.success = success;
        metric.errorMessage = errorMessage;

        // Keep only recent metrics
        if (this.performanceMetrics.length > this.maxMetrics) {
          this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetrics);
        }
      }
    } catch (error) {
      console.error('Failed to end monitoring:', error);
    }
  }

  async logError(
    level: 'error' | 'warn' | 'info' | 'debug',
    message: string,
    stack?: string,
    userId?: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    try {
      const errorLog: ErrorLog = {
        id: this.generateErrorLogId(),
        level,
        message,
        stack,
        userId,
        timestamp: new Date(),
        context,
      };

      this.errorLogs.push(errorLog);

      // Keep only recent error logs
      if (this.errorLogs.length > this.maxErrorLogs) {
        this.errorLogs = this.errorLogs.slice(-this.maxErrorLogs);
      }

      // Log to console for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${level.toUpperCase()}] ${message}`, { userId, context });
      }
    } catch (error) {
      console.error('Failed to log error:', error);
    }
  }

  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const checks: HealthCheck[] = [];

      // Check database connectivity
      const dbCheck = await this.checkDatabaseHealth();
      checks.push(dbCheck);

      // Check memory usage
      const memoryCheck = this.checkMemoryHealth();
      checks.push(memoryCheck);

      // Check overall system status
      const failedChecks = checks.filter(check => check.status === 'fail');
      const warnChecks = checks.filter(check => check.status === 'warn');

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      if (failedChecks.length > 0) {
        status = 'unhealthy';
      } else if (warnChecks.length > 0) {
        status = 'degraded';
      }

      return {
        status,
        uptime: Math.floor((Date.now() - this.startTime) / 1000),
        memoryUsage: this.getMemoryUsage(),
        cpuUsage: this.getCpuUsage(),
        activeConnections: this.getActiveConnections(),
        lastCheck: new Date(),
        checks,
      };
    } catch (error) {
      console.error('Failed to get system health:', error);
      return {
        status: 'unhealthy',
        uptime: Math.floor((Date.now() - this.startTime) / 1000),
        memoryUsage: 0,
        cpuUsage: 0,
        activeConnections: 0,
        lastCheck: new Date(),
        checks: [],
      };
    }
  }

  async getPerformanceMetrics(
    timeRange: 'hour' | 'day' | 'week' = 'hour',
    operation?: string
  ): Promise<PerformanceMetric[]> {
    try {
      const cutoffTime = this.getCutoffTime(timeRange);
      let filteredMetrics = this.performanceMetrics.filter(
        metric => metric.timestamp >= cutoffTime
      );

      if (operation) {
        filteredMetrics = filteredMetrics.filter(metric => metric.operation === operation);
      }

      return filteredMetrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      return [];
    }
  }

  async getErrorLogs(
    level?: 'error' | 'warn' | 'info' | 'debug',
    limit = 100
  ): Promise<ErrorLog[]> {
    try {
      let filteredLogs = this.errorLogs;

      if (level) {
        filteredLogs = filteredLogs.filter(log => log.level === level);
      }

      return filteredLogs
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get error logs:', error);
      return [];
    }
  }

  async getPerformanceStats(timeRange: 'hour' | 'day' | 'week' = 'hour'): Promise<any> {
    try {
      const metrics = await this.getPerformanceMetrics(timeRange);
      
      if (metrics.length === 0) {
        return {
          totalOperations: 0,
          averageResponseTime: 0,
          successRate: 0,
          operationsByType: {},
          slowestOperations: [],
        };
      }

      const totalOperations = metrics.length;
      const successfulOperations = metrics.filter(m => m.success).length;
      const averageResponseTime = metrics.reduce((sum, m) => sum + m.duration, 0) / totalOperations;
      const successRate = (successfulOperations / totalOperations) * 100;

      // Group by operation type
      const operationsByType: Record<string, { count: number; avgDuration: number }> = {};
      for (const metric of metrics) {
        if (!operationsByType[metric.operation]) {
          operationsByType[metric.operation] = { count: 0, avgDuration: 0 };
        }
        operationsByType[metric.operation].count++;
        operationsByType[metric.operation].avgDuration += metric.duration;
      }

      // Calculate average duration for each operation type
      for (const operation in operationsByType) {
        operationsByType[operation].avgDuration /= operationsByType[operation].count;
      }

      // Get slowest operations
      const slowestOperations = metrics
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10)
        .map(m => ({
          operation: m.operation,
          duration: m.duration,
          timestamp: m.timestamp,
          userId: m.userId,
        }));

      return {
        totalOperations,
        averageResponseTime,
        successRate,
        operationsByType,
        slowestOperations,
      };
    } catch (error) {
      console.error('Failed to get performance stats:', error);
      return {
        totalOperations: 0,
        averageResponseTime: 0,
        successRate: 0,
        operationsByType: {},
        slowestOperations: [],
      };
    }
  }

  async cleanupOldData(): Promise<void> {
    try {
      const cutoffTime = new Date();
      cutoffTime.setDate(cutoffTime.getDate() - 7); // Keep 7 days of data

      const originalMetricsCount = this.performanceMetrics.length;
      const originalErrorLogsCount = this.errorLogs.length;

      this.performanceMetrics = this.performanceMetrics.filter(
        metric => metric.timestamp >= cutoffTime
      );
      this.errorLogs = this.errorLogs.filter(log => log.timestamp >= cutoffTime);

      const removedMetrics = originalMetricsCount - this.performanceMetrics.length;
      const removedErrorLogs = originalErrorLogsCount - this.errorLogs.length;

      if (removedMetrics > 0 || removedErrorLogs > 0) {
        console.log(`Cleaned up ${removedMetrics} old metrics and ${removedErrorLogs} old error logs`);
      }
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
    }
  }

  private async checkDatabaseHealth(): Promise<HealthCheck> {
    const startTime = Date.now();
    try {
      // Try to fetch a user to check database connectivity
      await this.userRepository.findById('test');
      return {
        name: 'database',
        status: 'pass',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
      };
    } catch (error) {
      return {
        name: 'database',
        status: 'fail',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private checkMemoryHealth(): HealthCheck {
    const memoryUsage = this.getMemoryUsage();
    return {
      name: 'memory',
      status: memoryUsage > 90 ? 'fail' : memoryUsage > 70 ? 'warn' : 'pass',
      responseTime: 0,
      lastCheck: new Date(),
      details: `Memory usage: ${memoryUsage.toFixed(2)}%`,
    };
  }

  private getMemoryUsage(): number {
    // In real implementation, this would get actual memory usage
    // For now, return a mock value
    return Math.random() * 100;
  }

  private getCpuUsage(): number {
    // In real implementation, this would get actual CPU usage
    // For now, return a mock value
    return Math.random() * 100;
  }

  private getActiveConnections(): number {
    // In real implementation, this would get actual connection count
    // For now, return a mock value
    return Math.floor(Math.random() * 100);
  }

  private getCutoffTime(timeRange: 'hour' | 'day' | 'week'): Date {
    const now = new Date();
    switch (timeRange) {
      case 'hour':
        return new Date(now.getTime() - 60 * 60 * 1000);
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 60 * 60 * 1000);
    }
  }

  private generateMetricId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `metric_${timestamp}_${random}`;
  }

  private generateErrorLogId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `error_${timestamp}_${random}`;
  }
} 