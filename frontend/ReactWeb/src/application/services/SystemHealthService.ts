import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { PerformanceMonitoringService } from './PerformanceMonitoringService';
import { ErrorHandlingService } from './ErrorHandlingService';
import { SecurityService } from './SecurityService';
import { MultiLevelCacheService } from './MultiLevelCacheService';
import { AnalyticsService } from './AnalyticsService';
import type {
  SystemHealthStatus,
  HealthCheckResult,
  SystemMetrics,
  OptimizationRecommendation,
  SystemBackup,
  RestartPreparation,
} from '../dto/SystemHealthDto';

export class SystemHealthService {
  private performanceService: PerformanceMonitoringService;
  private errorService: ErrorHandlingService;
  private securityService: SecurityService;
  private cacheService: MultiLevelCacheService;
  private analyticsService: AnalyticsService;
  private healthStatus: SystemHealthStatus;
  private readonly checkInterval: number;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    config: {
      checkInterval?: number;
      performanceConfig?: any;
      securityConfig?: any;
      cacheConfig?: any;
    } = {}
  ) {
    this.checkInterval = config.checkInterval || 30000; // 30초

    // 서비스 초기화
    this.performanceService = new PerformanceMonitoringService(
      userRepository,
      channelRepository,
      messageRepository
    );

    this.errorService = new ErrorHandlingService({
      enableConsoleLogging: true,
      enableRemoteLogging: false,
    });

    this.securityService = new SecurityService({
      enableRateLimiting: true,
      enableInputValidation: true,
      enableXSSProtection: true,
      enableCSRFProtection: true,
    });

    this.cacheService = new MultiLevelCacheService(
      userRepository,
      channelRepository,
      messageRepository,
      {
        levels: [
          { name: 'L1', ttl: 60000, maxSize: 1000, priority: 1 },
          { name: 'L2', ttl: 300000, maxSize: 5000, priority: 2 },
          { name: 'L3', ttl: 1800000, maxSize: 10000, priority: 3 },
        ],
        enableCompression: true,
        enableMetrics: true,
      }
    );

    this.analyticsService = new AnalyticsService(
      userRepository,
      channelRepository,
      messageRepository
    );

    // 초기 상태 설정
    this.healthStatus = this.getInitialHealthStatus();

    // 정기적인 건강 상태 체크 시작
    this.startHealthMonitoring();
  }

  /**
   * 전체 시스템 건강 상태 조회
   */
  async getSystemHealth(): Promise<SystemHealthStatus> {
    try {
      const healthChecks = await Promise.all([
        this.checkPerformanceHealth(),
        this.checkSecurityHealth(),
        this.checkCacheHealth(),
        this.checkAnalyticsHealth(),
        this.checkDatabaseHealth(),
      ]);

      // 컴포넌트별 상태 업데이트
      healthChecks.forEach(check => {
        this.healthStatus.components[
          check.component as keyof SystemHealthStatus['components']
        ] = check.status;
      });

      // 전체 상태 결정
      this.healthStatus.overall = this.determineOverallStatus(healthChecks);

      // 메트릭 업데이트
      this.healthStatus.metrics = await this.collectMetrics();

      // 알림 및 권장사항 업데이트
      this.healthStatus.alerts = await this.collectAlerts();
      this.healthStatus.recommendations = await this.generateRecommendations();

      this.healthStatus.lastUpdated = new Date();

      return this.healthStatus;
    } catch (error) {
      this.errorService.logError(error as Error, {
        context: 'SystemHealthService.getSystemHealth',
      });

      // 에러 발생 시 degraded 상태로 설정
      this.healthStatus.overall = 'degraded';
      this.healthStatus.alerts.push({
        level: 'error',
        message: 'Failed to check system health',
        timestamp: new Date(),
        component: 'system',
      });

      return this.healthStatus;
    }
  }

  /**
   * 실시간 시스템 메트릭 조회
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    const [performanceStats, securityReport, cacheStats, realTimeActivity] =
      await Promise.all([
        this.performanceService.generateReport({
          start: new Date(Date.now() - 24 * 60 * 60 * 1000),
          end: new Date(),
        }),
        this.securityService.generateSecurityReport({
          start: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24시간
          end: new Date(),
        }),
        this.cacheService.getStats(),
        this.analyticsService.getRealTimeActivity(),
      ]);

    return {
      performance: {
        averageResponseTime: performanceStats.averageResponseTime || 0,
        p95ResponseTime: performanceStats.p95ResponseTime || 0,
        errorRate: performanceStats.errorRate || 0,
        throughput: 0, // PerformanceReport doesn't have throughput property
      },
      security: {
        totalViolations: securityReport.totalViolations,
        blockedIPs: securityReport.blockedIPs.length,
        rateLimitExceeded: securityReport.violationsByType['rate_limit'] || 0,
      },
      cache: {
        hitRate: cacheStats.hitRate,
        totalSize: cacheStats.totalSize,
        evictions: cacheStats.evictions,
      },
      analytics: {
        activeUsers: realTimeActivity.activeUsers,
        totalEvents: realTimeActivity.recentEvents.length,
        sessionCount: 0, // 실제로는 세션 수를 계산해야 함
      },
      database: {
        connectionCount: 0, // 실제로는 DB 연결 수를 가져와야 함
        queryTime: 0, // 실제로는 쿼리 시간을 측정해야 함
        errorCount: 0, // 실제로는 DB 에러 수를 가져와야 함
      },
    };
  }

  /**
   * 시스템 최적화 권장사항
   */
  async getOptimizationRecommendations(): Promise<
    Array<OptimizationRecommendation>
  > {
    const recommendations: Array<OptimizationRecommendation> = [];

    const metrics = await this.getSystemMetrics();

    // 성능 권장사항
    if (metrics.performance.averageResponseTime > 500) {
      recommendations.push({
        category: 'performance',
        priority: 'high',
        recommendation:
          '응답 시간이 500ms를 초과합니다. 캐싱을 강화하거나 데이터베이스 쿼리를 최적화하세요.',
        impact: '사용자 경험 개선',
        effort: 'medium',
      });
    }

    if (metrics.performance.errorRate > 0.01) {
      recommendations.push({
        category: 'performance',
        priority: 'critical',
        recommendation:
          '에러율이 1%를 초과합니다. 에러 처리 로직을 점검하세요.',
        impact: '시스템 안정성 향상',
        effort: 'high',
      });
    }

    // 보안 권장사항
    if (metrics.security.totalViolations > 10) {
      recommendations.push({
        category: 'security',
        priority: 'high',
        recommendation:
          '보안 위반이 증가하고 있습니다. 보안 설정을 강화하세요.',
        impact: '보안 강화',
        effort: 'medium',
      });
    }

    // 캐시 권장사항
    if (metrics.cache.hitRate < 0.8) {
      recommendations.push({
        category: 'cache',
        priority: 'medium',
        recommendation: '캐시 히트율이 80% 미만입니다. 캐시 전략을 개선하세요.',
        impact: '성능 향상',
        effort: 'low',
      });
    }

    return recommendations;
  }

  /**
   * 시스템 백업 및 복구
   */
  async backupSystemState(): Promise<SystemBackup> {
    const [healthStatus, metrics] = await Promise.all([
      this.getSystemHealth(),
      this.getSystemMetrics(),
    ]);

    return {
      timestamp: new Date(),
      data: {
        healthStatus,
        metrics,
        cacheSnapshot: this.cacheService.getStats(),
        securitySnapshot: this.securityService.generateSecurityReport({
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1주일
          end: new Date(),
        }),
      },
    };
  }

  /**
   * 시스템 재시작 준비
   */
  async prepareForRestart(): Promise<RestartPreparation> {
    const warnings: string[] = [];
    const cleanupTasks: string[] = [];

    // 활성 사용자 확인
    const realTimeActivity = this.analyticsService.getRealTimeActivity();
    if (realTimeActivity.activeUsers > 0) {
      warnings.push(
        `${realTimeActivity.activeUsers}명의 활성 사용자가 있습니다.`
      );
    }

    // 진행 중인 작업 확인
    const performanceStats = this.performanceService.generateReport({
      start: new Date(Date.now() - 24 * 60 * 60 * 1000),
      end: new Date(),
    });
    if (performanceStats.totalOperations > 0) {
      warnings.push(`${performanceStats.totalOperations}개의 작업이 있습니다.`);
    }

    // 정리 작업
    cleanupTasks.push('캐시 데이터 정리');
    cleanupTasks.push('임시 파일 정리');
    cleanupTasks.push('로그 파일 압축');

    return {
      canRestart: warnings.length === 0,
      warnings,
      cleanupTasks,
    };
  }

  private async checkPerformanceHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const stats = this.performanceService.generateReport({
        start: new Date(Date.now() - 24 * 60 * 60 * 1000),
        end: new Date(),
      });
      const responseTime = Date.now() - startTime;

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

      if (stats.errorRate > 0.05) status = 'unhealthy';
      else if (stats.errorRate > 0.01) status = 'degraded';

      return {
        component: 'performance',
        status,
        responseTime,
        details: stats,
      };
    } catch (error) {
      return {
        component: 'performance',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkSecurityHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const report = this.securityService.generateSecurityReport({
        start: new Date(Date.now() - 60 * 60 * 1000), // 1시간
        end: new Date(),
      });

      const responseTime = Date.now() - startTime;
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

      if (report.totalViolations > 50) status = 'unhealthy';
      else if (report.totalViolations > 10) status = 'degraded';

      return {
        component: 'security',
        status,
        responseTime,
        details: report,
      };
    } catch (error) {
      return {
        component: 'security',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkCacheHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const stats = this.cacheService.getStats();
      const responseTime = Date.now() - startTime;

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

      if (stats.hitRate < 0.5) status = 'unhealthy';
      else if (stats.hitRate < 0.8) status = 'degraded';

      return {
        component: 'cache',
        status,
        responseTime,
        details: stats,
      };
    } catch (error) {
      return {
        component: 'cache',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkAnalyticsHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const activity = this.analyticsService.getRealTimeActivity();
      const responseTime = Date.now() - startTime;

      return {
        component: 'analytics',
        status: 'healthy',
        responseTime,
        details: activity,
      };
    } catch (error) {
      return {
        component: 'analytics',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkDatabaseHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      // 간단한 DB 연결 테스트
      await this.userRepository.findAll();
      const responseTime = Date.now() - startTime;

      return {
        component: 'database',
        status: 'healthy',
        responseTime,
        details: { connectionStatus: 'connected' },
      };
    } catch (error) {
      return {
        component: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private determineOverallStatus(
    checks: HealthCheckResult[]
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const hasUnhealthy = checks.some(check => check.status === 'unhealthy');
    const hasDegraded = checks.some(check => check.status === 'degraded');

    if (hasUnhealthy) return 'unhealthy';
    if (hasDegraded) return 'degraded';
    return 'healthy';
  }

  private async collectMetrics(): Promise<SystemHealthStatus['metrics']> {
    const metrics = await this.getSystemMetrics();

    return {
      responseTime: metrics.performance.averageResponseTime,
      errorRate: metrics.performance.errorRate,
      cacheHitRate: metrics.cache.hitRate,
      activeUsers: metrics.analytics.activeUsers,
      securityViolations: metrics.security.totalViolations,
    };
  }

  private async collectAlerts(): Promise<SystemHealthStatus['alerts']> {
    const alerts: SystemHealthStatus['alerts'] = [];
    const metrics = await this.getSystemMetrics();

    // 성능 알림
    if (metrics.performance.averageResponseTime > 1000) {
      alerts.push({
        level: 'warning',
        message: '평균 응답 시간이 1초를 초과합니다.',
        timestamp: new Date(),
        component: 'performance',
      });
    }

    if (metrics.performance.errorRate > 0.05) {
      alerts.push({
        level: 'error',
        message: '에러율이 5%를 초과합니다.',
        timestamp: new Date(),
        component: 'performance',
      });
    }

    // 보안 알림
    if (metrics.security.totalViolations > 20) {
      alerts.push({
        level: 'warning',
        message: '보안 위반이 증가하고 있습니다.',
        timestamp: new Date(),
        component: 'security',
      });
    }

    // 캐시 알림
    if (metrics.cache.hitRate < 0.7) {
      alerts.push({
        level: 'warning',
        message: '캐시 히트율이 70% 미만입니다.',
        timestamp: new Date(),
        component: 'cache',
      });
    }

    return alerts;
  }

  private async generateRecommendations(): Promise<string[]> {
    const recommendations = await this.getOptimizationRecommendations();
    return recommendations.map(rec => rec.recommendation);
  }

  private getInitialHealthStatus(): SystemHealthStatus {
    return {
      overall: 'healthy',
      components: {
        performance: 'healthy',
        security: 'healthy',
        cache: 'healthy',
        analytics: 'healthy',
        database: 'healthy',
      },
      metrics: {
        responseTime: 0,
        errorRate: 0,
        cacheHitRate: 0,
        activeUsers: 0,
        securityViolations: 0,
      },
      alerts: [],
      recommendations: [],
      lastUpdated: new Date(),
    };
  }

  private startHealthMonitoring(): void {
    setInterval(async () => {
      try {
        await this.getSystemHealth();
      } catch (error) {
        this.errorService.logError(error as Error, {
          context: 'SystemHealthService.monitoring',
        });
      }
    }, this.checkInterval);
  }
}
