/**
 * FlowTracker - 애플리케이션 흐름 추적 시스템
 */
export interface FlowInfo {
  id: string;
  controller: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success?: boolean;
  error?: any;
  metadata?: any;
}

export class FlowTracker {
  private flows: Map<string, FlowInfo> = new Map();
  private completedFlows: FlowInfo[] = [];
  private readonly maxCompletedFlows = 1000; // 최대 보관할 완료된 흐름 수

  /**
   * 새로운 흐름 시작
   */
  startFlow(controller: string, operation: string, metadata?: any): string {
    const flowId = this.generateFlowId();
    const flowInfo: FlowInfo = {
      id: flowId,
      controller,
      operation,
      startTime: performance.now(),
      metadata,
    };

    this.flows.set(flowId, flowInfo);
    return flowId;
  }

  /**
   * 흐름 완료
   */
  completeFlow(flowId: string, success: boolean, error?: any) {
    const flow = this.flows.get(flowId);
    if (!flow) {
      console.warn(`Flow ${flowId} not found`);
      return;
    }

    flow.endTime = performance.now();
    flow.duration = flow.endTime - flow.startTime;
    flow.success = success;
    flow.error = error;

    // 완료된 흐름을 별도 배열로 이동
    this.completedFlows.push(flow);
    this.flows.delete(flowId);

    // 최대 개수 제한
    if (this.completedFlows.length > this.maxCompletedFlows) {
      this.completedFlows = this.completedFlows.slice(-this.maxCompletedFlows);
    }
  }

  /**
   * 활성 흐름 조회
   */
  getActiveFlows(): FlowInfo[] {
    return Array.from(this.flows.values());
  }

  /**
   * 완료된 흐름 조회
   */
  getCompletedFlows(): FlowInfo[] {
    return [...this.completedFlows];
  }

  /**
   * 전체 흐름 수 조회
   */
  getTotalFlows(): number {
    return this.completedFlows.length;
  }

  /**
   * 성공률 계산
   */
  getSuccessRate(): number {
    if (this.completedFlows.length === 0) return 0;

    const successfulFlows = this.completedFlows.filter(flow => flow.success);
    return (successfulFlows.length / this.completedFlows.length) * 100;
  }

  /**
   * 컨트롤러별 통계
   */
  getControllerStats(): Record<
    string,
    { total: number; success: number; avgDuration: number }
  > {
    const stats: Record<
      string,
      { total: number; success: number; avgDuration: number }
    > = {};

    this.completedFlows.forEach(flow => {
      if (!stats[flow.controller]) {
        stats[flow.controller] = { total: 0, success: 0, avgDuration: 0 };
      }

      stats[flow.controller].total++;
      if (flow.success) {
        stats[flow.controller].success++;
      }
      if (flow.duration) {
        stats[flow.controller].avgDuration += flow.duration;
      }
    });

    // 평균 계산
    Object.keys(stats).forEach(controller => {
      if (stats[controller].total > 0) {
        stats[controller].avgDuration /= stats[controller].total;
      }
    });

    return stats;
  }

  /**
   * 특정 흐름 조회
   */
  getFlow(flowId: string): FlowInfo | undefined {
    return (
      this.flows.get(flowId) ||
      this.completedFlows.find(flow => flow.id === flowId)
    );
  }

  /**
   * 흐름 ID 생성
   */
  private generateFlowId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 오래된 흐름 정리
   */
  cleanupOldFlows(maxAgeMs: number = 24 * 60 * 60 * 1000) {
    // 기본 24시간
    const cutoffTime = Date.now() - maxAgeMs;
    this.completedFlows = this.completedFlows.filter(
      flow => flow.startTime > cutoffTime
    );
  }
}
