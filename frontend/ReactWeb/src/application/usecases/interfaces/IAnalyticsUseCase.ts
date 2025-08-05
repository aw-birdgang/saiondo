import type { AnalyticsReport, UserBehavior, UserEvent } from './IAnalyticsRepository';

// Analytics UseCase 인터페이스 - 애플리케이션 로직 조율
export interface IAnalyticsUseCase {
  trackEvent(userId: string, eventType: string, properties?: Record<string, any>, sessionId?: string): Promise<void>;
  startSession(userId: string, userAgent?: string, ipAddress?: string): Promise<string>;
  endSession(sessionId: string): Promise<void>;
  generateAnalyticsReport(timeRange: { start: Date; end: Date }): Promise<AnalyticsReport>;
  analyzeUserBehavior(userId: string, timeRange: { start: Date; end: Date }): Promise<UserBehavior>;
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
  trackPageView(userId: string, page: string, sessionId?: string): Promise<void>;
  trackMessageSent(userId: string, channelId: string, messageLength: number, sessionId?: string): Promise<void>;
  trackChannelJoined(userId: string, channelId: string, sessionId?: string): Promise<void>;
  trackFileUploaded(userId: string, fileType: string, fileSize: number, sessionId?: string): Promise<void>;
  trackSearchPerformed(userId: string, searchTerm: string, resultCount: number, sessionId?: string): Promise<void>;
  trackLogin(userId: string, loginMethod: string, sessionId?: string): Promise<void>;
  trackLogout(userId: string, sessionDuration: number, sessionId?: string): Promise<void>;
} 