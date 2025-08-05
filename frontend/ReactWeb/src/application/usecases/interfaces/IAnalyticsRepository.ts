// Analytics 관련 타입 정의
export interface AnalyticsReport {
  totalUsers: number;
  totalEvents: number;
  averageSessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  topEvents: Array<{ eventType: string; count: number }>;
  userRetention: number;
  conversionRate: number;
}

export interface UserBehavior {
  userId: string;
  totalSessions: number;
  averageSessionDuration: number;
  mostUsedFeatures: string[];
  lastActivity: Date;
  engagementScore: number;
}

export interface UserEvent {
  userId: string;
  eventType: string;
  timestamp: Date;
  properties?: Record<string, any>;
  sessionId?: string;
}

// Analytics Repository 인터페이스 - 데이터 접근만 담당
export interface IAnalyticsRepository {
  trackEvent(
    userId: string,
    eventType: string,
    properties?: Record<string, any>,
    sessionId?: string
  ): Promise<void>;
  startSession(
    userId: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<string>;
  endSession(sessionId: string): Promise<void>;
  generateAnalyticsReport(timeRange: {
    start: Date;
    end: Date;
  }): Promise<AnalyticsReport>;
  analyzeUserBehavior(
    userId: string,
    timeRange: { start: Date; end: Date }
  ): Promise<UserBehavior>;
  getRealTimeActivity(): Promise<{
    activeUsers: number;
    recentEvents: UserEvent[];
    topEvents: Array<{ eventType: string; count: number }>;
  }>;
  analyzeUserJourney(userId: string): Promise<{
    firstEvent: UserEvent | null;
    lastEvent: UserEvent | null;
    totalEvents: number;
    eventSequence: UserEvent['eventType'][];
    conversionPath: string[];
  }>;
  predictUserChurn(userId: string): Promise<{
    churnProbability: number;
    riskFactors: string[];
    recommendations: string[];
  }>;
  exportData(format: 'json' | 'csv'): Promise<string>;
  getEventHistory(userId: string, limit?: number): Promise<UserEvent[]>;
  getSessionData(sessionId: string): Promise<any>;
}
