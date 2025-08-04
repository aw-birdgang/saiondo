import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type {
  UserEvent,
  UserSession,
  AnalyticsReport,
  UserBehavior,
  RealTimeActivity,
  UserJourney,
  ChurnPrediction
} from '../dto/AnalyticsDto';

export class AnalyticsService {
  private userEvents: UserEvent[] = [];
  private userSessions: UserSession[] = [];
  private readonly maxEvents = 50000;
  private readonly maxSessions = 10000;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository
  ) {}

  /**
   * 사용자 이벤트 기록
   */
  trackEvent(
    userId: string,
    eventType: UserEvent['eventType'],
    properties?: Record<string, any>,
    sessionId?: string
  ): void {
    const event: UserEvent = {
      id: this.generateEventId(),
      userId,
      eventType,
      timestamp: new Date(),
      properties,
      sessionId,
    };

    this.userEvents.push(event);

    // 최대 개수 제한
    if (this.userEvents.length > this.maxEvents) {
      this.userEvents = this.userEvents.slice(-this.maxEvents);
    }

    // 세션 업데이트
    this.updateSession(userId, event, sessionId);
  }

  /**
   * 세션 시작
   */
  startSession(userId: string, userAgent?: string, ipAddress?: string): string {
    const sessionId = this.generateSessionId();
    const session: UserSession = {
      id: sessionId,
      userId,
      startTime: new Date(),
      events: [],
      userAgent,
      ipAddress,
    };

    this.userSessions.push(session);

    // 최대 개수 제한
    if (this.userSessions.length > this.maxSessions) {
      this.userSessions = this.userSessions.slice(-this.maxSessions);
    }

    return sessionId;
  }

  /**
   * 세션 종료
   */
  endSession(sessionId: string): void {
    const session = this.userSessions.find(s => s.id === sessionId);
    if (session) {
      session.endTime = new Date();
      session.duration = session.endTime.getTime() - session.startTime.getTime();
    }
  }

  /**
   * 분석 리포트 생성
   */
  async generateAnalyticsReport(timeRange: { start: Date; end: Date }): Promise<AnalyticsReport> {
    const filteredEvents = this.userEvents.filter(
      event => event.timestamp >= timeRange.start && event.timestamp <= timeRange.end
    );

    const filteredSessions = this.userSessions.filter(
      session => session.startTime >= timeRange.start && session.startTime <= timeRange.end
    );

    // 이벤트 타입별 통계
    const eventsByType: Record<string, number> = {};
    filteredEvents.forEach(event => {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
    });

    // 활성 사용자 수 (세션이 있는 사용자)
    const activeUserIds = new Set(filteredSessions.map(s => s.userId));
    const activeUsers = activeUserIds.size;

    // 평균 세션 시간
    const completedSessions = filteredSessions.filter(s => s.duration !== undefined);
    const averageSessionDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length
      : 0;

    // 채널별 통계
    const channelStats = await this.getChannelStatistics(timeRange);

    // 사용자 참여도
    const userEngagement = await this.calculateUserEngagement(timeRange);

    return {
      totalUsers: await this.getTotalUsers(),
      activeUsers,
      totalSessions: filteredSessions.length,
      averageSessionDuration,
      eventsByType,
      topChannels: channelStats,
      userEngagement,
      timeRange,
    };
  }

  /**
   * 사용자 행동 분석
   */
  analyzeUserBehavior(userId: string, timeRange: { start: Date; end: Date }): UserBehavior {
    const userEvents = this.userEvents.filter(
      event => event.userId === userId && 
      event.timestamp >= timeRange.start && 
      event.timestamp <= timeRange.end
    );

    const userSessions = this.userSessions.filter(
      session => session.userId === userId &&
      session.startTime >= timeRange.start &&
      session.startTime <= timeRange.end
    );

    // 활동 패턴 분석
    const activityPattern = this.analyzeActivityPattern(userEvents);

    // 선호 채널 분석
    const favoriteChannels = this.getFavoriteChannels(userEvents);

    // 참여도 점수 계산
    const engagementScore = this.calculateEngagementScore(userEvents, userSessions);

    return {
      userId,
      totalSessions: userSessions.length,
      averageSessionDuration: this.calculateAverageSessionDuration(userSessions),
      favoriteChannels,
      activityPattern,
      engagementScore,
    };
  }

  /**
   * 실시간 사용자 활동 모니터링
   */
  getRealTimeActivity(): RealTimeActivity {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const recentEvents = this.userEvents.filter(
      event => event.timestamp >= fiveMinutesAgo
    );

    const activeUserIds = new Set(recentEvents.map(e => e.userId));
    const activeUsers = activeUserIds.size;

    // 최근 이벤트 타입별 통계
    const eventCounts: Record<string, number> = {};
    recentEvents.forEach(event => {
      eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1;
    });

    const topEvents = Object.entries(eventCounts)
      .map(([eventType, count]) => ({ eventType, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      activeUsers,
      recentEvents: recentEvents.slice(-10), // 최근 10개 이벤트
      topEvents,
    };
  }

  /**
   * 사용자 여정 분석
   */
  analyzeUserJourney(userId: string): UserJourney {
    const userEvents = this.userEvents
      .filter(event => event.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (userEvents.length === 0) {
      return {
        firstEvent: null,
        lastEvent: null,
        totalEvents: 0,
        eventSequence: [],
        conversionPath: [],
      };
    }

    const eventSequence = userEvents.map(e => e.eventType);
    const conversionPath = this.identifyConversionPath(eventSequence);

    return {
      firstEvent: userEvents[0],
      lastEvent: userEvents[userEvents.length - 1],
      totalEvents: userEvents.length,
      eventSequence,
      conversionPath,
    };
  }

  /**
   * 예측 분석
   */
  predictUserChurn(userId: string): ChurnPrediction {
    const userBehavior = this.analyzeUserBehavior(userId, {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일
      end: new Date(),
    });

    const riskFactors: string[] = [];
    let churnProbability = 0;

    // 참여도 점수 기반 위험도 계산
    if (userBehavior.engagementScore < 0.3) {
      churnProbability += 0.4;
      riskFactors.push('낮은 참여도');
    }

    if (userBehavior.totalSessions < 3) {
      churnProbability += 0.3;
      riskFactors.push('적은 세션 수');
    }

    if (userBehavior.averageSessionDuration < 300000) { // 5분 미만
      churnProbability += 0.2;
      riskFactors.push('짧은 세션 시간');
    }

    if (userBehavior.favoriteChannels.length === 0) {
      churnProbability += 0.1;
      riskFactors.push('선호 채널 없음');
    }

    // 권장사항 생성
    const recommendations: string[] = [];
    if (userBehavior.engagementScore < 0.3) {
      recommendations.push('개인화된 콘텐츠 추천');
    }
    if (userBehavior.totalSessions < 3) {
      recommendations.push('온보딩 프로세스 개선');
    }
    if (userBehavior.averageSessionDuration < 300000) {
      recommendations.push('더 매력적인 초기 경험 제공');
    }

    return {
      churnProbability: Math.min(churnProbability, 1),
      riskFactors,
      recommendations,
    };
  }

  /**
   * 데이터 내보내기
   */
  exportData(format: 'json' | 'csv'): string {
    if (format === 'json') {
      return JSON.stringify({
        events: this.userEvents,
        sessions: this.userSessions,
      }, null, 2);
    } else {
      // CSV 형식으로 내보내기
      const eventCsv = this.convertEventsToCsv();
      const sessionCsv = this.convertSessionsToCsv();
      return `Events:\n${eventCsv}\n\nSessions:\n${sessionCsv}`;
    }
  }

  private updateSession(userId: string, event: UserEvent, sessionId?: string): void {
    if (sessionId) {
      const session = this.userSessions.find(s => s.id === sessionId);
      if (session) {
        session.events.push(event);
      }
    }
  }

  private async getChannelStatistics(timeRange: { start: Date; end: Date }) {
    // 실제 구현에서는 데이터베이스에서 채널 통계를 가져옴
    return [
      { channelId: 'general', messageCount: 150, userCount: 25 },
      { channelId: 'random', messageCount: 89, userCount: 18 },
      { channelId: 'help', messageCount: 45, userCount: 12 },
    ];
  }

  private async calculateUserEngagement(timeRange: { start: Date; end: Date }) {
    // 실제 구현에서는 데이터베이스에서 사용자 참여도를 계산
    return {
      messagesPerUser: 12.5,
      channelsPerUser: 3.2,
      filesPerUser: 1.8,
    };
  }

  private async getTotalUsers(): Promise<number> {
    // 실제 구현에서는 데이터베이스에서 총 사용자 수를 가져옴
    return 150;
  }

  private analyzeActivityPattern(events: UserEvent[]) {
    const pattern = { morning: 0, afternoon: 0, evening: 0, night: 0 };

    events.forEach(event => {
      const hour = event.timestamp.getHours();
      if (hour >= 6 && hour < 12) pattern.morning++;
      else if (hour >= 12 && hour < 18) pattern.afternoon++;
      else if (hour >= 18 && hour < 24) pattern.evening++;
      else pattern.night++;
    });

    return pattern;
  }

  private getFavoriteChannels(events: UserEvent[]): string[] {
    const channelEvents = events.filter(e => e.eventType === 'channel_joined');
    const channelCounts: Record<string, number> = {};

    channelEvents.forEach(event => {
      const channelId = event.properties?.channelId;
      if (channelId) {
        channelCounts[channelId] = (channelCounts[channelId] || 0) + 1;
      }
    });

    return Object.entries(channelCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([channelId]) => channelId);
  }

  private calculateEngagementScore(events: UserEvent[], sessions: UserSession[]): number {
    if (events.length === 0) return 0;

    const eventScore = events.length * 0.1;
    const sessionScore = sessions.length * 0.2;
    const durationScore = this.calculateAverageSessionDuration(sessions) / 60000 * 0.01; // 분 단위

    return Math.min(eventScore + sessionScore + durationScore, 1);
  }

  private calculateAverageSessionDuration(sessions: UserSession[]): number {
    const completedSessions = sessions.filter(s => s.duration !== undefined);
    if (completedSessions.length === 0) return 0;

    return completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length;
  }

  private identifyConversionPath(eventSequence: UserEvent['eventType'][]): string[] {
    // 전환 경로 식별 로직
    const conversionEvents = ['login', 'page_view', 'channel_joined', 'message_sent'];
    return eventSequence.filter(event => conversionEvents.includes(event));
  }

  private convertEventsToCsv(): string {
    const headers = ['id', 'userId', 'eventType', 'timestamp', 'properties', 'sessionId'];
    const rows = this.userEvents.map(event => [
      event.id,
      event.userId,
      event.eventType,
      event.timestamp.toISOString(),
      JSON.stringify(event.properties || {}),
      event.sessionId || '',
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  private convertSessionsToCsv(): string {
    const headers = ['id', 'userId', 'startTime', 'endTime', 'duration', 'userAgent', 'ipAddress'];
    const rows = this.userSessions.map(session => [
      session.id,
      session.userId,
      session.startTime.toISOString(),
      session.endTime?.toISOString() || '',
      session.duration || '',
      session.userAgent || '',
      session.ipAddress || '',
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 