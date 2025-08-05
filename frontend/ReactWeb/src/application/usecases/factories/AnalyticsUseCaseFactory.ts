import type { IAnalyticsRepository } from '../interfaces/IAnalyticsRepository';
import type { IAnalyticsUseCase } from '../interfaces/IAnalyticsUseCase';
import type { ICache } from '../interfaces/ICache';
import { AnalyticsService } from '../services/AnalyticsService';
import { AnalyticsUseCase } from '../AnalyticsUseCase';

// 의존성 주입을 위한 팩토리 함수
export const createAnalyticsUseCase = (
  repository: IAnalyticsRepository, 
  cache?: ICache
): IAnalyticsUseCase => {
  const service = new AnalyticsService(repository, cache);
  return new AnalyticsUseCase(service);
};

// 테스트를 위한 Mock 팩토리
export const createMockAnalyticsUseCase = (): IAnalyticsUseCase => {
  const mockRepository: IAnalyticsRepository = {
    trackEvent: async () => {},
    startSession: async () => 'mock-session-id',
    endSession: async () => {},
    generateAnalyticsReport: async () => ({
      totalUsers: 0,
      totalEvents: 0,
      averageSessionDuration: 0,
      topPages: [],
      topEvents: [],
      userRetention: 0,
      conversionRate: 0
    }),
    analyzeUserBehavior: async () => ({
      userId: 'mock-user',
      totalSessions: 0,
      averageSessionDuration: 0,
      mostUsedFeatures: [],
      lastActivity: new Date(),
      engagementScore: 0
    }),
    getRealTimeActivity: async () => ({
      activeUsers: 0,
      recentEvents: [],
      topEvents: []
    }),
    analyzeUserJourney: async () => ({
      firstEvent: null,
      lastEvent: null,
      totalEvents: 0,
      eventSequence: [],
      conversionPath: []
    }),
    predictUserChurn: async () => ({
      churnProbability: 0,
      riskFactors: [],
      recommendations: []
    }),
    exportData: async () => '',
    getEventHistory: async () => [],
    getSessionData: async () => null,
  };
  
  return createAnalyticsUseCase(mockRepository);
}; 