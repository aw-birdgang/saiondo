import type { AnalyticsReport, UserBehavior, UserEvent } from './IAnalyticsRepository';

// Analytics Service 인터페이스 - 비즈니스 로직 담당
export interface IAnalyticsService {
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
  getEventHistory(userId: string, limit?: number): Promise<UserEvent[]>;
  getSessionData(sessionId: string): Promise<any>;
  validateEventData(userId: string, eventType: string, properties?: Record<string, any>): boolean;
  calculateEngagementScore(userId: string): Promise<number>;
  processEventProperties(properties?: Record<string, any>): Record<string, any>;
} 