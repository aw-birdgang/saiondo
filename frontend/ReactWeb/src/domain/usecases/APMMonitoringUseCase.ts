import type { IUserRepository } from '../repositories/IUserRepository';
import type { IChannelRepository } from '../repositories/IChannelRepository';
import type { IMessageRepository } from '../repositories/IMessageRepository';
import { DomainErrorFactory } from '../errors/DomainError';

export interface APMConfig {
  enabled: boolean;
  sampleRate: number; // 0.0 to 1.0
  maxTracesPerMinute: number;
  environment: 'development' | 'staging' | 'production';
  serviceName: string;
  serviceVersion: string;
}

export interface Trace {
  id: string;
  name: string;
  type: 'http' | 'database' | 'cache' | 'websocket' | 'custom';
  startTime: number;
  endTime?: number;
  duration?: number;
  userId?: string;
  channelId?: string;
  metadata?: Record<string, any>;
  spans: Span[];
  status: 'success' | 'error' | 'timeout';
  errorMessage?: string;
}

export interface Span {
  id: string;
  name: string;
  type: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
  parentSpanId?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags: Record<string, string>;
}

export interface APMStats {
  totalTraces: number;
  errorRate: number;
  averageResponseTime: number;
  throughput: number; // requests per minute
  activeTraces: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  duration: number; // seconds
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

export interface Alert {
  id: string;
  ruleId: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export class APMMonitoringUseCase {
  private config: APMConfig;
  private traces: Trace[] = [];
  private activeTraces = new Map<string, Trace>();
  private metrics: PerformanceMetric[] = [];
  private alertRules: AlertRule[] = [];
  private alerts: Alert[] = [];
  private readonly maxTraces = 10000;
  private readonly maxMetrics = 50000;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    config: APMConfig
  ) {
    this.config = {
      enabled: true,
      sampleRate: 1.0,
      maxTracesPerMinute: 1000,
      environment: 'development',
      serviceName: 'saiondo-frontend',
      serviceVersion: '1.0.0',
      ...config,
    };
  }

  async startTrace(
    name: string,
    type: Trace['type'],
    userId?: string,
    channelId?: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      if (!this.config.enabled) {
        return '';
      }

      // Check sampling rate
      if (Math.random() > this.config.sampleRate) {
        return '';
      }

      const traceId = this.generateTraceId();
      const trace: Trace = {
        id: traceId,
        name,
        type,
        startTime: Date.now(),
        userId,
        channelId,
        metadata,
        spans: [],
        status: 'success',
      };

      this.activeTraces.set(traceId, trace);
      
      return traceId;
    } catch (error) {
      console.error('Failed to start trace:', error);
      return '';
    }
  }

  async endTrace(traceId: string, status: Trace['status'] = 'success', errorMessage?: string): Promise<void> {
    try {
      const trace = this.activeTraces.get(traceId);
      if (!trace) {
        return;
      }

      trace.endTime = Date.now();
      trace.duration = trace.endTime - trace.startTime;
      trace.status = status;
      trace.errorMessage = errorMessage;

      // Move to completed traces
      this.traces.push(trace);
      this.activeTraces.delete(traceId);

      // Keep only recent traces
      if (this.traces.length > this.maxTraces) {
        this.traces = this.traces.slice(-this.maxTraces);
      }

      // Record performance metric
      await this.recordMetric('trace_duration', trace.duration, 'milliseconds', {
        trace_name: trace.name,
        trace_type: trace.type,
        status: trace.status,
      });

      // Check for alerts
      await this.checkAlerts(trace);
    } catch (error) {
      console.error('Failed to end trace:', error);
    }
  }

  async addSpan(
    traceId: string,
    name: string,
    type: string,
    parentSpanId?: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      const trace = this.activeTraces.get(traceId);
      if (!trace) {
        return '';
      }

      const spanId = this.generateSpanId();
      const span: Span = {
        id: spanId,
        name,
        type,
        startTime: Date.now(),
        parentSpanId,
        metadata,
      };

      trace.spans.push(span);
      return spanId;
    } catch (error) {
      console.error('Failed to add span:', error);
      return '';
    }
  }

  async endSpan(traceId: string, spanId: string): Promise<void> {
    try {
      const trace = this.activeTraces.get(traceId);
      if (!trace) {
        return;
      }

      const span = trace.spans.find(s => s.id === spanId);
      if (!span) {
        return;
      }

      span.endTime = Date.now();
      span.duration = span.endTime - span.startTime;
    } catch (error) {
      console.error('Failed to end span:', error);
    }
  }

  async recordMetric(
    name: string,
    value: number,
    unit: string,
    tags: Record<string, string> = {}
  ): Promise<void> {
    try {
      const metric: PerformanceMetric = {
        name,
        value,
        unit,
        timestamp: new Date(),
        tags: {
          environment: this.config.environment,
          service: this.config.serviceName,
          version: this.config.serviceVersion,
          ...tags,
        },
      };

      this.metrics.push(metric);

      // Keep only recent metrics
      if (this.metrics.length > this.maxMetrics) {
        this.metrics = this.metrics.slice(-this.maxMetrics);
      }
    } catch (error) {
      console.error('Failed to record metric:', error);
    }
  }

  async getTraces(
    filters?: {
      type?: Trace['type'];
      status?: Trace['status'];
      userId?: string;
      channelId?: string;
      startTime?: Date;
      endTime?: Date;
    },
    limit = 100
  ): Promise<Trace[]> {
    try {
      let filteredTraces = this.traces;

      if (filters?.type) {
        filteredTraces = filteredTraces.filter(t => t.type === filters.type);
      }

      if (filters?.status) {
        filteredTraces = filteredTraces.filter(t => t.status === filters.status);
      }

      if (filters?.userId) {
        filteredTraces = filteredTraces.filter(t => t.userId === filters.userId);
      }

      if (filters?.channelId) {
        filteredTraces = filteredTraces.filter(t => t.channelId === filters.channelId);
      }

      if (filters?.startTime) {
        filteredTraces = filteredTraces.filter(t => t.startTime >= filters.startTime!.getTime());
      }

      if (filters?.endTime) {
        filteredTraces = filteredTraces.filter(t => t.startTime <= filters.endTime!.getTime());
      }

      return filteredTraces
        .sort((a, b) => b.startTime - a.startTime)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get traces:', error);
      return [];
    }
  }

  async getAPMStats(): Promise<APMStats> {
    try {
      const now = Date.now();
      const oneMinuteAgo = now - 60 * 1000;

      // Get traces from last minute
      const recentTraces = this.traces.filter(t => t.startTime >= oneMinuteAgo);
      
      const totalTraces = this.traces.length;
      const errorTraces = this.traces.filter(t => t.status === 'error').length;
      const errorRate = totalTraces > 0 ? (errorTraces / totalTraces) * 100 : 0;
      
      const completedTraces = this.traces.filter(t => t.duration !== undefined);
      const averageResponseTime = completedTraces.length > 0 
        ? completedTraces.reduce((sum, t) => sum + t.duration!, 0) / completedTraces.length 
        : 0;
      
      const throughput = recentTraces.length; // traces per minute
      const activeTraces = this.activeTraces.size;

      return {
        totalTraces,
        errorRate,
        averageResponseTime,
        throughput,
        activeTraces,
        memoryUsage: this.getMemoryUsage(),
        cpuUsage: this.getCpuUsage(),
      };
    } catch (error) {
      console.error('Failed to get APM stats:', error);
      return {
        totalTraces: 0,
        errorRate: 0,
        averageResponseTime: 0,
        throughput: 0,
        activeTraces: 0,
        memoryUsage: 0,
        cpuUsage: 0,
      };
    }
  }

  async addAlertRule(rule: Omit<AlertRule, 'id'>): Promise<string> {
    try {
      const ruleId = this.generateRuleId();
      const newRule: AlertRule = {
        ...rule,
        id: ruleId,
      };

      this.alertRules.push(newRule);
      return ruleId;
    } catch (error) {
      console.error('Failed to add alert rule:', error);
      return '';
    }
  }

  async getAlerts(
    severity?: Alert['severity'],
    resolved?: boolean,
    limit = 100
  ): Promise<Alert[]> {
    try {
      let filteredAlerts = this.alerts;

      if (severity) {
        filteredAlerts = filteredAlerts.filter(a => a.severity === severity);
      }

      if (resolved !== undefined) {
        filteredAlerts = filteredAlerts.filter(a => a.resolved === resolved);
      }

      return filteredAlerts
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get alerts:', error);
      return [];
    }
  }

  async resolveAlert(alertId: string): Promise<void> {
    try {
      const alert = this.alerts.find(a => a.id === alertId);
      if (alert) {
        alert.resolved = true;
        alert.resolvedAt = new Date();
      }
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  }

  async getMetrics(
    name?: string,
    startTime?: Date,
    endTime?: Date,
    limit = 1000
  ): Promise<PerformanceMetric[]> {
    try {
      let filteredMetrics = this.metrics;

      if (name) {
        filteredMetrics = filteredMetrics.filter(m => m.name === name);
      }

      if (startTime) {
        filteredMetrics = filteredMetrics.filter(m => m.timestamp >= startTime);
      }

      if (endTime) {
        filteredMetrics = filteredMetrics.filter(m => m.timestamp <= endTime);
      }

      return filteredMetrics
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get metrics:', error);
      return [];
    }
  }

  async cleanupOldData(daysToKeep: number = 7): Promise<void> {
    try {
      const cutoffTime = new Date();
      cutoffTime.setDate(cutoffTime.getDate() - daysToKeep);

      const originalTracesCount = this.traces.length;
      const originalMetricsCount = this.metrics.length;

      this.traces = this.traces.filter(t => t.startTime >= cutoffTime.getTime());
      this.metrics = this.metrics.filter(m => m.timestamp >= cutoffTime);

      const removedTraces = originalTracesCount - this.traces.length;
      const removedMetrics = originalMetricsCount - this.metrics.length;

      if (removedTraces > 0 || removedMetrics > 0) {
        console.log(`Cleaned up ${removedTraces} old traces and ${removedMetrics} old metrics`);
      }
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
    }
  }

  private async checkAlerts(trace: Trace): Promise<void> {
    try {
      for (const rule of this.alertRules) {
        if (!rule.enabled) continue;

        let shouldAlert = false;

        switch (rule.condition) {
          case 'error_rate_high':
            const recentTraces = this.traces.filter(t => 
              t.startTime >= Date.now() - rule.duration * 1000
            );
            const errorRate = recentTraces.length > 0 
              ? (recentTraces.filter(t => t.status === 'error').length / recentTraces.length) * 100 
              : 0;
            shouldAlert = errorRate > rule.threshold;
            break;

          case 'response_time_slow':
            if (trace.duration) {
              shouldAlert = trace.duration > rule.threshold;
            }
            break;

          case 'throughput_low':
            const throughput = this.traces.filter(t => 
              t.startTime >= Date.now() - rule.duration * 1000
            ).length;
            shouldAlert = throughput < rule.threshold;
            break;
        }

        if (shouldAlert) {
          await this.createAlert(rule, trace);
        }
      }
    } catch (error) {
      console.error('Failed to check alerts:', error);
    }
  }

  private async createAlert(rule: AlertRule, trace: Trace): Promise<void> {
    try {
      const alert: Alert = {
        id: this.generateAlertId(),
        ruleId: rule.id,
        message: `Alert: ${rule.name} - ${rule.condition} threshold exceeded`,
        severity: rule.severity,
        timestamp: new Date(),
        resolved: false,
      };

      this.alerts.push(alert);

      // In real implementation, this would send notification
      console.log(`ALERT [${rule.severity.toUpperCase()}]: ${alert.message}`);
    } catch (error) {
      console.error('Failed to create alert:', error);
    }
  }

  private getMemoryUsage(): number {
    // In real implementation, this would get actual memory usage
    return Math.random() * 100;
  }

  private getCpuUsage(): number {
    // In real implementation, this would get actual CPU usage
    return Math.random() * 100;
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateSpanId(): string {
    return `span_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateRuleId(): string {
    return `rule_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
} 