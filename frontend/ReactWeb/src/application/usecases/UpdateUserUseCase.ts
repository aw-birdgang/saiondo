import type { IUserRepository } from '../repositories/IUserRepository';
import type { User } from '../entities/User';
import { DomainErrorFactory } from '../errors/DomainError';

export interface UpdateUserRequest {
  id: string;
  updates: Partial<User>;
}

export interface UpdateUserResponse {
  user: User;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      if (!request.id || request.id.trim().length === 0) {
        throw DomainErrorFactory.createUserValidation('User ID is required');
      }

      const updatedUser = await this.userRepository.update(request.id, request.updates);
      return { user: updatedUser.toJSON() };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update user');
    }
  }
} 