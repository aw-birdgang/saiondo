import type { IAnalyticsUseCase } from './interfaces/IAnalyticsUseCase';
import { AnalyticsUseCaseService } from './services/analytics/AnalyticsUseCaseService';
import type {
  TrackEventRequest,
  TrackEventResponse,
  AnalyticsReportRequest,
  AnalyticsReportResponse,
  UserBehaviorRequest,
  UserBehaviorResponse,
  RealTimeActivityRequest,
  RealTimeActivityResponse
} from '../dto/AnalyticsDto';

/**
 * Analytics UseCase 구현체 - UseCase Service를 사용하여 애플리케이션 로직 조율
 * 새로운 UseCase Service 구조를 활용
 */
export class AnalyticsUseCase implements IAnalyticsUseCase {
  constructor(private analyticsUseCaseService: AnalyticsUseCaseService) {}

  /**
   * 이벤트 추적 - UseCase Service 사용
   */
  async trackEvent(
    userId: string, 
    eventType: string, 
    properties?: Record<string, any>, 
    sessionId?: string
  ): Promise<void> {
    const request: TrackEventRequest = {
      userId,
      eventType: eventType as any,
      properties,
      sessionId
    };

    const response: TrackEventResponse = await this.analyticsUseCaseService.trackEvent(request);
    
    if (!response.success) {
      throw new Error('Failed to track event');
    }
  }

  /**
   * 세션 시작 - UseCase Service 사용
   */
  async startSession(userId: string, userAgent?: string, ipAddress?: string): Promise<string> {
    // UseCase Service를 통해 세션 시작
    const request: TrackEventRequest = {
      userId,
      eventType: 'login',
      properties: { userAgent, ipAddress },
      sessionId: this.generateSessionId()
    };

    await this.analyticsUseCaseService.trackEvent(request);
    
    return request.sessionId!;
  }

  /**
   * 세션 종료 - UseCase Service 사용
   */
  async endSession(sessionId: string): Promise<void> {
    // UseCase Service를 통해 세션 종료 이벤트 추적
    const request: TrackEventRequest = {
      userId: 'system', // 세션 종료는 시스템 이벤트
      eventType: 'logout',
      properties: { sessionId },
      sessionId
    };

    await this.analyticsUseCaseService.trackEvent(request);
  }

  /**
   * 분석 리포트 생성 - UseCase Service 사용
   */
  async generateAnalyticsReport(timeRange: { start: Date; end: Date }): Promise<any> {
    const request: AnalyticsReportRequest = {
      timeRange
    };

    const response: AnalyticsReportResponse = await this.analyticsUseCaseService.generateAnalyticsReport(request);
    
    return response.report;
  }

  /**
   * 사용자 행동 분석 - UseCase Service 사용
   */
  async analyzeUserBehavior(userId: string, timeRange: { start: Date; end: Date }): Promise<any> {
    const request: UserBehaviorRequest = {
      userId,
      timeRange
    };

    const response: UserBehaviorResponse = await this.analyticsUseCaseService.analyzeUserBehavior(request);
    
    return response.behavior;
  }

  /**
   * 실시간 활동 조회 - UseCase Service 사용
   */
  async getRealTimeActivity(): Promise<{
    activeUsers: number;
    recentEvents: any[];
    topEvents: Array<{ eventType: string; count: number }>;
  }> {
    const request: RealTimeActivityRequest = {};

    const response: RealTimeActivityResponse = await this.analyticsUseCaseService.getRealTimeActivity(request);
    
    return response.activity;
  }

  /**
   * 사용자 여정 분석 - UseCase Service 사용
   */
  async analyzeUserJourney(userId: string): Promise<{
    firstEvent: any | null;
    lastEvent: any | null;
    totalEvents: number;
    eventSequence: string[];
    conversionPath: string[];
  }> {
    const journey = await this.analyticsUseCaseService.analyzeUserJourney(userId);
    
    return journey.journey;
  }

  /**
   * 사용자 이탈 예측 - UseCase Service 사용
   */
  async predictUserChurn(userId: string): Promise<{
    churnProbability: number;
    riskFactors: string[];
    recommendations: string[];
  }> {
    const prediction = await this.analyticsUseCaseService.predictUserChurn(userId);
    
    return prediction.prediction;
  }

  /**
   * 데이터 내보내기 - UseCase Service 사용
   */
  async exportData(format: 'json' | 'csv'): Promise<string> {
    return await this.analyticsUseCaseService.exportData(format);
  }

  // 특화된 이벤트 추적 메서드들 - UseCase Service 활용

  /**
   * 페이지 뷰 추적
   */
  async trackPageView(userId: string, page: string, sessionId?: string): Promise<void> {
    const request: TrackEventRequest = {
      userId,
      eventType: 'page_view',
      properties: { page },
      sessionId
    };

    await this.analyticsUseCaseService.trackEvent(request);
  }

  /**
   * 메시지 전송 추적
   */
  async trackMessageSent(userId: string, channelId: string, messageLength: number, sessionId?: string): Promise<void> {
    const request: TrackEventRequest = {
      userId,
      eventType: 'message_sent',
      properties: { channelId, messageLength },
      sessionId
    };

    await this.analyticsUseCaseService.trackEvent(request);
  }

  /**
   * 채널 참여 추적
   */
  async trackChannelJoined(userId: string, channelId: string, sessionId?: string): Promise<void> {
    const request: TrackEventRequest = {
      userId,
      eventType: 'channel_joined',
      properties: { channelId },
      sessionId
    };

    await this.analyticsUseCaseService.trackEvent(request);
  }

  /**
   * 파일 업로드 추적
   */
  async trackFileUploaded(userId: string, fileType: string, fileSize: number, sessionId?: string): Promise<void> {
    const request: TrackEventRequest = {
      userId,
      eventType: 'file_uploaded',
      properties: { fileType, fileSize },
      sessionId
    };

    await this.analyticsUseCaseService.trackEvent(request);
  }

  /**
   * 검색 수행 추적
   */
  async trackSearchPerformed(userId: string, searchTerm: string, resultCount: number, sessionId?: string): Promise<void> {
    const request: TrackEventRequest = {
      userId,
      eventType: 'search_performed',
      properties: { searchTerm, resultCount },
      sessionId
    };

    await this.analyticsUseCaseService.trackEvent(request);
  }

  /**
   * 로그인 추적
   */
  async trackLogin(userId: string, loginMethod: string, sessionId?: string): Promise<void> {
    const request: TrackEventRequest = {
      userId,
      eventType: 'login',
      properties: { loginMethod },
      sessionId
    };

    await this.analyticsUseCaseService.trackEvent(request);
  }

  /**
   * 로그아웃 추적
   */
  async trackLogout(userId: string, sessionDuration: number, sessionId?: string): Promise<void> {
    const request: TrackEventRequest = {
      userId,
      eventType: 'logout',
      properties: { sessionDuration },
      sessionId
    };

    await this.analyticsUseCaseService.trackEvent(request);
  }

  /**
   * 사용자 캐시 무효화
   */
  async invalidateUserCache(userId: string): Promise<void> {
    await this.analyticsUseCaseService.invalidateUserCache(userId);
  }

  /**
   * 캐시 통계 조회
   */
  async getCacheStats(): Promise<any> {
    return await this.analyticsUseCaseService.getAnalyticsCacheStats();
  }

  // Private helper methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
