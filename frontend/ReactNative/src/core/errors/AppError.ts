export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code: string | undefined;
  public readonly details?: any;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.details = details;
  }

  static fromNetworkError(error: any): AppError {
    return new AppError(
      'Network error occurred',
      ErrorType.NETWORK,
      'NETWORK_ERROR',
      error
    );
  }

  static fromValidationError(message: string, details?: any): AppError {
    return new AppError(
      message,
      ErrorType.VALIDATION,
      'VALIDATION_ERROR',
      details
    );
  }

  static fromAuthenticationError(message: string = 'Authentication failed'): AppError {
    return new AppError(
      message,
      ErrorType.AUTHENTICATION,
      'AUTH_ERROR'
    );
  }

  static fromAuthorizationError(message: string = 'Access denied'): AppError {
    return new AppError(
      message,
      ErrorType.AUTHORIZATION,
      'FORBIDDEN'
    );
  }

  static fromNotFoundError(resource: string): AppError {
    return new AppError(
      `${resource} not found`,
      ErrorType.NOT_FOUND,
      'NOT_FOUND'
    );
  }

  static fromServerError(message: string = 'Server error occurred'): AppError {
    return new AppError(
      message,
      ErrorType.SERVER,
      'SERVER_ERROR'
    );
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      code: this.code,
      details: this.details,
    };
  }
} 