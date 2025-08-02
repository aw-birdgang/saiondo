import type { IUserRepository } from '../repositories/IUserRepository';
import { DomainErrorFactory } from '../errors/DomainError';

export interface LogoutUserRequest {
  userId: string;
}

export interface LogoutUserResponse {
  success: boolean;
  message: string;
}

export class LogoutUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: LogoutUserRequest): Promise<LogoutUserResponse> {
    try {
      // Validate request
      if (!request.userId || request.userId.trim().length === 0) {
        throw DomainErrorFactory.createUserValidation('User ID is required');
      }

      // Get user
      const user = await this.userRepository.findById(request.userId);
      if (!user) {
        throw DomainErrorFactory.createUserNotFound(request.userId);
      }

      // Update online status to offline
      await this.userRepository.updateOnlineStatus(request.userId, false);

      // In real implementation, you might also:
      // - Invalidate JWT tokens
      // - Clear session data
      // - Log the logout event
      // - Send notifications to other users

      return {
        success: true,
        message: 'User logged out successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Logout failed');
    }
  }
} 