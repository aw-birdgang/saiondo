import { AnalyticsUseCaseService } from '../AnalyticsUseCaseService';
import { AnalyticsService } from '../../../analytics/AnalyticsService';
import { MemoryCache } from '../../../base/BaseCacheService';
import { ConsoleLogger } from '../../../../../domain/interfaces/ILogger';
import type {
  TrackEventRequest,
  AnalyticsReportRequest,
  UserBehaviorRequest,
  RealTimeActivityRequest
} from '../../../dto/AnalyticsDto';

// Mock AnalyticsService
const mockAnalyticsService = {
  trackEvent: jest.fn(),
  startSession: jest.fn(),
  endSession: jest.fn(),
  generateAnalyticsReport: jest.fn(),
  analyzeUserBehavior: jest.fn(),
  getRealTimeActivity: jest.fn(),
  analyzeUserJourney: jest.fn(),
  predictUserChurn: jest.fn(),
  exportData: jest.fn(),
} as jest.Mocked<AnalyticsService>;

// Mock Cache
const mockCache = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
  has: jest.fn(),
  keys: jest.fn(),
} as jest.Mocked<MemoryCache>;

// Mock Logger
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
} as jest.Mocked<ConsoleLogger>;

describe('AnalyticsUseCaseService', () => {
  let analyticsUseCaseService: AnalyticsUseCaseService;

  beforeEach(() => {
    jest.clearAllMocks();
    analyticsUseCaseService = new AnalyticsUseCaseService(
      mockAnalyticsService,
      mockCache,
      mockLogger
    );
  });

  describe('trackEvent', () => {
    it('should track event successfully', async () => {
      const request: TrackEventRequest = {
        userId: 'user-123',
        eventType: 'page_view',
        properties: { page: '/dashboard' },
        sessionId: 'session-456'
      };

      const response = await analyticsUseCaseService.trackEvent(request);

      expect(response).toEqual({
        success: true,
        eventId: expect.any(String),
        timestamp: expect.any(Date),
        sessionId: 'session-456'
      });

      expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith(
        'user-123',
        'page_view',
        { page: '/dashboard' },
        'session-456'
      );
    });

    it('should validate event request', async () => {
      const invalidRequest = {
        userId: '',
        eventType: 'invalid_event' as any,
        properties: {},
        sessionId: 'session-456'
      };

      await expect(
        analyticsUseCaseService.trackEvent(invalidRequest as TrackEventRequest)
      ).rejects.toThrow('User ID is required');

      expect(mockAnalyticsService.trackEvent).not.toHaveBeenCalled();
    });

    it('should handle analytics service errors', async () => {
      const request: TrackEventRequest = {
        userId: 'user-123',
        eventType: 'page_view',
        properties: { page: '/dashboard' },
        sessionId: 'session-456'
      };

      mockAnalyticsService.trackEvent.mockRejectedValue(new Error('Analytics error'));

      const response = await analyticsUseCaseService.trackEvent(request);

      expect(response).toEqual({
        success: false,
        error: 'Analytics error',
        eventId: expect.any(String),
        timestamp: expect.any(Date),
        sessionId: 'session-456'
      });
    });
  });

  describe('generateAnalyticsReport', () => {
    it('should generate analytics report with caching', async () => {
      const request: AnalyticsReportRequest = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31')
        }
      };

      const mockReport = {
        totalUsers: 100,
        activeUsers: 50,
        totalSessions: 200,
        averageSessionDuration: 1800,
        topPages: ['/dashboard', '/profile'],
        userGrowth: 10,
        retentionRate: 0.85,
        realTimeData: {
          eventCount: 150,
          uniqueUsers: 25,
          topEventTypes: [{ eventType: 'page_view', count: 50 }]
        }
      };

      mockAnalyticsService.generateAnalyticsReport.mockResolvedValue(mockReport);

      const response = await analyticsUseCaseService.generateAnalyticsReport(request);

      expect(response).toEqual({
        success: true,
        report: mockReport,
        cached: false,
        generatedAt: expect.any(Date)
      });

      expect(mockAnalyticsService.generateAnalyticsReport).toHaveBeenCalledWith(request.timeRange);
      expect(mockCache.set).toHaveBeenCalledWith(
        expect.stringContaining('analytics_report'),
        expect.objectContaining({
          report: mockReport,
          generatedAt: expect.any(Date)
        }),
        3600
      );
    });

    it('should return cached report when available', async () => {
      const request: AnalyticsReportRequest = {
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31')
        }
      };

      const cachedReport = {
        report: { totalUsers: 100, activeUsers: 50 },
        generatedAt: new Date('2024-01-15T10:00:00Z')
      };

      mockCache.get.mockResolvedValue(cachedReport);

      const response = await analyticsUseCaseService.generateAnalyticsReport(request);

      expect(response).toEqual({
        success: true,
        report: cachedReport.report,
        cached: true,
        generatedAt: cachedReport.generatedAt
      });

      expect(mockAnalyticsService.generateAnalyticsReport).not.toHaveBeenCalled();
    });
  });

  describe('analyzeUserBehavior', () => {
    it('should analyze user behavior with caching', async () => {
      const request: UserBehaviorRequest = {
        userId: 'user-123',
        timeRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31')
        }
      };

      const mockBehavior = {
        userId: 'user-123',
        totalEvents: 150,
        sessionCount: 25,
        averageSessionDuration: 1800,
        mostVisitedPages: ['/dashboard', '/profile'],
        eventFrequency: { 'page_view': 100, 'message_sent': 50 },
        lastActivity: new Date('2024-01-30T15:30:00Z'),
        engagementScore: 0.85
      };

      mockAnalyticsService.analyzeUserBehavior.mockResolvedValue(mockBehavior);

      const response = await analyticsUseCaseService.analyzeUserBehavior(request);

      expect(response).toEqual({
        success: true,
        behavior: mockBehavior,
        cached: false,
        analyzedAt: expect.any(Date)
      });

      expect(mockAnalyticsService.analyzeUserBehavior).toHaveBeenCalledWith(
        'user-123',
        request.timeRange
      );
    });
  });

  describe('getRealTimeActivity', () => {
    it('should get real-time activity', async () => {
      const request: RealTimeActivityRequest = {};

      const mockActivity = {
        activeUsers: 25,
        recentEvents: [
          { userId: 'user-1', eventType: 'page_view', timestamp: new Date() }
        ],
        topEvents: [
          { eventType: 'page_view', count: 50 },
          { eventType: 'message_sent', count: 30 }
        ]
      };

      mockAnalyticsService.getRealTimeActivity.mockResolvedValue(mockActivity);

      const response = await analyticsUseCaseService.getRealTimeActivity(request);

      expect(response).toEqual({
        success: true,
        activity: mockActivity,
        fetchedAt: expect.any(Date)
      });

      expect(mockAnalyticsService.getRealTimeActivity).toHaveBeenCalled();
    });
  });

  describe('analyzeUserJourney', () => {
    it('should analyze user journey', async () => {
      const userId = 'user-123';

      const mockJourney = {
        firstEvent: { eventType: 'login', timestamp: new Date('2024-01-01T10:00:00Z') },
        lastEvent: { eventType: 'logout', timestamp: new Date('2024-01-30T18:00:00Z') },
        totalEvents: 150,
        eventSequence: ['login', 'page_view', 'message_sent', 'logout'],
        conversionPath: ['/landing', '/signup', '/dashboard']
      };

      mockAnalyticsService.analyzeUserJourney.mockResolvedValue(mockJourney);

      const response = await analyticsUseCaseService.analyzeUserJourney(userId);

      expect(response).toEqual({
        success: true,
        journey: mockJourney,
        analyzedAt: expect.any(Date)
      });

      expect(mockAnalyticsService.analyzeUserJourney).toHaveBeenCalledWith(userId);
    });
  });

  describe('predictUserChurn', () => {
    it('should predict user churn', async () => {
      const userId = 'user-123';

      const mockPrediction = {
        churnProbability: 0.25,
        riskFactors: ['low_engagement', 'no_recent_activity'],
        recommendations: ['send_engagement_email', 'offer_discount']
      };

      mockAnalyticsService.predictUserChurn.mockResolvedValue(mockPrediction);

      const response = await analyticsUseCaseService.predictUserChurn(userId);

      expect(response).toEqual({
        success: true,
        prediction: mockPrediction,
        predictedAt: expect.any(Date)
      });

      expect(mockAnalyticsService.predictUserChurn).toHaveBeenCalledWith(userId);
    });
  });

  describe('exportData', () => {
    it('should export data in specified format', async () => {
      const format = 'json' as const;
      const mockExportData = '{"users": 100, "events": 1000}';

      mockAnalyticsService.exportData.mockResolvedValue(mockExportData);

      const result = await analyticsUseCaseService.exportData(format);

      expect(result).toBe(mockExportData);
      expect(mockAnalyticsService.exportData).toHaveBeenCalledWith(format);
    });
  });

  describe('invalidateUserCache', () => {
    it('should invalidate user-related cache', async () => {
      const userId = 'user-123';

      await analyticsUseCaseService.invalidateUserCache(userId);

      expect(mockCache.delete).toHaveBeenCalledWith(
        expect.stringContaining(`user_behavior:${userId}`)
      );
      expect(mockCache.delete).toHaveBeenCalledWith(
        expect.stringContaining(`user_journey:${userId}`)
      );
      expect(mockCache.delete).toHaveBeenCalledWith(
        expect.stringContaining(`user_churn:${userId}`)
      );
    });
  });

  describe('getAnalyticsCacheStats', () => {
    it('should return cache statistics', async () => {
      mockCache.keys.mockResolvedValue(['analytics:report:1', 'user:behavior:123']);

      const stats = await analyticsUseCaseService.getAnalyticsCacheStats();

      expect(stats).toEqual({
        totalKeys: 2,
        hitRate: expect.any(Number),
        missRate: expect.any(Number),
        averageTTL: expect.any(Number),
        analyticsKeys: 1,
        userKeys: 1
      });
    });
  });
}); 