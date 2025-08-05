import type { ILogger } from '../../../domain/interfaces/ILogger';

/**
 * 모든 서비스의 기본 추상 클래스
 * 공통 기능: 성능 측정, 로깅, 에러 처리, 입력 검증
 */
export abstract class BaseService<T> {
  protected abstract repository: T;
  protected logger?: ILogger;

  constructor(logger?: ILogger) {
    this.logger = logger;
  }

  /**
   * 성능 측정 래퍼
   * 모든 서비스 메서드에서 사용할 수 있는 성능 측정 기능
   */
  protected async measurePerformance<R>(
    operation: string,
    fn: () => Promise<R>,
    context?: Record<string, any>
  ): Promise<R> {
    const start = performance.now();
    const operationId = this.generateOperationId();

    try {
      this.logger?.info(`Starting operation: ${operation}`, {
        operationId,
        operation,
        context,
      });

      const result = await fn();
      const duration = performance.now() - start;

      this.logger?.info(`Operation completed: ${operation}`, {
        operationId,
        operation,
        duration: `${duration.toFixed(2)}ms`,
        context,
      });

      return result;
    } catch (error) {
      const duration = performance.now() - start;

      this.logger?.error(`Operation failed: ${operation}`, {
        operationId,
        operation,
        duration: `${duration.toFixed(2)}ms`,
        error: error instanceof Error ? error.message : String(error),
        context,
      });

      throw error;
    }
  }

  /**
   * 입력 데이터 검증
   * 공통 검증 로직을 제공
   */
  protected validateInput<T>(
    data: T,
    schema: ValidationSchema,
    context?: string
  ): ValidationResult {
    const errors: string[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = (data as any)[field];

      // Required 체크
      if (
        rules.required &&
        (value === undefined || value === null || value === '')
      ) {
        errors.push(`${field} is required`);
        continue;
      }

      // 타입 체크
      if (value !== undefined && value !== null) {
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}`);
        }

        // 문자열 길이 체크
        if (rules.type === 'string' && typeof value === 'string') {
          if (rules.minLength && value.length < rules.minLength) {
            errors.push(
              `${field} must be at least ${rules.minLength} characters`
            );
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(
              `${field} must be at most ${rules.maxLength} characters`
            );
          }
          if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`${field} format is invalid`);
          }
        }

        // 배열 체크
        if (rules.type === 'array' && Array.isArray(value)) {
          if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${field} must have at least ${rules.minLength} items`);
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${field} must have at most ${rules.maxLength} items`);
          }
        }

        // Enum 체크
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      context,
    };
  }

  /**
   * 에러 처리
   * 공통 에러 처리 로직
   */
  protected handleError(
    error: unknown,
    operation: string,
    context?: Record<string, any>
  ): never {
    const errorMessage = error instanceof Error ? error.message : String(error);

    this.logger?.error(`Error in ${operation}`, {
      error: errorMessage,
      context,
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error;
  }

  /**
   * 비즈니스 규칙 검증
   * 도메인 규칙 검증을 위한 공통 메서드
   */
  protected async validateBusinessRules(
    data: any,
    rules: BusinessRule[]
  ): Promise<BusinessRuleValidationResult> {
    const violations: BusinessRuleViolation[] = [];

    for (const rule of rules) {
      const isValid = await rule.validate(data);
      if (!isValid) {
        violations.push({
          rule: rule.name,
          message: rule.message,
          field: rule.field,
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
    };
  }

  /**
   * 작업 ID 생성
   */
  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export interface ValidationSchema {
  [field: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    enum?: any[];
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  context?: string;
}

export interface BusinessRule {
  name: string;
  field?: string;
  message: string;
  validate: (data: any) => boolean | Promise<boolean>;
}

export interface BusinessRuleViolation {
  rule: string;
  message: string;
  field?: string;
}

export interface BusinessRuleValidationResult {
  isValid: boolean;
  violations: BusinessRuleViolation[];
}
