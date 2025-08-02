/**
 * APM Monitoring Use Case DTOs
 * APM 모니터링 관련 Request/Response 인터페이스
 */

export interface Trace {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'success' | 'error' | 'timeout';
  tags: Record<string, string>;
  spans: Span[];
}

export interface Span {
  id: string;
  traceId: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  type: 'http' | 'database' | 'cache' | 'external' | 'custom';
  status: 'success' | 'error';
  tags: Record<string, string>;
  parentId?: string;
}

export interface Alert {
  id: string;
  type: 'error' | 'performance' | 'security' | 'business';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  metadata: Record<string, any>;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface CreateTraceRequest {
  name: string;
  tags?: Record<string, string>;
}

export interface CreateTraceResponse {
  traceId: string;
  startTime: Date;
}

export interface EndTraceRequest {
  traceId: string;
  status: 'success' | 'error' | 'timeout';
  tags?: Record<string, string>;
}

export interface EndTraceResponse {
  success: boolean;
  duration: number;
}

export interface CreateSpanRequest {
  traceId: string;
  name: string;
  type: 'http' | 'database' | 'cache' | 'external' | 'custom';
  parentId?: string;
  tags?: Record<string, string>;
}

export interface CreateSpanResponse {
  spanId: string;
  startTime: Date;
}

export interface EndSpanRequest {
  spanId: string;
  status: 'success' | 'error';
  tags?: Record<string, string>;
}

export interface EndSpanResponse {
  success: boolean;
  duration: number;
}

export interface CreateAlertRequest {
  type: 'error' | 'performance' | 'security' | 'business';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface CreateAlertResponse {
  alertId: string;
  timestamp: Date;
}

export interface GetTracesRequest {
  timeRange: '1h' | '24h' | '7d' | '30d';
  status?: 'success' | 'error' | 'timeout';
  limit?: number;
  offset?: number;
}

export interface GetTracesResponse {
  traces: Trace[];
  total: number;
  hasMore: boolean;
}

export interface GetAlertsRequest {
  timeRange: '1h' | '24h' | '7d' | '30d';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  resolved?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetAlertsResponse {
  alerts: Alert[];
  total: number;
  hasMore: boolean;
} 