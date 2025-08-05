/**
 * ErrorHandler - 애플리케이션 전체 에러 처리 시스템
 */
export interface ErrorInfo {
  message: string;
  code: string;
  context: string;
  operation: string;
  timestamp: Date;
  originalError?: any;
  userFriendly?: boolean;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly context: string;
  public readonly operation: string;
  public readonly userFriendly: boolean;
  public readonly originalError?: any;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: string,
    context: string,
    operation: string,
    userFriendly: boolean = false,
    originalError?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.operation = operation;
    this.userFriendly = userFriendly;
    this.originalError = originalError;
    this.timestamp = new Date();
  }
}

export class ErrorHandler {
  private readonly errorMap: Map<string, string> = new Map([
    ['NETWORK_ERROR', '네트워크 연결에 문제가 있습니다.'],
    ['AUTHENTICATION_FAILED', '인증에 실패했습니다. 다시 로그인해주세요.'],
    ['PERMISSION_DENIED', '권한이 없습니다.'],
    ['VALIDATION_ERROR', '입력 정보를 확인해주세요.'],
    ['SERVER_ERROR', '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'],
    ['UNKNOWN_ERROR', '알 수 없는 오류가 발생했습니다.'],
  ]);

  /**
   * 에러 처리 및 표준화
   */
  handleError(error: any, context: string, operation: string): AppError {
    // 이미 AppError인 경우 그대로 반환
    if (error instanceof AppError) {
      return error;
    }

    // 네트워크 에러 처리
    if (this.isNetworkError(error)) {
      return new AppError(
        'Network connection failed',
        'NETWORK_ERROR',
        context,
        operation,
        true,
        error
      );
    }

    // 인증 에러 처리
    if (this.isAuthenticationError(error)) {
      return new AppError(
        'Authentication failed',
        'AUTHENTICATION_FAILED',
        context,
        operation,
        true,
        error
      );
    }

    // 권한 에러 처리
    if (this.isPermissionError(error)) {
      return new AppError(
        'Permission denied',
        'PERMISSION_DENIED',
        context,
        operation,
        true,
        error
      );
    }

    // 검증 에러 처리
    if (this.isValidationError(error)) {
      return new AppError(
        'Validation failed',
        'VALIDATION_ERROR',
        context,
        operation,
        true,
        error
      );
    }

    // 서버 에러 처리
    if (this.isServerError(error)) {
      return new AppError(
        'Server error occurred',
        'SERVER_ERROR',
        context,
        operation,
        true,
        error
      );
    }

    // 기타 에러
    return new AppError(
      error?.message || 'Unknown error occurred',
      'UNKNOWN_ERROR',
      context,
      operation,
      false,
      error
    );
  }

  /**
   * 사용자 친화적 에러 메시지 반환
   */
  getUserFriendlyMessage(error: AppError): string {
    return this.errorMap.get(error.code) || error.message;
  }

  /**
   * 네트워크 에러 판별
   */
  private isNetworkError(error: any): boolean {
    return (
      error?.name === 'NetworkError' ||
      error?.code === 'NETWORK_ERROR' ||
      error?.message?.includes('network') ||
      error?.message?.includes('fetch') ||
      error?.message?.includes('connection')
    );
  }

  /**
   * 인증 에러 판별
   */
  private isAuthenticationError(error: any): boolean {
    return (
      error?.status === 401 ||
      error?.code === 'UNAUTHORIZED' ||
      error?.message?.includes('unauthorized') ||
      error?.message?.includes('authentication')
    );
  }

  /**
   * 권한 에러 판별
   */
  private isPermissionError(error: any): boolean {
    return (
      error?.status === 403 ||
      error?.code === 'FORBIDDEN' ||
      error?.message?.includes('forbidden') ||
      error?.message?.includes('permission')
    );
  }

  /**
   * 검증 에러 판별
   */
  private isValidationError(error: any): boolean {
    return (
      error?.status === 400 ||
      error?.code === 'VALIDATION_ERROR' ||
      error?.message?.includes('validation') ||
      error?.message?.includes('invalid')
    );
  }

  /**
   * 서버 에러 판별
   */
  private isServerError(error: any): boolean {
    return (
      error?.status >= 500 ||
      error?.code === 'SERVER_ERROR' ||
      error?.message?.includes('server') ||
      error?.message?.includes('internal')
    );
  }

  /**
   * 에러 로깅
   */
  logError(error: AppError) {
    console.error('Application Error:', {
      code: error.code,
      context: error.context,
      operation: error.operation,
      message: error.message,
      userFriendly: error.userFriendly,
      originalError: error.originalError,
      timestamp: error.timestamp,
    });
  }
}
