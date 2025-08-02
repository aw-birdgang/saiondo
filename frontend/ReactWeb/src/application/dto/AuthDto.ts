/**
 * Authentication Use Case DTOs
 * 인증 관련 Request/Response 인터페이스
 */

export interface AuthenticateUserRequest {
  email: string;
  password: string;
}

export interface AuthenticateUserResponse {
  user: any; // User DTO
  accessToken: string;
  refreshToken: string;
}

export interface RegisterUserRequest {
  email: string;
  username: string;
  password: string;
  displayName?: string;
  avatar?: string;
}

export interface RegisterUserResponse {
  user: any; // User DTO
  accessToken: string;
  refreshToken: string;
}

export interface LogoutUserRequest {
  userId: string;
  accessToken: string;
}

export interface LogoutUserResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  isValid: boolean;
  userId?: string;
  error?: string;
}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
} 