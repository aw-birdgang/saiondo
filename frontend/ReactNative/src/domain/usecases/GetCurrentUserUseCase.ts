import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class GetCurrentUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User | null> {
    try {
      return await this.userRepository.getCurrentUser();
    } catch (error) {
      console.error('GetCurrentUserUseCase error:', error);
      throw new Error('Failed to get current user');
    }
  }
} 