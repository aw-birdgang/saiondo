import type {IUserRepository} from '../../domain/repositories/IUserRepository';
import {UserId} from '../../domain/value-objects/UserId';
import {DomainErrorFactory} from '../../domain/errors/DomainError';
import type {GetCurrentUserRequest, GetCurrentUserResponse} from '../dto/GetCurrentUserDto';

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
