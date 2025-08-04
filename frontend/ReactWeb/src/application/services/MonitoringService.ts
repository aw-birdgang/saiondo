import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { 
  SystemMetrics,
  ApplicationMetrics,
  HealthCheckRequest,
  HealthCheckResponse,
  PerformanceMetrics,
  GetPerformanceMetricsRequest,
  GetPerformanceMetricsResponse
} from '../dto/MonitoringDto';

export interface MonitoringConfig {
  enableMetrics?: boolean;
  enableHealthChecks?: boolean;
  metricsInterval?: number;
  healthCheckInterval?: number;
}

export class MonitoringService {
  private metricsHistory: PerformanceMetrics[] = [];
  private healthCheckHistory: HealthCheckResponse[] = [];
  private readonly maxHistorySize = 1000;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly config: MonitoringConfig = {}
  ) {}

  async getSystemMetrics(): Promise<SystemMetrics> {
    // In real implementation, this would collect actual system metrics
    // For now, return mock data
    return {
      cpuUsage: this.getRandomMetric(0, 100),
      memoryUsage: this.getRandomMetric(0, 100),
      diskUsage: this.getRandomMetric(0, 100),
      networkLatency: this.getRandomMetric(0, 100),
      activeConnections: Math.floor(this.getRandomMetric(0, 1000)),
      requestsPerSecond: this.getRandomMetric(0, 100),
    };
  }

  async getApplicationMetrics(): Promise<ApplicationMetrics> {
    // In real implementation, this would collect actual application metrics
    // For now, return mock data
    return {
      responseTime: this.getRandomMetric(0, 1000),
      errorRate: this.getRandomMetric(0, 10),
      throughput: this.getRandomMetric(0, 1000),
      userSessions: Math.floor(this.getRandomMetric(0, 1000)),
      databaseConnections: Math.floor(this.getRandomMetric(0, 100)),
      cacheHitRate: this.getRandomMetric(0, 100),
    };
  }

  async healthCheck(request: HealthCheckRequest): Promise<HealthCheckResponse> {
    try {
      const systemMetrics = request.includeMetrics ? await this.getSystemMetrics() : undefined;
      const applicationMetrics = request.includeMetrics ? await this.getApplicationMetrics() : undefined;

      // Check if all services are healthy
      const isHealthy = await this.checkServiceHealth();

      const response: HealthCheckResponse = {
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date(),
        uptime: process.uptime() * 1000, // Convert to milliseconds
        version: '1.0.0',
        metrics: request.includeMetrics ? { ...systemMetrics, ...applicationMetrics } as SystemMetrics & ApplicationMetrics : undefined,
        details: request.includeDetails ? await this.getHealthDetails() : undefined,
      };

      // Store health check history
      this.addToHealthCheckHistory(response);

      return response;
    } catch (error) {
      const response: HealthCheckResponse = {
        status: 'unhealthy',
        timestamp: new Date(),
        uptime: process.uptime() * 1000,
        version: '1.0.0',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      };

      this.addToHealthCheckHistory(response);
      return response;
    }
  }

  async getPerformanceMetrics(request: GetPerformanceMetricsRequest): Promise<GetPerformanceMetricsResponse> {
    const metrics: PerformanceMetrics[] = [];
    const now = Date.now();
    const granularityMs = this.getGranularityMs(request.granularity);
    const timeRangeMs = this.getTimeRangeMs(request.timeRange);

          // Generate mock performance data for the time range
      for (let time = now - timeRangeMs; time <= now; time += granularityMs) {
        const metric: PerformanceMetrics = {
          averageResponseTime: this.getRandomMetric(0, 1000),
          p95ResponseTime: this.getRandomMetric(0, 2000),
          p99ResponseTime: this.getRandomMetric(0, 5000),
          errorRate: this.getRandomMetric(0, 10),
          throughput: this.getRandomMetric(0, 1000),
          activeUsers: Math.floor(this.getRandomMetric(0, 1000)),
        };

        metrics.push(metric);
        this.addToMetricsHistory(metric);
      }

    return {
      metrics,
      timeRange: request.timeRange,
      granularity: request.granularity || 'minute',
    };
  }

  async getMetricsHistory(limit: number = 100): Promise<PerformanceMetrics[]> {
    return this.metricsHistory.slice(-limit);
  }

  async getHealthCheckHistory(limit: number = 100): Promise<HealthCheckResponse[]> {
    return this.healthCheckHistory.slice(-limit);
  }

  async getServiceStatus(): Promise<Record<string, 'healthy' | 'degraded' | 'unhealthy'>> {
    const status: Record<string, 'healthy' | 'degraded' | 'unhealthy'> = {};

    try {
      // Check user repository
      await this.userRepository.findAll();
      status.userRepository = 'healthy';
    } catch (error) {
      status.userRepository = 'unhealthy';
    }

    try {
      // Check channel repository
      await this.channelRepository.findAll();
      status.channelRepository = 'healthy';
    } catch (error) {
      status.channelRepository = 'unhealthy';
    }

    try {
      // Check message repository by counting messages
      await this.messageRepository.countByChannelId('test');
      status.messageRepository = 'healthy';
    } catch (error) {
      status.messageRepository = 'unhealthy';
    }

    return status;
  }

  async getSystemAlerts(): Promise<Array<{ level: 'info' | 'warning' | 'error'; message: string; timestamp: Date }>> {
    const alerts: Array<{ level: 'info' | 'warning' | 'error'; message: string; timestamp: Date }> = [];
    const now = new Date();

    // Check system metrics for alerts
    const systemMetrics = await this.getSystemMetrics();
    const appMetrics = await this.getApplicationMetrics();

    // CPU usage alert
    if (systemMetrics.cpuUsage > 80) {
      alerts.push({
        level: 'warning',
        message: `High CPU usage: ${systemMetrics.cpuUsage.toFixed(2)}%`,
        timestamp: now,
      });
    }

    // Memory usage alert
    if (systemMetrics.memoryUsage > 85) {
      alerts.push({
        level: 'warning',
        message: `High memory usage: ${systemMetrics.memoryUsage.toFixed(2)}%`,
        timestamp: now,
      });
    }

    // Error rate alert
    if (appMetrics.errorRate > 5) {
      alerts.push({
        level: 'error',
        message: `High error rate: ${appMetrics.errorRate.toFixed(2)}%`,
        timestamp: now,
      });
    }

    return alerts;
  }

  private async checkServiceHealth(): Promise<boolean> {
    try {
      // Check if repositories are accessible
      await this.userRepository.findAll();
      await this.channelRepository.findAll();
      await this.messageRepository.countByChannelId('test');

      // Check system resources
      const systemMetrics = await this.getSystemMetrics();
      const isSystemHealthy = systemMetrics.cpuUsage < 90 && systemMetrics.memoryUsage < 95;

      return isSystemHealthy;
    } catch (error) {
      return false;
    }
  }

  private async getHealthDetails(): Promise<Record<string, any>> {
    const serviceStatus = await this.getServiceStatus();
    const systemMetrics = await this.getSystemMetrics();
    const appMetrics = await this.getApplicationMetrics();

    return {
      services: serviceStatus,
      system: systemMetrics,
      application: appMetrics,
      timestamp: new Date(),
    };
  }

  private getTimeRangeMs(timeRange: string): number {
    switch (timeRange) {
      case '1h':
        return 60 * 60 * 1000;
      case '6h':
        return 6 * 60 * 60 * 1000;
      case '24h':
        return 24 * 60 * 60 * 1000;
      case '7d':
        return 7 * 24 * 60 * 60 * 1000;
      default:
        return 60 * 60 * 1000; // 1 hour default
    }
  }

  private getGranularityMs(granularity?: string): number {
    switch (granularity) {
      case 'second':
        return 1000;
      case 'minute':
        return 60 * 1000;
      case 'hour':
        return 60 * 60 * 1000;
      case 'day':
        return 24 * 60 * 60 * 1000;
      default:
        return 60 * 1000; // 1 minute default
    }
  }

  private getRandomMetric(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private addToMetricsHistory(metric: PerformanceMetrics): void {
    this.metricsHistory.push(metric);
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory.shift();
    }
  }

  private addToHealthCheckHistory(healthCheck: HealthCheckResponse): void {
    this.healthCheckHistory.push(healthCheck);
    if (this.healthCheckHistory.length > this.maxHistorySize) {
      this.healthCheckHistory.shift();
    }
  }
} 