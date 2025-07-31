import { LoginCredentials, AuthResponse } from '../entities/Auth';
import { AuthRepository } from '../repositories/AuthRepository';
import { AppError, ErrorType } from '../../core/errors/AppError';

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Validate input
      this.validateCredentials(credentials);

      // Execute login
      const authResponse = await this.authRepository.login(credentials);

      // Validate response
      this.validateAuthResponse(authResponse);

      return authResponse;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw AppError.fromAuthenticationError('Login failed');
    }
  }

  private validateCredentials(credentials: LoginCredentials): void {
    if (!credentials.email || !credentials.email.trim()) {
      throw AppError.fromValidationError('Email is required');
    }

    if (!credentials.password || !credentials.password.trim()) {
      throw AppError.fromValidationError('Password is required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw AppError.fromValidationError('Invalid email format');
    }

    // Password strength validation
    if (credentials.password.length < 6) {
      throw AppError.fromValidationError('Password must be at least 6 characters');
    }
  }

  private validateAuthResponse(authResponse: AuthResponse): void {
    if (!authResponse.user) {
      throw AppError.fromAuthenticationError('Invalid user data received');
    }

    if (!authResponse.token || !authResponse.token.accessToken) {
      throw AppError.fromAuthenticationError('Invalid token received');
    }

    if (!authResponse.user.id || !authResponse.user.email) {
      throw AppError.fromAuthenticationError('Invalid user information');
    }
  }
} 