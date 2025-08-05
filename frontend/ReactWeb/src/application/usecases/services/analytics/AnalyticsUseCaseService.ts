import type { ILogger } from '../../../../domain/interfaces/ILogger';
import { BaseCacheService, type ICache } from '../../../services/base/BaseCacheService';
import { AnalyticsService } from '../../../services/analytics/AnalyticsService';
import type {
  TrackEventRequest,
  TrackEventResponse,
  AnalyticsReportRequest,
  AnalyticsReportResponse,
  UserBehaviorRequest,
  UserBehaviorResponse,
  RealTimeActivityRequest,
  RealTimeActivityResponse
} from '../../../dto/AnalyticsDto';

/**
 * Analytics UseCase Service - UseCase별 특화된 분석 로직
 * BaseCacheService를 상속받아 캐싱 기능 활용
 */
export class AnalyticsUseCaseService extends BaseCacheService {
  constructor(
    private readonly analyticsService: AnalyticsService,
    cache?: ICache,
    logger?: ILogger
  ) {
    super(cache, logger);
  }

  /**
   * 이벤트 추적 - UseCase 특화 로직
   */
  async trackEvent(request: TrackEventRequest): Promise<TrackEventResponse> {
    try {
      // 입력 검증
      this.validateEventRequest(request);
      
      // 캐싱 로직
      const cacheKey = this.generateCacheKey('event', request.userId, request.eventType);
      
      // Base Service 사용
      await this.analyticsService.trackEvent(
        request.userId,
        request.eventType,
        request.properties,
        request.sessionId
      );
      
      const response: TrackEventResponse = {
        success: true,
        eventId: this.generateEventId(),
        timestamp: new Date(),
        cacheKey
      };

      // 이벤트 관련 캐시 무효화
      this.invalidateCachePattern(`user_behavior:${request.userId}`);
      this.invalidateCachePattern(`real_time_activity`);
      
      return response;
    } catch (error) {
      this.logger?.error('Failed to track event', { 
        request, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to track event: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 분석 리포트 생성 - UseCase 특화 로직
   */
  async generateAnalyticsReport(request: AnalyticsReportRequest): Promise<AnalyticsReportResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey(
        'analytics_report', 
        request.timeRange.start.getTime(), 
        request.timeRange.end.getTime()
      );
      
      const cached = await this.getCached<AnalyticsReportResponse>(cacheKey, this.calculateTTL('analytics_report'));
      if (cached) {
        this.logger?.debug('Returning cached analytics report', { cacheKey });
        return cached;
      }

      // Base Service 사용
      const report = await this.analyticsService.generateAnalyticsReport(request.timeRange);
      
      const response: AnalyticsReportResponse = {
        report,
        generatedAt: new Date(),
        cacheKey,
        timeRange: request.timeRange
      };
      
      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('analytics_report'));
      
      return response;
    } catch (error) {
      this.logger?.error('Failed to generate analytics report', { 
        request, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to generate report: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 사용자 행동 분석 - UseCase 특화 로직
   */
  async analyzeUserBehavior(request: UserBehaviorRequest): Promise<UserBehaviorResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey(
        'user_behavior', 
        request.userId, 
        request.timeRange.start.getTime(), 
        request.timeRange.end.getTime()
      );
      
      const cached = await this.getCached<UserBehaviorResponse>(cacheKey, this.calculateTTL('user_profile'));
      if (cached) {
        this.logger?.debug('Returning cached user behavior', { cacheKey });
        return cached;
      }

      // Base Service 사용
      const behavior = await this.analyticsService.analyzeUserBehavior(request.userId, request.timeRange);
      
      const response: UserBehaviorResponse = {
        behavior,
        analyzedAt: new Date(),
        cacheKey,
        userId: request.userId,
        timeRange: request.timeRange
      };
      
      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('user_profile'));
      
      return response;
    } catch (error) {
      this.logger?.error('Failed to analyze user behavior', { 
        request, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to analyze user behavior: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 실시간 활동 조회 - UseCase 특화 로직
   */
  async getRealTimeActivity(request: RealTimeActivityRequest): Promise<RealTimeActivityResponse> {
    try {
      // 실시간 데이터는 짧은 TTL로 캐싱
      const cacheKey = this.generateCacheKey('real_time_activity', Date.now());
      
      const cached = await this.getCached<RealTimeActivityResponse>(cacheKey, 60); // 1분 캐시
      if (cached) {
        this.logger?.debug('Returning cached real-time activity', { cacheKey });
        return cached;
      }

      // Base Service 사용
      const activity = await this.analyticsService.getRealTimeActivity();
      
      const response: RealTimeActivityResponse = {
        activity,
        fetchedAt: new Date(),
        cacheKey,
        ttl: 60
      };
      
      // 캐시 저장
      await this.setCached(cacheKey, response, 60);
      
      return response;
    } catch (error) {
      this.logger?.error('Failed to get real-time activity', { 
        request, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to get real-time activity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 사용자 여정 분석 - UseCase 특화 로직
   */
  async analyzeUserJourney(userId: string): Promise<any> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('user_journey', userId);
      
      const cached = await this.getCached<any>(cacheKey, this.calculateTTL('user_profile'));
      if (cached) {
        return cached;
      }

      // Base Service 사용
      const journey = await this.analyticsService.analyzeUserJourney(userId);
      
      const response = {
        journey,
        analyzedAt: new Date(),
        cacheKey,
        userId
      };
      
      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('user_profile'));
      
      return response;
    } catch (error) {
      this.logger?.error('Failed to analyze user journey', { 
        userId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to analyze user journey: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 사용자 이탈 예측 - UseCase 특화 로직
   */
  async predictUserChurn(userId: string): Promise<any> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('churn_prediction', userId);
      
      const cached = await this.getCached<any>(cacheKey, this.calculateTTL('user_profile'));
      if (cached) {
        return cached;
      }

      // Base Service 사용
      const prediction = await this.analyticsService.predictUserChurn(userId);
      
      const response = {
        prediction,
        predictedAt: new Date(),
        cacheKey,
        userId
      };
      
      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('user_profile'));
      
      return response;
    } catch (error) {
      this.logger?.error('Failed to predict user churn', { 
        userId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to predict user churn: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 데이터 내보내기 - UseCase 특화 로직
   */
  async exportData(format: 'json' | 'csv'): Promise<string> {
    try {
      // 내보내기는 캐싱하지 않음 (항상 최신 데이터)
      const exportedData = await this.analyticsService.exportData(format);
      
      this.logger?.info('Data exported successfully', { format, dataSize: exportedData.length });
      
      return exportedData;
    } catch (error) {
      this.logger?.error('Failed to export data', { 
        format, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new Error(`Failed to export data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 캐시 무효화 - 특정 사용자 관련 캐시
   */
  async invalidateUserCache(userId: string): Promise<void> {
    try {
      this.invalidateCachePattern(`user_behavior:${userId}`);
      this.invalidateCachePattern(`user_journey:${userId}`);
      this.invalidateCachePattern(`churn_prediction:${userId}`);
      
      this.logger?.info('User cache invalidated', { userId });
    } catch (error) {
      this.logger?.error('Failed to invalidate user cache', { 
        userId, 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  }

  /**
   * 캐시 통계 조회
   */
  async getAnalyticsCacheStats(): Promise<any> {
    try {
      const stats = this.getCacheStats();
      
      return {
        ...stats,
        timestamp: new Date(),
        service: 'AnalyticsUseCaseService'
      };
    } catch (error) {
      this.logger?.error('Failed to get cache stats', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  // Private helper methods
  private validateEventRequest(request: TrackEventRequest): void {
    if (!request.userId) {
      throw new Error('User ID is required');
    }
    if (!request.eventType) {
      throw new Error('Event type is required');
    }
    if (request.properties && typeof request.properties !== 'object') {
      throw new Error('Properties must be an object');
    }
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 