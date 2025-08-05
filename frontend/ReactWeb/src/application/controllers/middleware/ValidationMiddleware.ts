import { BaseMiddleware } from '../interfaces/IControllerMiddleware';
import type { ControllerContext } from '../interfaces/IController';
import { Logger } from '../../../shared/utils/Logger';

interface ValidationRule {
  field: string;
  type: 'required' | 'string' | 'number' | 'email' | 'url' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message?: string;
}

interface ValidationSchema {
  [operation: string]: ValidationRule[];
}

/**
 * 검증 미들웨어
 * Controller 실행 전에 입력 파라미터를 검증
 */
export class ValidationMiddleware extends BaseMiddleware {
  private readonly logger = new Logger('ValidationMiddleware');
  private validationSchemas: Map<string, ValidationSchema> = new Map();

  constructor() {
    super('ValidationMiddleware', 5); // 높은 우선순위로 먼저 실행
    this.setupDefaultValidationSchemas();
  }

  async beforeExecute(
    controllerName: string,
    operation: string,
    params: any,
    context: ControllerContext
  ): Promise<void> {
    const schema = this.getValidationSchema(controllerName, operation);
    if (!schema) {
      return; // 검증 스키마가 없으면 검증 건너뛰기
    }

    const errors: string[] = [];

    for (const rule of schema) {
      const value = this.getNestedValue(params, rule.field);
      const isValid = this.validateField(value, rule);

      if (!isValid) {
        const message = rule.message || this.getDefaultErrorMessage(rule);
        errors.push(`${rule.field}: ${message}`);
      }
    }

    if (errors.length > 0) {
      const errorMessage = `Validation failed for ${controllerName}.${operation}: ${errors.join(', ')}`;
      this.logger.warn(errorMessage, {
        flowId: context.requestId,
        params: this.sanitizeParams(params),
        errors
      });
      
      throw new Error(errorMessage);
    }

    this.logger.info(`Validation passed for ${controllerName}.${operation}`, {
      flowId: context.requestId,
      params: this.sanitizeParams(params)
    });
  }

  /**
   * 기본 검증 스키마 설정
   */
  private setupDefaultValidationSchemas(): void {
    // UserController 검증 스키마
    this.addValidationSchema('UserController', {
      'authenticateUser': [
        { field: 'email', type: 'required', message: '이메일은 필수입니다' },
        { field: 'email', type: 'email', message: '유효한 이메일 형식이 아닙니다' },
        { field: 'password', type: 'required', message: '비밀번호는 필수입니다' },
        { field: 'password', type: 'minLength', value: 6, message: '비밀번호는 최소 6자 이상이어야 합니다' }
      ],
      'registerUser': [
        { field: 'email', type: 'required', message: '이메일은 필수입니다' },
        { field: 'email', type: 'email', message: '유효한 이메일 형식이 아닙니다' },
        { field: 'password', type: 'required', message: '비밀번호는 필수입니다' },
        { field: 'password', type: 'minLength', value: 6, message: '비밀번호는 최소 6자 이상이어야 합니다' },
        { field: 'name', type: 'required', message: '이름은 필수입니다' },
        { field: 'name', type: 'minLength', value: 2, message: '이름은 최소 2자 이상이어야 합니다' }
      ],
      'updateUser': [
        { field: 'userId', type: 'required', message: '사용자 ID는 필수입니다' },
        { field: 'userId', type: 'string', message: '사용자 ID는 문자열이어야 합니다' }
      ]
    });

    // ChannelController 검증 스키마
    this.addValidationSchema('ChannelController', {
      'createChannel': [
        { field: 'name', type: 'required', message: '채널 이름은 필수입니다' },
        { field: 'name', type: 'minLength', value: 1, message: '채널 이름은 최소 1자 이상이어야 합니다' },
        { field: 'name', type: 'maxLength', value: 50, message: '채널 이름은 최대 50자까지 가능합니다' },
        { field: 'description', type: 'maxLength', value: 200, message: '채널 설명은 최대 200자까지 가능합니다' }
      ],
      'joinChannel': [
        { field: 'channelId', type: 'required', message: '채널 ID는 필수입니다' },
        { field: 'userId', type: 'required', message: '사용자 ID는 필수입니다' }
      ]
    });

    // MessageController 검증 스키마
    this.addValidationSchema('MessageController', {
      'sendMessage': [
        { field: 'channelId', type: 'required', message: '채널 ID는 필수입니다' },
        { field: 'senderId', type: 'required', message: '송신자 ID는 필수입니다' },
        { field: 'content', type: 'required', message: '메시지 내용은 필수입니다' },
        { field: 'content', type: 'minLength', value: 1, message: '메시지 내용은 최소 1자 이상이어야 합니다' },
        { field: 'content', type: 'maxLength', value: 1000, message: '메시지 내용은 최대 1000자까지 가능합니다' }
      ]
    });
  }

  /**
   * 검증 스키마 추가
   */
  addValidationSchema(controllerName: string, schema: ValidationSchema): void {
    this.validationSchemas.set(controllerName, schema);
    this.logger.info(`Validation schema added for ${controllerName}`, { operations: Object.keys(schema) });
  }

  /**
   * 검증 스키마 조회
   */
  getValidationSchema(controllerName: string, operation: string): ValidationRule[] | null {
    const schema = this.validationSchemas.get(controllerName);
    return schema?.[operation] || null;
  }

  /**
   * 필드 값 검증
   */
  private validateField(value: any, rule: ValidationRule): boolean {
    switch (rule.type) {
      case 'required':
        return value !== undefined && value !== null && value !== '';

      case 'string':
        return typeof value === 'string';

      case 'number':
        return typeof value === 'number' && !isNaN(value);

      case 'email':
        if (typeof value !== 'string') return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);

      case 'url':
        if (typeof value !== 'string') return false;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }

      case 'minLength':
        if (typeof value !== 'string') return false;
        return value.length >= (rule.value || 0);

      case 'maxLength':
        if (typeof value !== 'string') return false;
        return value.length <= (rule.value || Infinity);

      case 'pattern':
        if (typeof value !== 'string') return false;
        const regex = new RegExp(rule.value || '');
        return regex.test(value);

      default:
        return true;
    }
  }

  /**
   * 중첩된 객체에서 값 추출
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * 기본 에러 메시지 생성
   */
  private getDefaultErrorMessage(rule: ValidationRule): string {
    switch (rule.type) {
      case 'required':
        return '필수 필드입니다';
      case 'string':
        return '문자열이어야 합니다';
      case 'number':
        return '숫자여야 합니다';
      case 'email':
        return '유효한 이메일 형식이 아닙니다';
      case 'url':
        return '유효한 URL 형식이 아닙니다';
      case 'minLength':
        return `최소 ${rule.value}자 이상이어야 합니다`;
      case 'maxLength':
        return `최대 ${rule.value}자까지 가능합니다`;
      case 'pattern':
        return '형식이 올바르지 않습니다';
      default:
        return '유효하지 않은 값입니다';
    }
  }

  /**
   * 민감한 정보 제거
   */
  private sanitizeParams(params: any): any {
    if (!params) return params;
    
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    const sanitized = { ...params };
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  /**
   * 검증 통계 조회
   */
  getValidationStats(): {
    totalSchemas: number;
    totalRules: number;
    controllers: string[];
  } {
    let totalRules = 0;
    const controllers: string[] = [];

    for (const [controllerName, schema] of this.validationSchemas.entries()) {
      controllers.push(controllerName);
      totalRules += Object.values(schema).reduce((sum, rules) => sum + rules.length, 0);
    }

    return {
      totalSchemas: this.validationSchemas.size,
      totalRules,
      controllers
    };
  }
} 