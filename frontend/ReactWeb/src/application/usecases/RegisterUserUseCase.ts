import type {IUserRepository} from '../../domain/repositories/IUserRepository';
import {UserEntity} from '../../domain/entities/User';
import {DomainErrorFactory} from '../../domain/errors/DomainError';
import type {RegisterUserRequest, RegisterUserResponse} from '../dto/RegisterUserDto';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    try {
      // Validate request
      if (!request.email || !this.isValidEmail(request.email)) {
        throw DomainErrorFactory.createUserValidation('Valid email is required');
      }

      if (!request.username || request.username.trim().length === 0) {
        throw DomainErrorFactory.createUserValidation('Username is required');
      }

      if (!request.password || request.password.length < 6) {
        throw DomainErrorFactory.createUserValidation('Password must be at least 6 characters');
      }

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(request.email);
      if (existingUser) {
        throw DomainErrorFactory.createUserValidation('User with this email already exists');
      }

      // Create user entity
      const userEntity = UserEntity.create({
        email: request.email,
        username: request.username,
        displayName: request.displayName,
        avatar: request.avatar,
        isOnline: false,
      });

      // Save user
      const savedUser = await this.userRepository.save(userEntity);

      // Generate tokens (in real implementation, this would use JWT)
      const accessToken = this.generateAccessToken(savedUser);
      const refreshToken = this.generateRefreshToken(savedUser);

      return {
        user: savedUser.toJSON(),
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
