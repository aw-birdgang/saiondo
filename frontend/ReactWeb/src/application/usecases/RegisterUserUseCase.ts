import type { IUserRepository } from '../repositories/IUserRepository';
import type { User } from '../entities/User';
import { UserEntity } from '../entities/User';
import { DomainErrorFactory } from '../errors/DomainError';

export interface RegisterUserRequest {
  email: string;
  username: string;
  password: string;
  displayName?: string;
  avatar?: string;
}

export interface RegisterUserResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    try {
      // Validate request
      if (!request.email || !this.isValidEmail(request.email)) {
        throw DomainErrorFactory.createUserValidation('Valid email is required');
      }

      if (!request.username || request.username.length < 2) {
        throw DomainErrorFactory.createUserValidation('Username must be at least 2 characters');
      }

      if (request.username.length > 20) {
        throw DomainErrorFactory.createUserValidation('Username must be less than 20 characters');
      }

      if (!request.password || request.password.length < 6) {
        throw DomainErrorFactory.createUserValidation('Password must be at least 6 characters');
      }

      // Check if email already exists
      const existingUserByEmail = await this.userRepository.findByEmail(request.email);
      if (existingUserByEmail) {
        throw DomainErrorFactory.createUserValidation('Email already exists');
      }

      // Check if username already exists (you might need to add this method to repository)
      // For now, we'll skip this check

      // Create user entity
      const userEntity = UserEntity.create({
        email: request.email,
        username: request.username,
        displayName: request.displayName,
        avatar: request.avatar,
        isOnline: true,
      });

      // Save user
      const savedUser = await this.userRepository.save(userEntity);

      // Generate tokens
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
      throw DomainErrorFactory.createUserValidation('Registration failed');
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