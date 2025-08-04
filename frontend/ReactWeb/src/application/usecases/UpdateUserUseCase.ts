import type {IUserRepository} from '../../domain/repositories/IUserRepository';
import {DomainErrorFactory} from '../../domain/errors/DomainError';
import type {UpdateUserRequest, UpdateUserResponse} from '../dto/UpdateUserDto';

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
