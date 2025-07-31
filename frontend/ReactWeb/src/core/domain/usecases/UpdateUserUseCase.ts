import type { User } from '../entities/User';
import type { UserRepository } from '../repositories/UserRepository';

export class UpdateUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData: Partial<User>): Promise<User> {
    try {
      return await this.userRepository.updateUser(userData);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('Failed to update user');
    }
  }
} 