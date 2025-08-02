import type {IUserRepository} from '../../domain/repositories/IUserRepository';
import {DomainErrorFactory} from '../../domain/errors/DomainError';
import type {AuthenticateUserRequest, AuthenticateUserResponse} from '../dto/AuthDto';

export class AuthenticateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    try {
      // Validate request
      if (!request.email || !this.isValidEmail(request.email)) {
        throw DomainErrorFactory.createUserValidation('Valid email is required');
      }

      if (!request.password || request.password.length < 6) {
        throw DomainErrorFactory.createUserValidation('Password must be at least 6 characters');
      }

      // Find user by email
      const userEntity = await this.userRepository.findByEmail(request.email);
      if (!userEntity) {
        throw DomainErrorFactory.createUserNotFound('User not found');
      }

      // Validate password (in real implementation, this would hash and compare)
      // For now, we'll assume the password is valid if user exists
      if (!this.validatePassword(request.password, userEntity)) {
        throw DomainErrorFactory.createUserValidation('Invalid credentials');
      }

      // Update online status
      const updatedUser = await this.userRepository.updateOnlineStatus(userEntity.id, true);

      // Generate tokens (in real implementation, this would use JWT)
      const accessToken = this.generateAccessToken(updatedUser);
      const refreshToken = this.generateRefreshToken(updatedUser);

      return {
        user: updatedUser.toJSON(),
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

  private validatePassword(password: string, user: any): boolean {
    // In real implementation, this would hash the password and compare with stored hash
    // For now, we'll return true if user exists (mock validation)
    return true;
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