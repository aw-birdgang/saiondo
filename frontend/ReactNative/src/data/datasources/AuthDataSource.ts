import {
  LoginCredentials,
  AuthResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '../../domain/entities/Auth';

export interface AuthDataSource {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(request: RefreshTokenRequest): Promise<AuthResponse>;
  forgotPassword(request: ForgotPasswordRequest): Promise<void>;
  resetPassword(request: ResetPasswordRequest): Promise<void>;
  changePassword(request: ChangePasswordRequest): Promise<void>;
  validateToken(token: string): Promise<boolean>;
} 