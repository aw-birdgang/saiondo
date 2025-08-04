import type {AnalyticsReport, UserBehavior, UserEvent} from '../services/AnalyticsService';
import {AnalyticsService} from '../services/AnalyticsService';

export interface TrackEventRequest {
  userId: string;
  eventType: UserEvent['eventType'];
  properties?: Record<string, any>;
  sessionId?: string;
}

export interface StartSessionRequest {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface StartSessionResponse {
  sessionId: string;
}

export interface GenerateReportRequest {
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface AnalyzeUserBehaviorRequest {
  userId: string;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface PredictChurnRequest {
  userId: string;
}

export interface PredictChurnResponse {
  churnProbability: number;
  riskFactors: string[];
  recommendations: string[];
}

export class AnalyticsUseCase {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * 사용자 이벤트 추적
   */
  async trackEvent(request: TrackEventRequest): Promise<void> {
    this.analyticsService.trackEvent(
      request.userId,
      request.eventType,
      request.properties,
      request.sessionId
    );
  }

  /**
   * 사용자 세션 시작
   */
  async startSession(request: StartSessionRequest): Promise<StartSessionResponse> {
    const sessionId = this.analyticsService.startSession(
      request.userId,
      request.userAgent,
      request.ipAddress
    );

    return { sessionId };
  }

  /**
   * 사용자 세션 종료
   */
  async endSession(sessionId: string): Promise<void> {
    this.analyticsService.endSession(sessionId);
  }

  /**
   * 분석 리포트 생성
   */
  async generateReport(request: GenerateReportRequest): Promise<AnalyticsReport> {
    return await this.analyticsService.generateAnalyticsReport(request.timeRange);
  }

  /**
   * 사용자 행동 분석
   */
  async analyzeUserBehavior(request: AnalyzeUserBehaviorRequest): Promise<UserBehavior> {
    return this.analyticsService.analyzeUserBehavior(request.userId, request.timeRange);
  }

  /**
   * 실시간 활동 모니터링
   */
  async getRealTimeActivity(): Promise<{
    activeUsers: number;
    recentEvents: UserEvent[];
    topEvents: Array<{ eventType: string; count: number }>;
  }> {
    return this.analyticsService.getRealTimeActivity();
  }

  /**
   * 사용자 여정 분석
   */
  async analyzeUserJourney(userId: string): Promise<{
    firstEvent: UserEvent | null;
    lastEvent: UserEvent | null;
    totalEvents: number;
    eventSequence: UserEvent['eventType'][];
    conversionPath: string[];
  }> {
    return this.analyticsService.analyzeUserJourney(userId);
  }

  /**
   * 사용자 이탈 예측
   */
  async predictUserChurn(request: PredictChurnRequest): Promise<PredictChurnResponse> {
    return this.analyticsService.predictUserChurn(request.userId);
  }

  /**
   * 데이터 내보내기
   */
  async exportData(format: 'json' | 'csv'): Promise<string> {
    return this.analyticsService.exportData(format);
  }

  /**
   * 페이지 뷰 추적
   */
  async trackPageView(userId: string, page: string, sessionId?: string): Promise<void> {
    await this.trackEvent({
      userId,
      eventType: 'page_view',
      properties: { page },
      sessionId,
    });
  }

  /**
   * 메시지 전송 추적
   */
  async trackMessageSent(userId: string, channelId: string, messageLength: number, sessionId?: string): Promise<void> {
    await this.trackEvent({
      userId,
      eventType: 'message_sent',
      properties: { channelId, messageLength },
      sessionId,
    });
  }

  /**
   * 채널 참여 추적
   */
  async trackChannelJoined(userId: string, channelId: string, sessionId?: string): Promise<void> {
    await this.trackEvent({
      userId,
      eventType: 'channel_joined',
      properties: { channelId },
      sessionId,
    });
  }

  /**
   * 파일 업로드 추적
   */
  async trackFileUploaded(userId: string, fileType: string, fileSize: number, sessionId?: string): Promise<void> {
    await this.trackEvent({
      userId,
      eventType: 'file_uploaded',
      properties: { fileType, fileSize },
      sessionId,
    });
  }

  /**
   * 검색 수행 추적
   */
  async trackSearchPerformed(userId: string, searchTerm: string, resultCount: number, sessionId?: string): Promise<void> {
    await this.trackEvent({
      userId,
      eventType: 'search_performed',
      properties: { searchTerm, resultCount },
      sessionId,
    });
  }

  /**
   * 로그인 추적
   */
  async trackLogin(userId: string, loginMethod: string, sessionId?: string): Promise<void> {
    await this.trackEvent({
      userId,
      eventType: 'login',
      properties: { loginMethod },
      sessionId,
    });
  }

  /**
   * 로그아웃 추적
   */
  async trackLogout(userId: string, sessionDuration: number, sessionId?: string): Promise<void> {
    await this.trackEvent({
      userId,
      eventType: 'logout',
      properties: { sessionDuration },
      sessionId,
    });
  }
}
