import type { IUserRepository } from '../repositories/IUserRepository';
import type { User } from '../entities/User';
import { UserId } from '../value-objects/UserId';
import { DomainErrorFactory } from '../errors/DomainError';

export interface GetCurrentUserRequest {
  userId: string;
}

export interface GetCurrentUserResponse {
  user: User;
}

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: GetCurrentUserRequest): Promise<GetCurrentUserResponse> {
    try {
      const userId = UserId.create(request.userId);
      const user = await this.userRepository.findById(userId.getValue());
      
      if (!user) {
        throw DomainErrorFactory.createUserNotFound(userId.getValue());
      }

      return { user };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get current user');
    }
  }
} 