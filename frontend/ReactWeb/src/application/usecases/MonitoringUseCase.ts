import { MonitoringService } from '../services/MonitoringService';
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
  constructor(private readonly monitoringService: MonitoringService) {}

  async getSystemMetrics(): Promise<SystemMetrics> {
    return await this.monitoringService.getSystemMetrics();
  }

  async getApplicationMetrics(): Promise<ApplicationMetrics> {
    return await this.monitoringService.getApplicationMetrics();
  }

  async healthCheck(request: HealthCheckRequest): Promise<HealthCheckResponse> {
    return await this.monitoringService.healthCheck(request);
  }

  async getPerformanceMetrics(request: GetPerformanceMetricsRequest): Promise<GetPerformanceMetricsResponse> {
    return await this.monitoringService.getPerformanceMetrics(request);
  }
} 