/**
 * UserActivity Use Case DTOs
 * 사용자 활동 로깅 관련 Request/Response 인터페이스
 */

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface ActivityLogRequest {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface ActivityLogResponse {
  success: boolean;
  logId: string;
}

export interface ActivityStats {
  totalActions: number;
  actionsByType: Record<string, number>;
  mostActiveUsers: Array<{ userId: string; actionCount: number }>;
  recentActivity: ActivityLog[];
}

export interface UserActivitySummary {
  userId: string;
  totalActions: number;
  lastActivity: Date;
  actionsByType: Record<string, number>;
  channelsJoined: number;
  messagesSent: number;
  filesUploaded: number;
}

export interface ActivitySearchRequest {
  query: string;
  filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
  };
  limit?: number;
  offset?: number;
}

export interface ActivityExportRequest {
  format: 'json' | 'csv';
  filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
  };
}

export interface ActivityExportResponse {
  data: string;
  format: 'json' | 'csv';
  recordCount: number;
}
