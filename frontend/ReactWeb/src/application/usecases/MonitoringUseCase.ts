import { MonitoringService } from '../services/MonitoringService';
import type { 
  SystemMetrics,
  ApplicationMetrics,
  HealthCheckRequest,
  HealthCheckResponse,
  GetPerformanceMetricsRequest,
  GetPerformanceMetricsResponse
} from '../dto/MonitoringDto';
import type { IUseCase } from './interfaces/IUseCase';

export class MonitoringUseCase implements IUseCase<HealthCheckRequest, HealthCheckResponse> {
  constructor(private readonly monitoringService: MonitoringService) {}

  async execute(request: HealthCheckRequest): Promise<HealthCheckResponse> {
    return this.healthCheck(request);
  }

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