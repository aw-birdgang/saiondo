import type { User } from '../entities/User';
import type { UserRepository } from '../repositories/UserRepository';

export class GetCurrentUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(): Promise<User | null> {
    try {
      return await this.userRepository.getCurrentUser();
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw new Error('Failed to get current user');
    }
  }
} 