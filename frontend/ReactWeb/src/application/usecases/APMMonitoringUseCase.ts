import type { PerformanceMonitoringService } from '../services/PerformanceMonitoringService';
import type { 
  Trace,
  Span,
  Alert,
  CreateTraceRequest,
  CreateTraceResponse,
  EndTraceRequest,
  EndTraceResponse,
  CreateSpanRequest,
  CreateSpanResponse,
  EndSpanRequest,
  EndSpanResponse,
  CreateAlertRequest,
  CreateAlertResponse,
  GetTracesRequest,
  GetTracesResponse,
  GetAlertsRequest,
  GetAlertsResponse
} from '../dto/APMMonitoringDto';
import type { IUseCase } from './interfaces/IUseCase';

export class APMMonitoringUseCase implements IUseCase<CreateTraceRequest, CreateTraceResponse> {
  private traces = new Map<string, Trace>();
  private spans = new Map<string, Span>();
  private alerts = new Map<string, Alert>();

  constructor(private readonly performanceService: PerformanceMonitoringService) {}

  async execute(request: CreateTraceRequest): Promise<CreateTraceResponse> {
    return this.createTrace(request);
  }

  async createTrace(request: CreateTraceRequest): Promise<CreateTraceResponse> {
    const traceId = `trace_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    const trace: Trace = {
      id: traceId,
      name: request.name,
      startTime: new Date(),
      status: 'success',
      tags: request.tags || {},
      spans: [],
    };

    this.traces.set(traceId, trace);

    return {
      traceId,
      startTime: trace.startTime,
    };
  }

  async endTrace(request: EndTraceRequest): Promise<EndTraceResponse> {
    const trace = this.traces.get(request.traceId);
    if (!trace) {
      throw new Error('Trace not found');
    }

    trace.endTime = new Date();
    trace.status = request.status;
    trace.duration = trace.endTime.getTime() - trace.startTime.getTime();

    if (request.tags) {
      trace.tags = { ...trace.tags, ...request.tags };
    }

    return {
      success: true,
      duration: trace.duration,
    };
  }

  async createSpan(request: CreateSpanRequest): Promise<CreateSpanResponse> {
    const spanId = `span_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    const span: Span = {
      id: spanId,
      traceId: request.traceId,
      name: request.name,
      startTime: new Date(),
      type: request.type,
      status: 'success',
      tags: request.tags || {},
      parentId: request.parentId,
    };

    this.spans.set(spanId, span);

    // Add span to trace
    const trace = this.traces.get(request.traceId);
    if (trace) {
      trace.spans.push(span);
    }

    return {
      spanId,
      startTime: span.startTime,
    };
  }

  async endSpan(request: EndSpanRequest): Promise<EndSpanResponse> {
    const span = this.spans.get(request.spanId);
    if (!span) {
      throw new Error('Span not found');
    }

    span.endTime = new Date();
    span.status = request.status;
    span.duration = span.endTime.getTime() - span.startTime.getTime();

    if (request.tags) {
      span.tags = { ...span.tags, ...request.tags };
    }

    return {
      success: true,
      duration: span.duration,
    };
  }

  async createAlert(request: CreateAlertRequest): Promise<CreateAlertResponse> {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    const alert: Alert = {
      id: alertId,
      type: request.type,
      severity: request.severity,
      title: request.title,
      message: request.message,
      timestamp: new Date(),
      metadata: request.metadata || {},
      resolved: false,
    };

    this.alerts.set(alertId, alert);

    return {
      alertId,
      timestamp: alert.timestamp,
    };
  }

  async getTraces(request: GetTracesRequest): Promise<GetTracesResponse> {
    const traces = Array.from(this.traces.values());
    
    // Apply filters
    let filteredTraces = traces;
    if (request.status) {
      filteredTraces = filteredTraces.filter(trace => trace.status === request.status);
    }

    // Apply pagination
    const limit = request.limit || 50;
    const offset = request.offset || 0;
    const paginatedTraces = filteredTraces.slice(offset, offset + limit);

    return {
      traces: paginatedTraces,
      total: filteredTraces.length,
      hasMore: offset + limit < filteredTraces.length,
    };
  }

  async getAlerts(request: GetAlertsRequest): Promise<GetAlertsResponse> {
    const alerts = Array.from(this.alerts.values());
    
    // Apply filters
    let filteredAlerts = alerts;
    if (request.severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === request.severity);
    }
    if (request.resolved !== undefined) {
      filteredAlerts = filteredAlerts.filter(alert => alert.resolved === request.resolved);
    }

    // Apply pagination
    const limit = request.limit || 50;
    const offset = request.offset || 0;
    const paginatedAlerts = filteredAlerts.slice(offset, offset + limit);

    return {
      alerts: paginatedAlerts,
      total: filteredAlerts.length,
      hasMore: offset + limit < filteredAlerts.length,
    };
  }
} 