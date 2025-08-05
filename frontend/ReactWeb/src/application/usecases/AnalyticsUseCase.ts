import type { IAnalyticsService } from './interfaces/IAnalyticsService';
import type { IAnalyticsUseCase } from './interfaces/IAnalyticsUseCase';

// Analytics UseCase 구현체 - Service를 사용하여 애플리케이션 로직 조율
export class AnalyticsUseCase implements IAnalyticsUseCase {
  constructor(private analyticsService: IAnalyticsService) {}

  async trackEvent(userId: string, eventType: string, properties?: Record<string, any>, sessionId?: string): Promise<void> {
    return await this.analyticsService.trackEvent(userId, eventType, properties, sessionId);
  }

  async startSession(userId: string, userAgent?: string, ipAddress?: string): Promise<string> {
    return await this.analyticsService.startSession(userId, userAgent, ipAddress);
  }

  async endSession(sessionId: string): Promise<void> {
    return await this.analyticsService.endSession(sessionId);
  }

  async generateAnalyticsReport(timeRange: { start: Date; end: Date }): Promise<any> {
    return await this.analyticsService.generateAnalyticsReport(timeRange);
  }

  async analyzeUserBehavior(userId: string, timeRange: { start: Date; end: Date }): Promise<any> {
    return await this.analyticsService.analyzeUserBehavior(userId, timeRange);
  }

  async getRealTimeActivity(): Promise<{
    activeUsers: number;
    recentEvents: any[];
    topEvents: Array<{ eventType: string; count: number }>;
  }> {
    return await this.analyticsService.getRealTimeActivity();
  }

  async analyzeUserJourney(userId: string): Promise<{
    firstEvent: any | null;
    lastEvent: any | null;
    totalEvents: number;
    eventSequence: string[];
    conversionPath: string[];
  }> {
    return await this.analyticsService.analyzeUserJourney(userId);
  }

  async predictUserChurn(userId: string): Promise<{
    churnProbability: number;
    riskFactors: string[];
    recommendations: string[];
  }> {
    return await this.analyticsService.predictUserChurn(userId);
  }

  async exportData(format: 'json' | 'csv'): Promise<string> {
    return await this.analyticsService.exportData(format);
  }

  async trackPageView(userId: string, page: string, sessionId?: string): Promise<void> {
    await this.trackEvent(userId, 'page_view', { page }, sessionId);
  }

  async trackMessageSent(userId: string, channelId: string, messageLength: number, sessionId?: string): Promise<void> {
    await this.trackEvent(userId, 'message_sent', { channelId, messageLength }, sessionId);
  }

  async trackChannelJoined(userId: string, channelId: string, sessionId?: string): Promise<void> {
    await this.trackEvent(userId, 'channel_joined', { channelId }, sessionId);
  }

  async trackFileUploaded(userId: string, fileType: string, fileSize: number, sessionId?: string): Promise<void> {
    await this.trackEvent(userId, 'file_uploaded', { fileType, fileSize }, sessionId);
  }

  async trackSearchPerformed(userId: string, searchTerm: string, resultCount: number, sessionId?: string): Promise<void> {
    await this.trackEvent(userId, 'search_performed', { searchTerm, resultCount }, sessionId);
  }

  async trackLogin(userId: string, loginMethod: string, sessionId?: string): Promise<void> {
    await this.trackEvent(userId, 'login', { loginMethod }, sessionId);
  }

  async trackLogout(userId: string, sessionDuration: number, sessionId?: string): Promise<void> {
    await this.trackEvent(userId, 'logout', { sessionDuration }, sessionId);
  }
}
