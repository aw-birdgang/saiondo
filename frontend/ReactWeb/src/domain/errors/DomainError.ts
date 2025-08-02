// Base domain error class
export abstract class DomainError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }
}

// User domain errors
export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`, 'USER_NOT_FOUND', { userId });
  }
}

export class UserValidationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'USER_VALIDATION_ERROR', details);
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User with email ${email} already exists`, 'USER_ALREADY_EXISTS', { email });
  }
}

// Channel domain errors
export class ChannelNotFoundError extends DomainError {
  constructor(channelId: string) {
    super(`Channel with ID ${channelId} not found`, 'CHANNEL_NOT_FOUND', { channelId });
  }
}

export class ChannelValidationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CHANNEL_VALIDATION_ERROR', details);
  }
}

export class ChannelAccessDeniedError extends DomainError {
  constructor(channelId: string, userId: string) {
    super(`User ${userId} does not have access to channel ${channelId}`, 'CHANNEL_ACCESS_DENIED', { channelId, userId });
  }
}

export class ChannelMemberError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CHANNEL_MEMBER_ERROR', details);
  }
}

// Message domain errors
export class MessageNotFoundError extends DomainError {
  constructor(messageId: string) {
    super(`Message with ID ${messageId} not found`, 'MESSAGE_NOT_FOUND', { messageId });
  }
}

export class MessageValidationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'MESSAGE_VALIDATION_ERROR', details);
  }
}

export class MessageEditNotAllowedError extends DomainError {
  constructor(messageId: string, userId: string) {
    super(`User ${userId} cannot edit message ${messageId}`, 'MESSAGE_EDIT_NOT_ALLOWED', { messageId, userId });
  }
}

// Authentication errors
export class AuthenticationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'AUTHENTICATION_ERROR', details);
  }
}

export class AuthorizationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'AUTHORIZATION_ERROR', details);
  }
}

// Infrastructure errors
export class InfrastructureError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'INFRASTRUCTURE_ERROR', details);
  }
}

export class NetworkError extends InfrastructureError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', details);
  }
}

// Error factory for creating domain errors
export class DomainErrorFactory {
  static createUserNotFound(userId: string): UserNotFoundError {
    return new UserNotFoundError(userId);
  }

  static createUserValidation(message: string, details?: Record<string, unknown>): UserValidationError {
    return new UserValidationError(message, details);
  }

  static createChannelNotFound(channelId: string): ChannelNotFoundError {
    return new ChannelNotFoundError(channelId);
  }

  static createChannelValidation(message: string, details?: Record<string, unknown>): ChannelValidationError {
    return new ChannelValidationError(message, details);
  }

  static createMessageNotFound(messageId: string): MessageNotFoundError {
    return new MessageNotFoundError(messageId);
  }

  static createMessageValidation(message: string, details?: Record<string, unknown>): MessageValidationError {
    return new MessageValidationError(message, details);
  }

  static createMessageEditNotAllowed(messageId: string, userId: string): MessageEditNotAllowedError {
    return new MessageEditNotAllowedError(messageId, userId);
  }

  static createAuthentication(message: string, details?: Record<string, unknown>): AuthenticationError {
    return new AuthenticationError(message, details);
  }

  static createNetwork(message: string, details?: Record<string, unknown>): NetworkError {
    return new NetworkError(message, details);
  }
} 