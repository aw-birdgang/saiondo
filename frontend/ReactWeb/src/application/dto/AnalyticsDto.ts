/**
 * Analytics Use Case DTOs
 * 분석 관련 Request/Response 인터페이스
 */

export interface UserEvent {
  id: string;
  userId: string;
  eventType: 'page_view' | 'message_sent' | 'channel_joined' | 'file_uploaded' | 'search_performed' | 'login' | 'logout';
  timestamp: Date;
  properties?: Record<string, any>;
  sessionId?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  events: UserEvent[];
  userAgent?: string;
  ipAddress?: string;
}

export interface AnalyticsReport {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  eventsByType: Record<string, number>;
  topChannels: Array<{ channelId: string; messageCount: number; userCount: number }>;
  userEngagement: {
    messagesPerUser: number;
    channelsPerUser: number;
    filesPerUser: number;
  };
  timeRange: {
    start: Date;
    end: Date;
  };
  realTimeData?: {
    eventCount: number;
    uniqueUsers: number;
    topEventTypes: Array<{ eventType: string; count: number }>;
  };
}

export interface UserBehavior {
  userId: string;
  totalSessions: number;
  averageSessionDuration: number;
  favoriteChannels: string[];
  activityPattern: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  engagementScore: number;
  realTimePatterns?: {
    eventCount: number;
    lastActivity: Date | null;
    activityPattern: string;
  };
}

export interface RealTimeActivity {
  activeUsers: number;
  recentEvents: UserEvent[];
  topEvents: Array<{ eventType: string; count: number }>;
}

export interface UserJourney {
  firstEvent: UserEvent | null;
  lastEvent: UserEvent | null;
  totalEvents: number;
  eventSequence: UserEvent['eventType'][];
  conversionPath: string[];
  currentSession?: UserSession;
  recentEvents?: UserEvent[];
}

export interface ChurnPrediction {
  churnProbability: number;
  riskFactors: string[];
  recommendations: string[];
  realTimeRiskFactors?: string[];
  realTimeProbability?: number;
}

// Request/Response DTOs for UseCase Services
export interface TrackEventRequest {
  userId: string;
  eventType: UserEvent['eventType'];
  properties?: Record<string, any>;
  sessionId?: string;
}

export interface TrackEventResponse {
  success: boolean;
  eventId: string;
  timestamp: Date;
  cacheKey?: string;
}

export interface AnalyticsReportRequest {
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface AnalyticsReportResponse {
  report: AnalyticsReport;
  generatedAt: Date;
  cacheKey?: string;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface UserBehaviorRequest {
  userId: string;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface UserBehaviorResponse {
  behavior: UserBehavior;
  analyzedAt: Date;
  cacheKey?: string;
  userId: string;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface RealTimeActivityRequest {
  // 빈 인터페이스 - 실시간 데이터는 요청 파라미터가 없음
}

export interface RealTimeActivityResponse {
  activity: RealTimeActivity;
  fetchedAt: Date;
  cacheKey?: string;
  ttl: number;
} 