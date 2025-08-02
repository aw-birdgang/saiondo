import type { IUserRepository } from '../repositories/IUserRepository';
import type { User } from '../entities/User';
import { UserId } from '../value-objects/UserId';
import { DomainErrorFactory } from '../errors/DomainError';

export interface GetCurrentUserRequest {
  userId?: string; // Optional for current user
}

export interface GetCurrentUserResponse {
  user: User;
}

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request?: GetCurrentUserRequest): Promise<GetCurrentUserResponse> {
    try {
      let user;
      
      if (request?.userId) {
        // Get specific user by ID
        const userId = UserId.create(request.userId);
        user = await this.userRepository.findById(userId.getValue());
      } else {
        // Get current user
        user = await this.userRepository.getCurrentUser();
      }
      
      if (!user) {
        const errorId = request?.userId || 'current user';
        throw DomainErrorFactory.createUserNotFound(errorId);
      }

      return { user: user.toJSON() };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get current user');
    }
  }
} 