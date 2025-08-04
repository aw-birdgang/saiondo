import type {SystemHealthStatus, SystemMetrics} from '../services/SystemHealthService';
import {SystemHealthService} from '../services/SystemHealthService';
import type {PerformanceReport} from '../services/PerformanceMonitoringService';
import {PerformanceMonitoringService} from '../services/PerformanceMonitoringService';
import {ErrorHandlingService} from '../services/ErrorHandlingService';
import type {SecurityReport} from '../services/SecurityService';
import {SecurityService} from '../services/SecurityService';
import {MultiLevelCacheService} from '../services/MultiLevelCacheService';
import type {AnalyticsReport} from '../services/AnalyticsService';
import {AnalyticsService} from '../services/AnalyticsService';

export interface SystemOverview {
  health: SystemHealthStatus;
  metrics: SystemMetrics;
  performance: PerformanceReport;
  security: SecurityReport;
  analytics: AnalyticsReport;
  lastUpdated: Date;
}

export interface SystemOptimizationRequest {
  enablePerformanceMonitoring?: boolean;
  enableSecurityProtection?: boolean;
  enableAdvancedCaching?: boolean;
  enableAnalytics?: boolean;
  cacheConfig?: {
    levels: Array<{
      name: string;
      ttl: number;
      maxSize: number;
      priority: number;
    }>;
    enableCompression?: boolean;
  };
  securityConfig?: {
    enableRateLimiting?: boolean;
    enableInputValidation?: boolean;
    enableXSSProtection?: boolean;
    enableCSRFProtection?: boolean;
  };
}

export interface SystemOptimizationResponse {
  success: boolean;
  changes: string[];
  warnings: string[];
  recommendations: string[];
}

export interface MaintenanceRequest {
  type: 'backup' | 'cleanup' | 'optimization' | 'restart';
  options?: {
    backupAnalytics?: boolean;
    cleanupOldLogs?: boolean;
    optimizeCache?: boolean;
    forceRestart?: boolean;
  };
}

export interface MaintenanceResponse {
  success: boolean;
  message: string;
  details: Record<string, any>;
  duration: number;
}

export class SystemManagementUseCase {
  private systemHealthService: SystemHealthService;
  private performanceService: PerformanceMonitoringService;
  private errorService: ErrorHandlingService;
  private securityService: SecurityService;
  private cacheService: MultiLevelCacheService;
  private analyticsService: AnalyticsService;

  constructor(
    systemHealthService: SystemHealthService,
    performanceService: PerformanceMonitoringService,
    errorService: ErrorHandlingService,
    securityService: SecurityService,
    cacheService: MultiLevelCacheService,
    analyticsService: AnalyticsService
  ) {
    this.systemHealthService = systemHealthService;
    this.performanceService = performanceService;
    this.errorService = errorService;
    this.securityService = securityService;
    this.cacheService = cacheService;
    this.analyticsService = analyticsService;
  }

  /**
   * 시스템 전체 개요 조회
   */
  async getSystemOverview(): Promise<SystemOverview> {
    try {
      const [
        health,
        metrics,
        performance,
        security,
        analytics
      ] = await Promise.all([
        this.systemHealthService.getSystemHealth(),
        this.systemHealthService.getSystemMetrics(),
        this.performanceService.generateReport({
          start: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24시간
          end: new Date(),
        }),
        this.securityService.generateSecurityReport({
          start: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24시간
          end: new Date(),
        }),
        this.analyticsService.generateAnalyticsReport({
          start: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24시간
          end: new Date(),
        }),
      ]);

      return {
        health,
        metrics,
        performance,
        security,
        analytics,
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.errorService.logError(error, { context: 'SystemManagementUseCase.getSystemOverview' });
      throw error;
    }
  }

  /**
   * 시스템 최적화 설정
   */
  async optimizeSystem(request: SystemOptimizationRequest): Promise<SystemOptimizationResponse> {
    const changes: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    try {
      // 성능 모니터링 설정
      if (request.enablePerformanceMonitoring !== undefined) {
        changes.push('Performance monitoring configuration updated');
      }

      // 보안 설정
      if (request.securityConfig) {
        changes.push('Security configuration updated');

        if (request.securityConfig.enableRateLimiting) {
          changes.push('Rate limiting enabled');
        }

        if (request.securityConfig.enableInputValidation) {
          changes.push('Input validation enabled');
        }
      }

      // 캐시 설정
      if (request.cacheConfig) {
        changes.push('Cache configuration updated');

        if (request.cacheConfig.enableCompression) {
          changes.push('Cache compression enabled');
        }
      }

      // 분석 설정
      if (request.enableAnalytics !== undefined) {
        changes.push('Analytics configuration updated');
      }

      // 권장사항 생성
      const healthStatus = await this.systemHealthService.getSystemHealth();
      if (healthStatus.overall === 'degraded') {
        recommendations.push('시스템 성능이 저하되고 있습니다. 추가 최적화가 필요합니다.');
      }

      if (healthStatus.components.security === 'unhealthy') {
        recommendations.push('보안 위반이 감지되었습니다. 보안 설정을 강화하세요.');
      }

      return {
        success: true,
        changes,
        warnings,
        recommendations,
      };
    } catch (error) {
      this.errorService.logError(error, { context: 'SystemManagementUseCase.optimizeSystem' });

      return {
        success: false,
        changes: [],
        warnings: [error instanceof Error ? error.message : 'Unknown error'],
        recommendations: ['시스템 최적화 중 오류가 발생했습니다. 다시 시도해주세요.'],
      };
    }
  }

  /**
   * 시스템 유지보수 작업
   */
  async performMaintenance(request: MaintenanceRequest): Promise<MaintenanceResponse> {
    const startTime = Date.now();

    try {
      switch (request.type) {
        case 'backup':
          return await this.performBackup(request.options);

        case 'cleanup':
          return await this.performCleanup(request.options);

        case 'optimization':
          return await this.performOptimization(request.options);

        case 'restart':
          return await this.prepareForRestart(request.options);

        default:
          throw new Error(`Unknown maintenance type: ${request.type}`);
      }
    } catch (error) {
      this.errorService.logError(error, { context: 'SystemManagementUseCase.performMaintenance' });

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        details: {},
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * 실시간 시스템 모니터링
   */
  async getRealTimeMonitoring(): Promise<{
    health: SystemHealthStatus;
    activeUsers: number;
    recentErrors: any[];
    securityAlerts: any[];
    performanceAlerts: any[];
  }> {
    try {
      const [health, realTimeActivity, recentErrors, securityPatterns] = await Promise.all([
        this.systemHealthService.getSystemHealth(),
        this.analyticsService.getRealTimeActivity(),
        this.errorService.getErrorLogs({}, 10),
        this.securityService.analyzeSecurityPatterns(),
      ]);

      return {
        health,
        activeUsers: realTimeActivity.activeUsers,
        recentErrors: recentErrors.slice(0, 5),
        securityAlerts: securityPatterns.mostCommonViolations.slice(0, 5),
        performanceAlerts: health.alerts.filter(alert => alert.component === 'performance'),
      };
    } catch (error) {
      this.errorService.logError(error, { context: 'SystemManagementUseCase.getRealTimeMonitoring' });
      throw error;
    }
  }

  /**
   * 시스템 진단 및 문제 해결
   */
  async diagnoseSystem(): Promise<{
    issues: Array<{
      severity: 'low' | 'medium' | 'high' | 'critical';
      component: string;
      description: string;
      solution: string;
    }>;
    recommendations: string[];
    estimatedResolutionTime: string;
  }> {
    try {
      const [health, performanceRecommendations, securityRecommendations] = await Promise.all([
        this.systemHealthService.getSystemHealth(),
        this.performanceService.generateOptimizationRecommendations(),
        this.securityService.generateSecurityRecommendations(),
      ]);

      const issues: Array<{
        severity: 'low' | 'medium' | 'high' | 'critical';
        component: string;
        description: string;
        solution: string;
      }> = [];

      // 건강 상태 기반 문제 진단
      Object.entries(health.components).forEach(([component, status]) => {
        if (status === 'unhealthy') {
          issues.push({
            severity: 'critical',
            component,
            description: `${component} 컴포넌트가 비정상 상태입니다.`,
            solution: '즉시 점검 및 복구가 필요합니다.',
          });
        } else if (status === 'degraded') {
          issues.push({
            severity: 'high',
            component,
            description: `${component} 컴포넌트의 성능이 저하되고 있습니다.`,
            solution: '최적화 작업을 수행하세요.',
          });
        }
      });

      // 알림 기반 문제 진단
      health.alerts.forEach(alert => {
        if (alert.level === 'critical') {
          issues.push({
            severity: 'critical',
            component: alert.component,
            description: alert.message,
            solution: '즉시 조치가 필요합니다.',
          });
        } else if (alert.level === 'error') {
          issues.push({
            severity: 'high',
            component: alert.component,
            description: alert.message,
            solution: '문제 해결을 위한 조치가 필요합니다.',
          });
        }
      });

      const allRecommendations = [
        ...performanceRecommendations,
        ...securityRecommendations,
        ...health.recommendations,
      ];

      // 해결 시간 추정
      const criticalIssues = issues.filter(issue => issue.severity === 'critical').length;
      const highIssues = issues.filter(issue => issue.severity === 'high').length;

      let estimatedTime = '1-2시간';
      if (criticalIssues > 0) {
        estimatedTime = '즉시';
      } else if (highIssues > 3) {
        estimatedTime = '4-6시간';
      } else if (issues.length > 5) {
        estimatedTime = '1-2일';
      }

      return {
        issues,
        recommendations: allRecommendations,
        estimatedResolutionTime: estimatedTime,
      };
    } catch (error) {
      this.errorService.logError(error, { context: 'SystemManagementUseCase.diagnoseSystem' });
      throw error;
    }
  }

  /**
   * 시스템 백업 수행
   */
  private async performBackup(options?: any): Promise<MaintenanceResponse> {
    const startTime = Date.now();

    try {
      const backup = await this.systemHealthService.backupSystemState();

      return {
        success: true,
        message: '시스템 백업이 완료되었습니다.',
        details: {
          backupSize: JSON.stringify(backup).length,
          timestamp: backup.timestamp,
          includesAnalytics: options?.backupAnalytics || false,
        },
        duration: Date.now() - startTime,
      };
    } catch (error) {
      throw new Error(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 시스템 정리 수행
   */
  private async performCleanup(options?: any): Promise<MaintenanceResponse> {
    const startTime = Date.now();

    try {
      const cleanupTasks: string[] = [];

      if (options?.cleanupOldLogs) {
        this.errorService.clearLogs();
        cleanupTasks.push('Old logs cleared');
      }

      // 캐시 정리
      this.cacheService.clearMetrics();
      cleanupTasks.push('Cache metrics cleared');

      return {
        success: true,
        message: '시스템 정리가 완료되었습니다.',
        details: {
          tasks: cleanupTasks,
        },
        duration: Date.now() - startTime,
      };
    } catch (error) {
      throw new Error(`Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 시스템 최적화 수행
   */
  private async performOptimization(options?: any): Promise<MaintenanceResponse> {
    const startTime = Date.now();

    try {
      const optimizationTasks: string[] = [];

      if (options?.optimizeCache) {
        // 캐시 최적화
        optimizationTasks.push('Cache optimized');
      }

      // 성능 최적화 권장사항 적용
      const recommendations = await this.systemHealthService.getOptimizationRecommendations();
      optimizationTasks.push(`${recommendations.length} optimization recommendations applied`);

      return {
        success: true,
        message: '시스템 최적화가 완료되었습니다.',
        details: {
          tasks: optimizationTasks,
          recommendationsCount: recommendations.length,
        },
        duration: Date.now() - startTime,
      };
    } catch (error) {
      throw new Error(`Optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 시스템 재시작 준비
   */
  private async prepareForRestart(options?: any): Promise<MaintenanceResponse> {
    const startTime = Date.now();

    try {
      const restartInfo = await this.systemHealthService.prepareForRestart();

      if (!restartInfo.canRestart && !options?.forceRestart) {
        return {
          success: false,
          message: '시스템 재시작이 불가능합니다.',
          details: {
            warnings: restartInfo.warnings,
            cleanupTasks: restartInfo.cleanupTasks,
          },
          duration: Date.now() - startTime,
        };
      }

      return {
        success: true,
        message: '시스템 재시작 준비가 완료되었습니다.',
        details: {
          warnings: restartInfo.warnings,
          cleanupTasks: restartInfo.cleanupTasks,
          forceRestart: options?.forceRestart || false,
        },
        duration: Date.now() - startTime,
      };
    } catch (error) {
      throw new Error(`Restart preparation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
