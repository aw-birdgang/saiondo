import type { UserService } from '../services/UserService';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type { AuthenticateUserRequest, AuthenticateUserResponse } from '../dto/AuthDto';

export class AuthenticateUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    try {
      // Validate request
      if (!request.email || !this.isValidEmail(request.email)) {
        throw DomainErrorFactory.createUserValidation('Valid email is required');
      }

      if (!request.password || request.password.length < 6) {
        throw DomainErrorFactory.createUserValidation('Password must be at least 6 characters');
      }

      // Use UserService to authenticate user
      const userProfile = await this.userService.getCurrentUser();
      
      // Update user status to online
      const updatedUserProfile = await this.userService.updateUserStatus(userProfile.id, 'online');

      // Generate tokens (in real implementation, this would use JWT)
      const accessToken = this.generateAccessToken(updatedUserProfile);
      const refreshToken = this.generateRefreshToken(updatedUserProfile);

      return {
        user: updatedUserProfile,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Authentication failed');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateAccessToken(user: any): string {
    // In real implementation, this would create a JWT token
    return `access_token_${user.id}_${Date.now()}`;
  }

  private generateRefreshToken(user: any): string {
    // In real implementation, this would create a refresh JWT token
    return `refresh_token_${user.id}_${Date.now()}`;
  }
} 