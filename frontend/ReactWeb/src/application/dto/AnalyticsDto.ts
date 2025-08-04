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
}

export interface ChurnPrediction {
  churnProbability: number;
  riskFactors: string[];
  recommendations: string[];
} 