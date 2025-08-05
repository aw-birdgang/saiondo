import type { AnalyticsReport, UserBehavior, UserEvent } from '../interfaces/IAnalyticsRepository';
import type { IAnalyticsRepository } from '../interfaces/IAnalyticsRepository';
import type { IAnalyticsService } from '../interfaces/IAnalyticsService';
import type { ICache } from '../interfaces/ICache';
import { ANALYTICS_ERROR_MESSAGES, ANALYTICS_CACHE_TTL, ANALYTICS_LIMITS, ANALYTICS_WEIGHTS } from '../constants/AnalyticsConstants';
import { MemoryCache } from '../cache/MemoryCache';

// Analytics Service 구현체
export class AnalyticsService implements IAnalyticsService {
  private cache: ICache;

  constructor(
    private analyticsRepository: IAnalyticsRepository,
    cache?: ICache
  ) {
    this.cache = cache || new MemoryCache();
  }

  async trackEvent(userId: string, eventType: string, properties?: Record<string, any>, sessionId?: string): Promise<void> {
    try {
      // 이벤트 데이터 유효성 검사
      if (!this.validateEventData(userId, eventType, properties)) {
        throw new Error(ANALYTICS_ERROR_MESSAGES.VALIDATION.USER_ID_REQUIRED);
      }

      // 이벤트 속성 처리
      const processedProperties = this.processEventProperties(properties);

      await this.analyticsRepository.trackEvent(userId, eventType, processedProperties, sessionId);
    } catch (error) {
      console.error('Failed to track event:', error);
      throw new Error(ANALYTICS_ERROR_MESSAGES.OPERATION.TRACK_EVENT_FAILED);
    }
  }

  async startSession(userId: string, userAgent?: string, ipAddress?: string): Promise<string> {
    try {
      if (!userId) {
        throw new Error(ANALYTICS_ERROR_MESSAGES.VALIDATION.USER_ID_REQUIRED);
      }

      const sessionId = await this.analyticsRepository.startSession(userId, userAgent, ipAddress);
      return sessionId;
    } catch (error) {
      console.error('Failed to start session:', error);
      throw new Error(ANALYTICS_ERROR_MESSAGES.OPERATION.START_SESSION_FAILED);
    }
  }

  async endSession(sessionId: string): Promise<void> {
    try {
      if (!sessionId) {
        throw new Error(ANALYTICS_ERROR_MESSAGES.VALIDATION.SESSION_ID_INVALID);
      }

      await this.analyticsRepository.endSession(sessionId);
    } catch (error) {
      console.error('Failed to end session:', error);
      throw new Error(ANALYTICS_ERROR_MESSAGES.OPERATION.END_SESSION_FAILED);
    }
  }

  async generateAnalyticsReport(timeRange: { start: Date; end: Date }): Promise<AnalyticsReport> {
    try {
      // 캐시 확인
      const cacheKey = `analytics_report:${timeRange.start.getTime()}:${timeRange.end.getTime()}`;
      const cached = this.cache.get<AnalyticsReport>(cacheKey);
      if (cached) {
        return cached;
      }

      const report = await this.analyticsRepository.generateAnalyticsReport(timeRange);
      
      // 캐시 저장
      this.cache.set(cacheKey, report, ANALYTICS_CACHE_TTL.ANALYTICS_REPORT);
      
      return report;
    } catch (error) {
      console.error('Failed to generate analytics report:', error);
      throw new Error(ANALYTICS_ERROR_MESSAGES.OPERATION.GENERATE_REPORT_FAILED);
    }
  }

  async analyzeUserBehavior(userId: string, timeRange: { start: Date; end: Date }): Promise<UserBehavior> {
    try {
      // 캐시 확인
      const cacheKey = `user_behavior:${userId}:${timeRange.start.getTime()}:${timeRange.end.getTime()}`;
      const cached = this.cache.get<UserBehavior>(cacheKey);
      if (cached) {
        return cached;
      }

      const behavior = await this.analyticsRepository.analyzeUserBehavior(userId, timeRange);
      
      // 캐시 저장
      this.cache.set(cacheKey, behavior, ANALYTICS_CACHE_TTL.USER_BEHAVIOR);
      
      return behavior;
    } catch (error) {
      console.error('Failed to analyze user behavior:', error);
      throw new Error(ANALYTICS_ERROR_MESSAGES.OPERATION.ANALYZE_BEHAVIOR_FAILED);
    }
  }

  async getRealTimeActivity(): Promise<{
    activeUsers: number;
    recentEvents: UserEvent[];
    topEvents: Array<{ eventType: string; count: number }>;
  }> {
    try {
      // 캐시 확인
      const cacheKey = 'real_time_activity';
      const cached = this.cache.get<{
        activeUsers: number;
        recentEvents: UserEvent[];
        topEvents: Array<{ eventType: string; count: number }>;
      }>(cacheKey);
      if (cached) {
        return cached;
      }

      const activity = await this.analyticsRepository.getRealTimeActivity();
      
      // 캐시 저장
      this.cache.set(cacheKey, activity, ANALYTICS_CACHE_TTL.REAL_TIME_ACTIVITY);
      
      return activity;
    } catch (error) {
      console.error('Failed to get real time activity:', error);
      return {
        activeUsers: 0,
        recentEvents: [],
        topEvents: []
      };
    }
  }

  async analyzeUserJourney(userId: string): Promise<{
    firstEvent: UserEvent | null;
    lastEvent: UserEvent | null;
    totalEvents: number;
    eventSequence: UserEvent['eventType'][];
    conversionPath: string[];
  }> {
    try {
      // 캐시 확인
      const cacheKey = `user_journey:${userId}`;
      const cached = this.cache.get<{
        firstEvent: UserEvent | null;
        lastEvent: UserEvent | null;
        totalEvents: number;
        eventSequence: UserEvent['eventType'][];
        conversionPath: string[];
      }>(cacheKey);
      if (cached) {
        return cached;
      }

      const journey = await this.analyticsRepository.analyzeUserJourney(userId);
      
      // 캐시 저장
      this.cache.set(cacheKey, journey, ANALYTICS_CACHE_TTL.USER_JOURNEY);
      
      return journey;
    } catch (error) {
      console.error('Failed to analyze user journey:', error);
      return {
        firstEvent: null,
        lastEvent: null,
        totalEvents: 0,
        eventSequence: [],
        conversionPath: []
      };
    }
  }

  async predictUserChurn(userId: string): Promise<{
    churnProbability: number;
    riskFactors: string[];
    recommendations: string[];
  }> {
    try {
      // 캐시 확인
      const cacheKey = `churn_prediction:${userId}`;
      const cached = this.cache.get<{
        churnProbability: number;
        riskFactors: string[];
        recommendations: string[];
      }>(cacheKey);
      if (cached) {
        return cached;
      }

      const prediction = await this.analyticsRepository.predictUserChurn(userId);
      
      // 캐시 저장
      this.cache.set(cacheKey, prediction, ANALYTICS_CACHE_TTL.CHURN_PREDICTION);
      
      return prediction;
    } catch (error) {
      console.error('Failed to predict user churn:', error);
      throw new Error(ANALYTICS_ERROR_MESSAGES.OPERATION.PREDICT_CHURN_FAILED);
    }
  }

  async exportData(format: 'json' | 'csv'): Promise<string> {
    try {
      return await this.analyticsRepository.exportData(format);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error(ANALYTICS_ERROR_MESSAGES.OPERATION.EXPORT_DATA_FAILED);
    }
  }

  async getEventHistory(userId: string, limit?: number): Promise<UserEvent[]> {
    try {
      return await this.analyticsRepository.getEventHistory(userId, limit);
    } catch (error) {
      console.error('Failed to get event history:', error);
      return [];
    }
  }

  async getSessionData(sessionId: string): Promise<any> {
    try {
      return await this.analyticsRepository.getSessionData(sessionId);
    } catch (error) {
      console.error('Failed to get session data:', error);
      return null;
    }
  }

  validateEventData(userId: string, eventType: string, properties?: Record<string, any>): boolean {
    if (!userId || userId.length > ANALYTICS_LIMITS.MAX_USER_ID_LENGTH) {
      return false;
    }

    if (!eventType || eventType.length > ANALYTICS_LIMITS.MAX_EVENT_TYPE_LENGTH) {
      return false;
    }

    if (properties && Object.keys(properties).length > ANALYTICS_LIMITS.MAX_EVENT_PROPERTIES) {
      return false;
    }

    return true;
  }

  async calculateEngagementScore(userId: string): Promise<number> {
    try {
      const events = await this.getEventHistory(userId, 100);
      let score = 0;

      events.forEach(event => {
        const eventAge = Date.now() - event.timestamp.getTime();
        const daysSinceEvent = eventAge / (1000 * 60 * 60 * 24);

        if (daysSinceEvent <= 1) {
          score += ANALYTICS_WEIGHTS.RECENT_EVENT;
        } else if (daysSinceEvent <= 7) {
          score += ANALYTICS_WEIGHTS.USER_ENGAGEMENT;
        } else {
          score += ANALYTICS_WEIGHTS.OLD_EVENT;
        }

        // 특정 이벤트 타입에 대한 가중치
        if (event.eventType === 'login' || event.eventType === 'message_sent') {
          score += ANALYTICS_WEIGHTS.CRITICAL_EVENT;
        }
      });

      return Math.min(score, 100); // 최대 100점
    } catch (error) {
      console.error('Failed to calculate engagement score:', error);
      return 0;
    }
  }

  processEventProperties(properties?: Record<string, any>): Record<string, any> {
    if (!properties) {
      return {};
    }

    const processed: Record<string, any> = {};

    Object.entries(properties).forEach(([key, value]) => {
      // 키 길이 제한
      if (key.length <= ANALYTICS_LIMITS.MAX_PROPERTY_KEY_LENGTH) {
        // 값 길이 제한
        if (typeof value === 'string' && value.length <= ANALYTICS_LIMITS.MAX_PROPERTY_VALUE_LENGTH) {
          processed[key] = value;
        } else if (typeof value !== 'string') {
          processed[key] = value;
        }
      }
    });

    return processed;
  }
} 