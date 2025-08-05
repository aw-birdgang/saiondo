import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import type { ILogger } from '../../../domain/interfaces/ILogger';
import { BaseService } from '../base/BaseService';
import type {
  UserEvent,
  UserSession,
  AnalyticsReport,
  UserBehavior,
  RealTimeActivity,
  UserJourney,
  ChurnPrediction
} from '../../dto/AnalyticsDto';

/**
 * Analytics Repository 인터페이스
 */
export interface IAnalyticsRepository {
  trackEvent(userId: string, eventType: string, properties?: Record<string, any>, sessionId?: string): Promise<void>;
  startSession(userId: string, userAgent?: string, ipAddress?: string): Promise<string>;
  endSession(sessionId: string): Promise<void>;
  generateAnalyticsReport(timeRange: { start: Date; end: Date }): Promise<AnalyticsReport>;
  analyzeUserBehavior(userId: string, timeRange: { start: Date; end: Date }): Promise<UserBehavior>;
  getRealTimeActivity(): Promise<RealTimeActivity>;
  analyzeUserJourney(userId: string): Promise<UserJourney>;
  predictUserChurn(userId: string): Promise<ChurnPrediction>;
  exportData(format: 'json' | 'csv'): Promise<string>;
}

/**
 * Analytics Service - 핵심 분석 로직
 * BaseService를 상속받아 공통 기능 활용
 */
export class AnalyticsService extends BaseService<IAnalyticsRepository> {
  protected repository: IAnalyticsRepository;
  private userEvents: UserEvent[] = [];
  private userSessions: UserSession[] = [];
  private readonly maxEvents = 50000;
  private readonly maxSessions = 10000;

  constructor(
    analyticsRepository: IAnalyticsRepository,
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    logger?: ILogger
  ) {
    super(logger);
    this.repository = analyticsRepository;
  }

  /**
   * 사용자 이벤트 기록 - 핵심 로직
   */
  async trackEvent(
    userId: string,
    eventType: UserEvent['eventType'],
    properties?: Record<string, any>,
    sessionId?: string
  ): Promise<void> {
    return this.measurePerformance('track_event', async () => {
      // 기본 검증
      if (!userId || !eventType) {
        throw new Error('User ID and event type are required');
      }

      const event: UserEvent = {
        id: this.generateEventId(),
        userId,
        eventType,
        timestamp: new Date(),
        properties,
        sessionId,
      };

      // 메모리 이벤트 저장 (실시간 분석용)
      this.userEvents.push(event);
      if (this.userEvents.length > this.maxEvents) {
        this.userEvents = this.userEvents.slice(-this.maxEvents);
      }

      // Repository를 통한 영구 저장
      await this.repository.trackEvent(userId, eventType, properties, sessionId);

      // 세션 업데이트
      this.updateSession(userId, event, sessionId);
    }, { userId, eventType, sessionId });
  }

  /**
   * 세션 시작 - 핵심 로직
   */
  async startSession(userId: string, userAgent?: string, ipAddress?: string): Promise<string> {
    return this.measurePerformance('start_session', async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const sessionId = this.generateSessionId();
      const session: UserSession = {
        id: sessionId,
        userId,
        startTime: new Date(),
        events: [],
        userAgent,
        ipAddress,
      };

      // 메모리 세션 저장
      this.userSessions.push(session);
      if (this.userSessions.length > this.maxSessions) {
        this.userSessions = this.userSessions.slice(-this.maxSessions);
      }

      // Repository를 통한 영구 저장
      await this.repository.startSession(userId, userAgent, ipAddress);

      return sessionId;
    }, { userId });
  }

  /**
   * 세션 종료 - 핵심 로직
   */
  async endSession(sessionId: string): Promise<void> {
    return this.measurePerformance('end_session', async () => {
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      // 메모리 세션 업데이트
      const session = this.userSessions.find(s => s.id === sessionId);
      if (session) {
        session.endTime = new Date();
        session.duration = session.endTime.getTime() - session.startTime.getTime();
      }

      // Repository를 통한 영구 저장
      await this.repository.endSession(sessionId);
    }, { sessionId });
  }

  /**
   * 분석 리포트 생성 - 핵심 로직
   */
  async generateAnalyticsReport(timeRange: { start: Date; end: Date }): Promise<AnalyticsReport> {
    return this.measurePerformance('generate_analytics_report', async () => {
      // 기본 검증
      if (!timeRange.start || !timeRange.end || timeRange.start >= timeRange.end) {
        throw new Error('Invalid time range');
      }

      // Repository를 통한 리포트 생성
      const report = await this.repository.generateAnalyticsReport(timeRange);

      // 메모리 데이터와 결합하여 실시간 정보 추가
      const realTimeData = this.getRealTimeDataFromMemory(timeRange);
      report.realTimeData = realTimeData;

      return report;
    }, { timeRange });
  }

  /**
   * 사용자 행동 분석 - 핵심 로직
   */
  async analyzeUserBehavior(userId: string, timeRange: { start: Date; end: Date }): Promise<UserBehavior> {
    return this.measurePerformance('analyze_user_behavior', async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Repository를 통한 기본 분석
      const behavior = await this.repository.analyzeUserBehavior(userId, timeRange);

      // 메모리 데이터를 통한 실시간 행동 패턴 분석
      const realTimePatterns = this.analyzeRealTimeBehavior(userId, timeRange);
      behavior.realTimePatterns = realTimePatterns;

      return behavior;
    }, { userId, timeRange });
  }

  /**
   * 실시간 활동 조회 - 핵심 로직
   */
  async getRealTimeActivity(): Promise<RealTimeActivity> {
    return this.measurePerformance('get_real_time_activity', async () => {
      // Repository를 통한 기본 실시간 데이터
      const activity = await this.repository.getRealTimeActivity();

      // 메모리 데이터를 통한 추가 실시간 정보
      const memoryActivity = this.getMemoryRealTimeActivity();
      activity.activeUsers = memoryActivity.activeUsers;
      activity.recentEvents = memoryActivity.recentEvents;

      return activity;
    });
  }

  /**
   * 사용자 여정 분석 - 핵심 로직
   */
  async analyzeUserJourney(userId: string): Promise<UserJourney> {
    return this.measurePerformance('analyze_user_journey', async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Repository를 통한 기본 여정 분석
      const journey = await this.repository.analyzeUserJourney(userId);

      // 메모리 데이터를 통한 실시간 여정 정보 추가
      const realTimeJourney = this.analyzeRealTimeJourney(userId);
      journey.currentSession = realTimeJourney.currentSession;
      journey.recentEvents = realTimeJourney.recentEvents;

      return journey;
    }, { userId });
  }

  /**
   * 사용자 이탈 예측 - 핵심 로직
   */
  async predictUserChurn(userId: string): Promise<ChurnPrediction> {
    return this.measurePerformance('predict_user_churn', async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Repository를 통한 기본 예측
      const prediction = await this.repository.predictUserChurn(userId);

      // 메모리 데이터를 통한 실시간 위험도 평가
      const realTimeRisk = this.calculateRealTimeChurnRisk(userId);
      prediction.realTimeRiskFactors = realTimeRisk.riskFactors;
      prediction.realTimeProbability = realTimeRisk.probability;

      return prediction;
    }, { userId });
  }

  /**
   * 데이터 내보내기 - 핵심 로직
   */
  async exportData(format: 'json' | 'csv'): Promise<string> {
    return this.measurePerformance('export_data', async () => {
      // Repository를 통한 기본 내보내기
      const exportedData = await this.repository.exportData(format);

      // 메모리 데이터 추가
      if (format === 'json') {
        const memoryData = {
          realTimeEvents: this.userEvents,
          realTimeSessions: this.userSessions
        };
        return JSON.stringify({ ...JSON.parse(exportedData), memoryData }, null, 2);
      }

      return exportedData;
    }, { format });
  }

  // UseCase Service에서 사용할 수 있는 기본 메서드들
  async getBasicUserBehavior(userId: string, timeRange: { start: Date; end: Date }): Promise<UserBehavior> {
    return await this.repository.analyzeUserBehavior(userId, timeRange);
  }

  async getBasicAnalyticsReport(timeRange: { start: Date; end: Date }): Promise<AnalyticsReport> {
    return await this.repository.generateAnalyticsReport(timeRange);
  }

  // Private helper methods
  private updateSession(userId: string, event: UserEvent, sessionId?: string): void {
    if (sessionId) {
      const session = this.userSessions.find(s => s.id === sessionId);
      if (session) {
        session.events.push(event);
      }
    }
  }

  private getRealTimeDataFromMemory(timeRange: { start: Date; end: Date }) {
    const filteredEvents = this.userEvents.filter(
      event => event.timestamp >= timeRange.start && event.timestamp <= timeRange.end
    );
    
    return {
      eventCount: filteredEvents.length,
      uniqueUsers: new Set(filteredEvents.map(e => e.userId)).size,
      topEventTypes: this.getTopEventTypes(filteredEvents)
    };
  }

  private analyzeRealTimeBehavior(userId: string, timeRange: { start: Date; end: Date }) {
    const userEvents = this.userEvents.filter(
      event => event.userId === userId && 
      event.timestamp >= timeRange.start && 
      event.timestamp <= timeRange.end
    );

    return {
      eventCount: userEvents.length,
      lastActivity: userEvents.length > 0 ? userEvents[userEvents.length - 1].timestamp : null,
      activityPattern: this.analyzeActivityPattern(userEvents)
    };
  }

  private getMemoryRealTimeActivity(): RealTimeActivity {
    const now = new Date();
    const recentEvents = this.userEvents.filter(
      event => now.getTime() - event.timestamp.getTime() < 5 * 60 * 1000 // 5분 이내
    );

    return {
      activeUsers: new Set(recentEvents.map(e => e.userId)).size,
      recentEvents: recentEvents.slice(-10), // 최근 10개 이벤트
      topEvents: this.getTopEventTypes(recentEvents)
    };
  }

  private analyzeRealTimeJourney(userId: string) {
    const userEvents = this.userEvents.filter(event => event.userId === userId);
    const currentSession = this.userSessions.find(s => s.userId === userId && !s.endTime);

    return {
      currentSession,
      recentEvents: userEvents.slice(-5) // 최근 5개 이벤트
    };
  }

  private calculateRealTimeChurnRisk(userId: string) {
    const userEvents = this.userEvents.filter(event => event.userId === userId);
    const now = new Date();
    const lastActivity = userEvents.length > 0 ? userEvents[userEvents.length - 1].timestamp : null;
    
    let probability = 0;
    const riskFactors: string[] = [];

    if (lastActivity) {
      const daysSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLastActivity > 7) {
        probability += 0.3;
        riskFactors.push('No activity for more than 7 days');
      }
      if (daysSinceLastActivity > 14) {
        probability += 0.4;
        riskFactors.push('No activity for more than 14 days');
      }
    }

    if (userEvents.length < 5) {
      probability += 0.2;
      riskFactors.push('Low engagement (less than 5 events)');
    }

    return { probability: Math.min(probability, 1), riskFactors };
  }

  private getTopEventTypes(events: UserEvent[]): Array<{ eventType: string; count: number }> {
    const eventCounts = events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(eventCounts)
      .map(([eventType, count]) => ({ eventType, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private analyzeActivityPattern(events: UserEvent[]): string {
    if (events.length === 0) return 'no_activity';
    if (events.length < 3) return 'low_activity';
    if (events.length < 10) return 'moderate_activity';
    return 'high_activity';
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 