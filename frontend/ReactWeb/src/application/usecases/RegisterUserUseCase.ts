import type { UserService } from '../services/UserService';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  RegisterUserRequest,
  RegisterUserResponse,
} from '../dto/RegisterUserDto';

export class RegisterUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    try {
      // Validate request
      if (!request.email || !this.isValidEmail(request.email)) {
        throw DomainErrorFactory.createUserValidation(
          'Valid email is required'
        );
      }

      if (!request.username || request.username.trim().length === 0) {
        throw DomainErrorFactory.createUserValidation('Username is required');
      }

      if (!request.password || request.password.length < 6) {
        throw DomainErrorFactory.createUserValidation(
          'Password must be at least 6 characters'
        );
      }

      // Use UserService to create user
      const userProfile = await this.userService.updateUserProfile('', {
        username: request.username,
        email: request.email,
        avatar: request.avatar,
        status: 'offline',
      });

      // Generate tokens (in real implementation, this would use JWT)
      const accessToken = this.generateAccessToken(userProfile);
      const refreshToken = this.generateRefreshToken(userProfile);

      return {
        user: userProfile,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to register user');
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
