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

export class MonitoringUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository
  ) {}

  async getSystemMetrics(): Promise<SystemMetrics> {
    // In real implementation, this would collect actual system metrics
    return {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      diskUsage: Math.random() * 100,
      networkLatency: Math.random() * 100,
      activeConnections: Math.floor(Math.random() * 1000),
      requestsPerSecond: Math.random() * 100,
    };
  }

  async getApplicationMetrics(): Promise<ApplicationMetrics> {
    // In real implementation, this would collect actual application metrics
    return {
      responseTime: Math.random() * 1000,
      errorRate: Math.random() * 10,
      throughput: Math.random() * 1000,
      userSessions: Math.floor(Math.random() * 1000),
      databaseConnections: Math.floor(Math.random() * 100),
      cacheHitRate: Math.random() * 100,
    };
  }

  async healthCheck(request: HealthCheckRequest): Promise<HealthCheckResponse> {
    try {
      const systemMetrics = request.includeMetrics ? await this.getSystemMetrics() : undefined;
      const applicationMetrics = request.includeMetrics ? await this.getApplicationMetrics() : undefined;

      // Check if all services are healthy
      const isHealthy = await this.checkServiceHealth();

      return {
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date(),
        uptime: process.uptime() * 1000, // Convert to milliseconds
        version: '1.0.0',
        metrics: request.includeMetrics ? { ...systemMetrics, ...applicationMetrics } : undefined,
        details: request.includeDetails ? await this.getHealthDetails() : undefined,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date(),
        uptime: process.uptime() * 1000,
        version: '1.0.0',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  }

  async getPerformanceMetrics(request: GetPerformanceMetricsRequest): Promise<GetPerformanceMetricsResponse> {
    const metrics: PerformanceMetrics[] = [];
    const now = Date.now();
    const granularityMs = this.getGranularityMs(request.granularity);

    // Generate mock performance data for the time range
    for (let time = now - this.getTimeRangeMs(request.timeRange); time <= now; time += granularityMs) {
      metrics.push({
        averageResponseTime: Math.random() * 1000,
        p95ResponseTime: Math.random() * 2000,
        p99ResponseTime: Math.random() * 5000,
        errorRate: Math.random() * 10,
        throughput: Math.random() * 1000,
        activeUsers: Math.floor(Math.random() * 1000),
      });
    }

    return {
      metrics,
      timeRange: request.timeRange,
      granularity: request.granularity || 'minute',
    };
  }

  private async checkServiceHealth(): Promise<boolean> {
    try {
      // Check if repositories are accessible
      await this.userRepository.findAll();
      await this.channelRepository.findAll();
      await this.messageRepository.findByChannelId('test', 1, 0);
      return true;
    } catch (error) {
      console.error('Service health check failed:', error);
      return false;
    }
  }

  private async getHealthDetails(): Promise<Record<string, any>> {
    return {
      database: { status: 'connected', connections: 5 },
      cache: { status: 'connected', keys: 1000 },
      externalServices: { status: 'healthy' },
    };
  }

  private getTimeRangeMs(timeRange: string): number {
    switch (timeRange) {
      case '1h': return 60 * 60 * 1000;
      case '24h': return 24 * 60 * 60 * 1000;
      case '7d': return 7 * 24 * 60 * 60 * 1000;
      case '30d': return 30 * 24 * 60 * 60 * 1000;
      default: return 60 * 60 * 1000; // 1 hour
    }
  }

  private getGranularityMs(granularity?: string): number {
    switch (granularity) {
      case 'minute': return 60 * 1000;
      case 'hour': return 60 * 60 * 1000;
      case 'day': return 24 * 60 * 60 * 1000;
      default: return 60 * 1000; // 1 minute
    }
  }
} 