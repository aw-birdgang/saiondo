import type { ILogger } from '@/domain/interfaces/ILogger';

/**
 * 검증 서비스의 기본 추상 클래스
 * 공통 검증 기능을 제공
 */
export abstract class BaseValidationService {
  protected logger?: ILogger;

  constructor(logger?: ILogger) {
    this.logger = logger;
  }

  /**
   * 이메일 형식 검증
   */
  protected validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 비밀번호 강도 검증
   */
  protected validatePasswordStrength(password: string): PasswordStrengthResult {
    const result: PasswordStrengthResult = {
      isValid: true,
      score: 0,
      issues: [],
    };

    // 최소 길이 체크
    if (password.length < 8) {
      result.isValid = false;
      result.issues.push('Password must be at least 8 characters long');
    }

    // 대문자 포함 체크
    if (!/[A-Z]/.test(password)) {
      result.score += 1;
      result.issues.push('Include uppercase letters');
    }

    // 소문자 포함 체크
    if (!/[a-z]/.test(password)) {
      result.score += 1;
      result.issues.push('Include lowercase letters');
    }

    // 숫자 포함 체크
    if (!/\d/.test(password)) {
      result.score += 1;
      result.issues.push('Include numbers');
    }

    // 특수문자 포함 체크
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.score += 1;
      result.issues.push('Include special characters');
    }

    // 길이 보너스
    if (password.length >= 12) {
      result.score += 2;
    }

    return result;
  }

  /**
   * 사용자명 형식 검증
   */
  protected validateUsername(username: string): UsernameValidationResult {
    const result: UsernameValidationResult = {
      isValid: true,
      issues: [],
    };

    // 길이 체크
    if (username.length < 3) {
      result.isValid = false;
      result.issues.push('Username must be at least 3 characters long');
    }

    if (username.length > 20) {
      result.isValid = false;
      result.issues.push('Username must be at most 20 characters long');
    }

    // 형식 체크 (알파벳, 숫자, 언더스코어, 하이픈만 허용)
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      result.isValid = false;
      result.issues.push(
        'Username can only contain letters, numbers, underscores, and hyphens'
      );
    }

    // 예약어 체크
    const reservedWords = ['admin', 'root', 'system', 'guest', 'anonymous'];
    if (reservedWords.includes(username.toLowerCase())) {
      result.isValid = false;
      result.issues.push('Username cannot be a reserved word');
    }

    return result;
  }

  /**
   * URL 형식 검증
   */
  protected validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 파일 크기 검증
   */
  protected validateFileSize(
    fileSize: number,
    maxSize: number
  ): FileSizeValidationResult {
    const result: FileSizeValidationResult = {
      isValid: fileSize <= maxSize,
      size: fileSize,
      maxSize,
      formattedSize: this.formatFileSize(fileSize),
      formattedMaxSize: this.formatFileSize(maxSize),
    };

    if (!result.isValid) {
      result.issues = [
        `File size (${result.formattedSize}) exceeds maximum allowed size (${result.formattedMaxSize})`,
      ];
    }

    return result;
  }

  /**
   * 파일 타입 검증
   */
  protected validateFileType(
    fileName: string,
    allowedTypes: string[]
  ): FileTypeValidationResult {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const result: FileTypeValidationResult = {
      isValid: extension ? allowedTypes.includes(extension) : false,
      extension,
      allowedTypes,
    };

    if (!result.isValid) {
      result.issues = [
        `File type .${extension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      ];
    }

    return result;
  }

  /**
   * 채널명 검증
   */
  protected validateChannelName(name: string): ChannelNameValidationResult {
    const result: ChannelNameValidationResult = {
      isValid: true,
      issues: [],
    };

    // 길이 체크
    if (name.length < 1) {
      result.isValid = false;
      result.issues.push('Channel name cannot be empty');
    }

    if (name.length > 50) {
      result.isValid = false;
      result.issues.push('Channel name must be at most 50 characters long');
    }

    // 형식 체크 (알파벳, 숫자, 공백, 하이픈, 언더스코어만 허용)
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      result.isValid = false;
      result.issues.push(
        'Channel name can only contain letters, numbers, spaces, hyphens, and underscores'
      );
    }

    // 예약어 체크
    const reservedNames = ['general', 'random', 'announcements', 'help'];
    if (reservedNames.includes(name.toLowerCase())) {
      result.isValid = false;
      result.issues.push('Channel name cannot be a reserved name');
    }

    return result;
  }

  /**
   * 메시지 내용 검증
   */
  protected validateMessageContent(
    content: string,
    maxLength: number = 2000
  ): MessageValidationResult {
    const result: MessageValidationResult = {
      isValid: true,
      issues: [],
    };

    // 길이 체크
    if (content.length === 0) {
      result.isValid = false;
      result.issues.push('Message cannot be empty');
    }

    if (content.length > maxLength) {
      result.isValid = false;
      result.issues.push(
        `Message must be at most ${maxLength} characters long`
      );
    }

    // XSS 방지를 위한 기본 검증
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(content)) {
        result.isValid = false;
        result.issues.push('Message contains potentially dangerous content');
        break;
      }
    }

    return result;
  }

  /**
   * 파일 크기 포맷팅
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 검증 결과 로깅
   */
  protected logValidationResult(
    operation: string,
    isValid: boolean,
    issues: string[],
    context?: Record<string, any>
  ): void {
    if (isValid) {
      this.logger?.debug(`Validation passed for ${operation}`, context);
    } else {
      this.logger?.warn(`Validation failed for ${operation}`, {
        issues,
        context,
      });
    }
  }
}

// 타입 정의
export interface PasswordStrengthResult {
  isValid: boolean;
  score: number;
  issues: string[];
}

export interface UsernameValidationResult {
  isValid: boolean;
  issues: string[];
}

export interface FileSizeValidationResult {
  isValid: boolean;
  size: number;
  maxSize: number;
  formattedSize: string;
  formattedMaxSize: string;
  issues?: string[];
}

export interface FileTypeValidationResult {
  isValid: boolean;
  extension?: string;
  allowedTypes: string[];
  issues?: string[];
}

export interface ChannelNameValidationResult {
  isValid: boolean;
  issues: string[];
}

export interface MessageValidationResult {
  isValid: boolean;
  issues: string[];
}
