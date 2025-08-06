import { BaseController } from '@/application/controllers/BaseController';
import { UseCaseFactory } from '@/application/usecases/UseCaseFactory';

/**
 * 시간 범위 타입 정의
 */
type TimeRange = 'day' | 'week' | 'month';

/**
 * 활동 분석 결과 인터페이스
 */
interface ActivityAnalytics {
  totalActivities: number;
  activitiesByType: Record<string, number>;
  activitiesByHour: Record<string, number>;
  activitiesByDay: Record<string, number>;
  mostActivePeriod: {
    hour: number;
    count: number;
    percentage: number;
  };
  engagementScore: number;
  trends: {
    trend: 'increasing' | 'decreasing' | 'stable';
    change: number;
  };
}

/**
 * 채널 활동 분석 결과 인터페이스
 */
interface ChannelActivityAnalytics {
  totalActivities: number;
  activitiesByUser: Record<string, number>;
  activitiesByType: Record<string, number>;
  messageStats: {
    totalMessages: number;
    averageLength: number;
    messagesWithFiles: number;
    mostActiveHour: any;
  };
  userEngagement: {
    totalUsers: number;
    averageActivitiesPerUser: number;
    mostActiveUser: {
      user: string;
      count: number;
    };
  };
  peakActivityTimes: Array<{
    hour: number;
    count: number;
  }>;
  trends: {
    trend: 'increasing' | 'decreasing' | 'stable';
    change: number;
  };
}

/**
 * 시스템 통계 인터페이스
 */
interface SystemAnalytics {
  totalUsers: number;
  totalChannels: number;
  totalMessages: number;
  totalFiles: number;
  activeUsers: number;
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
  trends: {
    userGrowth: number;
    messageGrowth: number;
    channelGrowth: number;
  };
}

/**
 * 사용자 행동 예측 인터페이스
 */
interface UserBehaviorPrediction {
  nextActiveTime: Date;
  preferredChannels: string[];
  activityPattern: string;
  engagementTrend: string;
  churnRisk: number;
}

/**
 * 실시간 대시보드 인터페이스
 */
interface RealTimeDashboard {
  activeUsers: number;
  recentMessages: any[];
  systemAlerts: any[];
  performanceMetrics: {
    responseTime: number;
    errorRate: number;
    uptime: number;
  };
  lastUpdated: Date;
}

/**
 * AnalyticsController - 사용자 행동 분석 및 통계 관련 비즈니스 로직 조정
 */
export class AnalyticsController extends BaseController {
  private userActivityLogUseCase: any = null;
  private cacheUseCase: any = null;
  private userPermissionUseCase: any = null;
  private useCasesInitialized = false;

  // 캐시 TTL 상수
  private readonly USER_ANALYTICS_CACHE_TTL = 300; // 5분
  private readonly CHANNEL_ANALYTICS_CACHE_TTL = 600; // 10분
  private readonly SYSTEM_ANALYTICS_CACHE_TTL = 1800; // 30분

  constructor() {
    super('AnalyticsController');
  }

  /**
   * UseCase 인스턴스 초기화
   */
  private async initializeUseCases(): Promise<void> {
    if (this.useCasesInitialized) return;

    try {
      this.userActivityLogUseCase =
        UseCaseFactory.createUserActivityLogUseCase();
      this.cacheUseCase = UseCaseFactory.createCacheUseCase();
      this.userPermissionUseCase = UseCaseFactory.createUserPermissionUseCase();

      this.useCasesInitialized = true;
    } catch (error) {
      this.logger.error('Failed to initialize UseCases:', error);
      throw new Error('UseCase 초기화에 실패했습니다.');
    }
  }

  /**
   * UseCase가 초기화되었는지 확인하고 초기화
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.useCasesInitialized) {
      await this.initializeUseCases();
    }
  }

  /**
   * 분석 권한 확인 헬퍼 함수
   */
  private async checkAnalyticsPermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    try {
      if (
        this.userPermissionUseCase &&
        typeof this.userPermissionUseCase.checkPermission === 'function'
      ) {
        const result = await this.userPermissionUseCase.checkPermission({
          userId,
          resource,
          action,
        });
        return result?.hasPermission || false;
      }
      return true; // 권한 체크가 불가능한 경우 기본적으로 허용
    } catch (error) {
      this.logger.warn(
        `Failed to check analytics permission for user ${userId}:`,
        error
      );
      return true; // 에러 발생 시 기본적으로 허용
    }
  }

  /**
   * 캐시 조회 헬퍼 함수
   */
  private async getCachedAnalytics<T>(cacheKey: string): Promise<T | null> {
    try {
      if (this.cacheUseCase && typeof this.cacheUseCase.get === 'function') {
        return await this.cacheUseCase.get(cacheKey);
      }
      return null;
    } catch (error) {
      this.logger.warn(
        `Failed to get cached analytics for ${cacheKey}:`,
        error
      );
      return null;
    }
  }

  /**
   * 캐시 저장 헬퍼 함수
   */
  private async cacheAnalytics<T>(
    cacheKey: string,
    data: T,
    ttl: number
  ): Promise<void> {
    try {
      if (this.cacheUseCase && typeof this.cacheUseCase.set === 'function') {
        await this.cacheUseCase.set(cacheKey, data, ttl);
      }
    } catch (error) {
      this.logger.warn(`Failed to cache analytics for ${cacheKey}:`, error);
    }
  }

  /**
   * 사용자 활동 분석
   */
  async getUserActivityAnalytics(
    userId: string,
    timeRange: TimeRange = 'week'
  ): Promise<ActivityAnalytics> {
    return this.executeWithTracking(
      'getUserActivityAnalytics',
      { userId, timeRange },
      async () => {
        await this.ensureInitialized();

        // 분석 권한 확인
        const hasPermission = await this.checkAnalyticsPermission(
          userId,
          'analytics',
          'view_user_activity'
        );

        if (!hasPermission) {
          throw new Error('활동 분석 조회 권한이 없습니다.');
        }

        // 캐시에서 분석 결과 확인
        const cacheKey = `analytics:user:${userId}:${timeRange}`;
        const cachedResult =
          await this.getCachedAnalytics<ActivityAnalytics>(cacheKey);

        if (cachedResult) {
          return cachedResult;
        }

        // 사용자 활동 로그 조회
        const userActivities =
          (await this.userActivityLogUseCase?.getUserActivityLogs(userId)) ||
          [];

        // 시간 범위에 따른 필터링
        const filteredActivities = this.filterActivitiesByTimeRange(
          userActivities,
          timeRange
        );

        // 활동 분석
        const analytics: ActivityAnalytics = {
          totalActivities: filteredActivities.length,
          activitiesByType: this.groupActivitiesByType(filteredActivities),
          activitiesByHour: this.groupActivitiesByHour(filteredActivities),
          activitiesByDay: this.groupActivitiesByDay(filteredActivities),
          mostActivePeriod: this.findMostActivePeriod(filteredActivities),
          engagementScore: this.calculateEngagementScore(filteredActivities),
          trends: this.analyzeTrends(filteredActivities, timeRange),
        };

        // 결과 캐싱
        await this.cacheAnalytics(
          cacheKey,
          analytics,
          this.USER_ANALYTICS_CACHE_TTL
        );

        return analytics;
      }
    );
  }

  /**
   * 채널 활동 분석
   */
  async getChannelActivityAnalytics(
    channelId: string,
    userId: string,
    timeRange: TimeRange = 'week'
  ): Promise<ChannelActivityAnalytics> {
    return this.executeWithTracking(
      'getChannelActivityAnalytics',
      { channelId, userId, timeRange },
      async () => {
        await this.ensureInitialized();

        // 채널 분석 권한 확인
        const hasPermission = await this.checkAnalyticsPermission(
          userId,
          channelId,
          'view_channel_analytics'
        );

        if (!hasPermission) {
          throw new Error('채널 분석 조회 권한이 없습니다.');
        }

        // 캐시에서 분석 결과 확인
        const cacheKey = `analytics:channel:${channelId}:${timeRange}`;
        const cachedResult =
          await this.getCachedAnalytics<ChannelActivityAnalytics>(cacheKey);

        if (cachedResult) {
          return cachedResult;
        }

        // 채널 활동 로그 조회
        const channelActivities =
          (await this.userActivityLogUseCase?.getChannelActivityLogs(
            channelId
          )) || [];

        // 시간 범위에 따른 필터링
        const filteredActivities = this.filterActivitiesByTimeRange(
          channelActivities,
          timeRange
        );

        // 채널 활동 분석
        const analytics: ChannelActivityAnalytics = {
          totalActivities: filteredActivities.length,
          activitiesByUser: this.groupActivitiesByUser(filteredActivities),
          activitiesByType: this.groupActivitiesByType(filteredActivities),
          messageStats: this.analyzeMessageStats(filteredActivities),
          userEngagement: this.calculateUserEngagement(filteredActivities),
          peakActivityTimes: this.findPeakActivityTimes(filteredActivities),
          trends: this.analyzeTrends(filteredActivities, timeRange),
        };

        // 결과 캐싱
        await this.cacheAnalytics(
          cacheKey,
          analytics,
          this.CHANNEL_ANALYTICS_CACHE_TTL
        );

        return analytics;
      }
    );
  }

  /**
   * 시스템 전체 통계
   */
  async getSystemAnalytics(userId: string): Promise<SystemAnalytics> {
    return this.executeWithTracking(
      'getSystemAnalytics',
      { userId },
      async () => {
        await this.ensureInitialized();

        // 시스템 분석 권한 확인
        const hasPermission = await this.checkAnalyticsPermission(
          userId,
          'system',
          'view_system_analytics'
        );

        if (!hasPermission) {
          throw new Error('시스템 분석 조회 권한이 없습니다.');
        }

        // 캐시에서 분석 결과 확인
        const cacheKey = 'analytics:system:overview';
        const cachedResult =
          await this.getCachedAnalytics<SystemAnalytics>(cacheKey);

        if (cachedResult) {
          return cachedResult;
        }

        // 시스템 전체 활동 통계 (실제로는 데이터베이스에서 집계)
        const systemStats: SystemAnalytics = {
          totalUsers: 0,
          totalChannels: 0,
          totalMessages: 0,
          totalFiles: 0,
          activeUsers: 0,
          systemHealth: {
            uptime: 99.9,
            responseTime: 150,
            errorRate: 0.1,
          },
          trends: {
            userGrowth: 5.2,
            messageGrowth: 12.5,
            channelGrowth: 3.8,
          },
        };

        // 결과 캐싱
        await this.cacheAnalytics(
          cacheKey,
          systemStats,
          this.SYSTEM_ANALYTICS_CACHE_TTL
        );

        return systemStats;
      }
    );
  }

  /**
   * 사용자 행동 예측
   */
  async predictUserBehavior(userId: string): Promise<UserBehaviorPrediction> {
    return this.executeWithTracking(
      'predictUserBehavior',
      { userId },
      async () => {
        await this.ensureInitialized();

        // 예측 분석 권한 확인
        const hasPermission = await this.checkAnalyticsPermission(
          userId,
          'analytics',
          'view_predictions'
        );

        if (!hasPermission) {
          throw new Error('행동 예측 조회 권한이 없습니다.');
        }

        // 사용자 활동 데이터 조회
        const userActivities =
          (await this.userActivityLogUseCase?.getUserActivityLogs(userId)) ||
          [];

        // 행동 패턴 분석
        const predictions: UserBehaviorPrediction = {
          nextActiveTime: this.predictNextActiveTime(userActivities),
          preferredChannels: this.analyzePreferredChannels(userActivities),
          activityPattern: this.analyzeActivityPattern(userActivities),
          engagementTrend: this.predictEngagementTrend(userActivities),
          churnRisk: this.calculateChurnRisk(userActivities),
        };

        return predictions;
      }
    );
  }

  /**
   * 실시간 대시보드 데이터
   */
  async getRealTimeDashboard(userId: string): Promise<RealTimeDashboard> {
    return this.executeWithTracking(
      'getRealTimeDashboard',
      { userId },
      async () => {
        await this.ensureInitialized();

        // 대시보드 권한 확인
        const hasPermission = await this.checkAnalyticsPermission(
          userId,
          'dashboard',
          'view_realtime'
        );

        if (!hasPermission) {
          throw new Error('실시간 대시보드 조회 권한이 없습니다.');
        }

        // 실시간 데이터 수집
        const realTimeData: RealTimeDashboard = {
          activeUsers: this.getActiveUsersCount(),
          recentMessages: this.getRecentMessages(),
          systemAlerts: this.getSystemAlerts(),
          performanceMetrics: this.getPerformanceMetrics(),
          lastUpdated: new Date(),
        };

        return realTimeData;
      }
    );
  }

  // Private helper methods

  /**
   * 시간 범위에 따른 활동 필터링
   */
  private filterActivitiesByTimeRange(
    activities: any[],
    timeRange: TimeRange
  ): any[] {
    const now = new Date();
    const timeRangeMs = this.getTimeRangeMs(timeRange);
    const cutoffTime = new Date(now.getTime() - timeRangeMs);

    return activities.filter(
      activity => new Date(activity.timestamp) >= cutoffTime
    );
  }

  private getTimeRangeMs(timeRange: TimeRange): number {
    switch (timeRange) {
      case 'day':
        return 24 * 60 * 60 * 1000;
      case 'week':
        return 7 * 24 * 60 * 60 * 1000;
      case 'month':
        return 30 * 24 * 60 * 60 * 1000;
      default:
        return 7 * 24 * 60 * 60 * 1000;
    }
  }

  private groupActivitiesByType(activities: any[]): Record<string, number> {
    return activities.reduce(
      (acc, activity) => {
        acc[activity.action] = (acc[activity.action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  private groupActivitiesByHour(activities: any[]): Record<string, number> {
    return activities.reduce(
      (acc, activity) => {
        const hour = new Date(activity.timestamp).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  private groupActivitiesByDay(activities: any[]): Record<string, number> {
    return activities.reduce(
      (acc, activity) => {
        const day = new Date(activity.timestamp).toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  private groupActivitiesByUser(activities: any[]): Record<string, number> {
    return activities.reduce(
      (acc, activity) => {
        acc[activity.userId] = (acc[activity.userId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  private findMostActivePeriod(activities: any[]): {
    hour: number;
    count: number;
    percentage: number;
  } {
    const hourlyStats = this.groupActivitiesByHour(activities);
    const maxHour = Object.entries(hourlyStats).reduce(
      (max, [hour, count]) => (count > max.count ? { hour, count } : max),
      { hour: '0', count: 0 }
    );

    return {
      hour: parseInt(maxHour.hour),
      count: maxHour.count,
      percentage:
        activities.length > 0 ? (maxHour.count / activities.length) * 100 : 0,
    };
  }

  private calculateEngagementScore(activities: any[]): number {
    if (activities.length === 0) return 0;

    // 활동 빈도, 다양성, 최신성 등을 고려한 점수 계산
    const frequencyScore = Math.min(activities.length / 10, 1) * 40; // 최대 40점
    const diversityScore =
      Math.min(
        Object.keys(this.groupActivitiesByType(activities)).length / 5,
        1
      ) * 30; // 최대 30점
    const recencyScore = this.calculateRecencyScore(activities) * 30; // 최대 30점

    return Math.round(frequencyScore + diversityScore + recencyScore);
  }

  private calculateRecencyScore(activities: any[]): number {
    if (activities.length === 0) return 0;

    const now = new Date();
    const latestActivity = new Date(
      Math.max(...activities.map(a => new Date(a.timestamp).getTime()))
    );
    const hoursSinceLastActivity =
      (now.getTime() - latestActivity.getTime()) / (1000 * 60 * 60);

    // 24시간 이내면 1점, 그 이후로는 감소
    return Math.max(0, 1 - hoursSinceLastActivity / 24);
  }

  private analyzeTrends(
    activities: any[],
    timeRange: string
  ): { trend: 'increasing' | 'decreasing' | 'stable'; change: number } {
    // 간단한 트렌드 분석 (실제로는 더 복잡한 알고리즘 사용)
    const dailyStats = this.groupActivitiesByDay(activities);
    const days = Object.keys(dailyStats).sort();

    if (days.length < 2) return { trend: 'stable', change: 0 };

    const firstDay = dailyStats[days[0]];
    const lastDay = dailyStats[days[days.length - 1]];
    const change = firstDay > 0 ? ((lastDay - firstDay) / firstDay) * 100 : 0;

    return {
      trend: change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable',
      change: Math.round(change * 100) / 100,
    };
  }

  private analyzeMessageStats(activities: any[]): {
    totalMessages: number;
    averageLength: number;
    messagesWithFiles: number;
    mostActiveHour: any;
  } {
    const messageActivities = activities.filter(
      a => a.action === 'MESSAGE_SEND'
    );

    return {
      totalMessages: messageActivities.length,
      averageLength:
        messageActivities.length > 0
          ? messageActivities.reduce(
              (sum, a) => sum + (a.details?.contentLength || 0),
              0
            ) / messageActivities.length
          : 0,
      messagesWithFiles: messageActivities.filter(
        a => a.details?.hasAttachments
      ).length,
      mostActiveHour: this.findMostActivePeriod(messageActivities),
    };
  }

  private calculateUserEngagement(activities: any[]): {
    totalUsers: number;
    averageActivitiesPerUser: number;
    mostActiveUser: { user: string; count: number };
  } {
    const userStats = this.groupActivitiesByUser(activities);
    const users = Object.keys(userStats);

    return {
      totalUsers: users.length,
      averageActivitiesPerUser:
        users.length > 0 ? activities.length / users.length : 0,
      mostActiveUser: Object.entries(userStats).reduce(
        (max, [user, count]) => (count > max.count ? { user, count } : max),
        { user: '', count: 0 }
      ),
    };
  }

  private findPeakActivityTimes(
    activities: any[]
  ): Array<{ hour: number; count: number }> {
    const hourlyStats = this.groupActivitiesByHour(activities);
    const entries = Object.entries(hourlyStats);
    const sortedEntries = entries.sort((a, b) => {
      const countA = a[1] as number;
      const countB = b[1] as number;
      return countB - countA;
    });

    return sortedEntries.slice(0, 3).map(([hour, count]) => ({
      hour: parseInt(hour),
      count: count as number,
    }));
  }

  private predictNextActiveTime(activities: any[]): Date {
    // 간단한 예측 (실제로는 머신러닝 모델 사용)
    const now = new Date();
    const mostActiveHour = this.findMostActivePeriod(activities).hour;

    const nextActive = new Date(now);
    nextActive.setHours(mostActiveHour, 0, 0, 0);

    if (nextActive <= now) {
      nextActive.setDate(nextActive.getDate() + 1);
    }

    return nextActive;
  }

  private analyzePreferredChannels(activities: any[]): string[] {
    const channelActivities = activities.filter(a => a.resource === 'channel');
    const channelStats = channelActivities.reduce(
      (acc, activity) => {
        acc[activity.resourceId] = (acc[activity.resourceId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(channelStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([channelId]) => channelId);
  }

  private analyzeActivityPattern(activities: any[]): string {
    const hourlyStats = this.groupActivitiesByHour(activities);
    const morning = [6, 7, 8, 9, 10, 11].reduce(
      (sum, hour) => sum + (hourlyStats[hour] || 0),
      0
    );
    const afternoon = [12, 13, 14, 15, 16, 17].reduce(
      (sum, hour) => sum + (hourlyStats[hour] || 0),
      0
    );
    const evening = [18, 19, 20, 21, 22, 23].reduce(
      (sum, hour) => sum + (hourlyStats[hour] || 0),
      0
    );
    const night = [0, 1, 2, 3, 4, 5].reduce(
      (sum, hour) => sum + (hourlyStats[hour] || 0),
      0
    );

    const max = Math.max(morning, afternoon, evening, night);
    if (max === morning) return 'morning';
    if (max === afternoon) return 'afternoon';
    if (max === evening) return 'evening';
    return 'night';
  }

  private predictEngagementTrend(activities: any[]): string {
    const trends = this.analyzeTrends(activities, 'week');
    return trends.trend;
  }

  private calculateChurnRisk(activities: any[]): number {
    const recencyScore = this.calculateRecencyScore(activities);
    const engagementScore = this.calculateEngagementScore(activities);

    // 최근 활동이 없고 참여도가 낮으면 이탈 위험 높음
    return (
      Math.round((1 - recencyScore) * 0.6 + (1 - engagementScore / 100) * 0.4) *
      100
    );
  }

  private getActiveUsersCount(): number {
    // 실제로는 실시간 사용자 수를 반환
    return Math.floor(Math.random() * 100) + 50;
  }

  private getRecentMessages(): any[] {
    // 실제로는 최근 메시지 목록을 반환
    return [];
  }

  private getSystemAlerts(): any[] {
    // 실제로는 시스템 알림 목록을 반환
    return [];
  }

  private getPerformanceMetrics(): {
    responseTime: number;
    errorRate: number;
    uptime: number;
  } {
    return {
      responseTime: Math.random() * 200 + 50,
      errorRate: Math.random() * 2,
      uptime: 99.9,
    };
  }
}
