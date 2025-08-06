import type { FlowInfo } from '@/shared/utils/FlowTracker';

/**
 * Controller 기본 인터페이스
 * 모든 Controller가 구현해야 할 공통 메서드 정의
 */
export interface IController {
  /**
   * Controller 이름 반환
   */
  readonly name: string;

  /**
   * Controller 초기화
   */
  initialize(): Promise<void>;

  /**
   * Controller 정리
   */
  cleanup(): Promise<void>;

  /**
   * Controller 상태 정보 반환
   */
  getControllerInfo(): {
    name: string;
    activeFlows: FlowInfo[];
    totalFlows: number;
    successRate: number;
    isInitialized: boolean;
    lastActivity: Date;
  };

  /**
   * Controller 메서드 실행을 래핑하는 공통 메서드
   */
  executeWithTracking<T>(
    operation: string,
    params: any,
    operationFn: () => Promise<T>
  ): Promise<T>;

  /**
   * Controller 활성화 상태 확인
   */
  isActive(): boolean;

  /**
   * Controller 메트릭 반환
   */
  getMetrics(): {
    totalOperations: number;
    successfulOperations: number;
    failedOperations: number;
    averageExecutionTime: number;
    lastOperationTime: Date;
  };
}

/**
 * Controller 메타데이터 인터페이스
 */
export interface ControllerMetadata {
  name: string;
  version: string;
  description: string;
  dependencies: string[];
  capabilities: string[];
}

/**
 * Controller 실행 컨텍스트
 */
export interface ControllerContext {
  userId?: string;
  sessionId?: string;
  requestId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Controller 실행 결과
 */
export interface ControllerResult<T = any> {
  success: boolean;
  data?: T;
  error?: Error;
  executionTime: number;
  flowId: string;
  context: ControllerContext;
}
