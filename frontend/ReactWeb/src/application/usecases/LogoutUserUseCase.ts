import type { UserService } from '../services/UserService';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type { LogoutUserRequest, LogoutUserResponse } from '../dto/LogoutUserDto';

export class LogoutUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(request: LogoutUserRequest): Promise<LogoutUserResponse> {
    try {
      // Validate request
      if (!request.userId || request.userId.trim().length === 0) {
        throw DomainErrorFactory.createUserValidation('User ID is required');
      }

      if (!request.accessToken || request.accessToken.trim().length === 0) {
        throw DomainErrorFactory.createUserValidation('Access token is required');
      }

      // Update user's online status using UserService
      await this.userService.updateUserStatus(request.userId, 'offline');

      // In real implementation, this would invalidate the token
      // For now, we'll just return success
      return {
        success: true,
        message: 'User logged out successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to logout user');
    }
  }
} 