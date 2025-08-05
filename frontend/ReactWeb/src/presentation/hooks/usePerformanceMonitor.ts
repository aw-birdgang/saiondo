import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetric {
  hookName: string;
  executionTime: number;
  timestamp: number;
  dependencies: any[];
  error?: string;
}

interface UsePerformanceMonitorOptions {
  enabled?: boolean;
  logToConsole?: boolean;
  maxMetrics?: number;
  onMetricRecorded?: (metric: PerformanceMetric) => void;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private maxMetrics: number = 100;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  setMaxMetrics(max: number) {
    this.maxMetrics = max;
  }

  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);

    // Keep only the latest metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByHook(hookName: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.hookName === hookName);
  }

  getAverageExecutionTime(hookName?: string): number {
    const targetMetrics = hookName
      ? this.getMetricsByHook(hookName)
      : this.metrics;

    if (targetMetrics.length === 0) return 0;

    const totalTime = targetMetrics.reduce(
      (sum, metric) => sum + metric.executionTime,
      0
    );
    return totalTime / targetMetrics.length;
  }

  getSlowestHooks(limit: number = 5): { hookName: string; avgTime: number }[] {
    const hookNames = [...new Set(this.metrics.map(m => m.hookName))];
    const hookStats = hookNames.map(name => ({
      hookName: name,
      avgTime: this.getAverageExecutionTime(name),
    }));

    return hookStats.sort((a, b) => b.avgTime - a.avgTime).slice(0, limit);
  }

  clearMetrics() {
    this.metrics = [];
  }

  exportMetrics(): string {
    return JSON.stringify(
      {
        totalMetrics: this.metrics.length,
        averageExecutionTime: this.getAverageExecutionTime(),
        slowestHooks: this.getSlowestHooks(),
        metrics: this.metrics,
      },
      null,
      2
    );
  }
}

export const usePerformanceMonitor = (
  options: UsePerformanceMonitorOptions = {}
) => {
  const {
    enabled = true,
    logToConsole = false,
    maxMetrics = 100,
    onMetricRecorded,
  } = options;

  const monitor = PerformanceMonitor.getInstance();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    monitor.setMaxMetrics(maxMetrics);
  }, [maxMetrics]);

  const startMonitoring = useCallback(
    (hookName: string, dependencies: any[] = []) => {
      if (!enabled) return;

      startTimeRef.current = performance.now();

      return {
        end: (error?: string) => {
          const executionTime = performance.now() - startTimeRef.current;
          const metric: PerformanceMetric = {
            hookName,
            executionTime,
            timestamp: Date.now(),
            dependencies,
            error,
          };

          monitor.recordMetric(metric);

          onMetricRecorded?.(metric);
        },
      };
    },
    [enabled, onMetricRecorded]
  );

  const getMetrics = useCallback(() => {
    return monitor.getMetrics();
  }, []);

  const getMetricsByHook = useCallback((hookName: string) => {
    return monitor.getMetricsByHook(hookName);
  }, []);

  const getAverageExecutionTime = useCallback((hookName?: string) => {
    return monitor.getAverageExecutionTime(hookName);
  }, []);

  const getSlowestHooks = useCallback((limit: number = 5) => {
    return monitor.getSlowestHooks(limit);
  }, []);

  const clearMetrics = useCallback(() => {
    monitor.clearMetrics();
  }, []);

  const exportMetrics = useCallback(() => {
    return monitor.exportMetrics();
  }, []);

  return {
    startMonitoring,
    getMetrics,
    getMetricsByHook,
    getAverageExecutionTime,
    getSlowestHooks,
    clearMetrics,
    exportMetrics,
  };
};
