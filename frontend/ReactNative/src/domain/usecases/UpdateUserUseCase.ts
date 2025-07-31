import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: Partial<User>): Promise<User> {
    try {
      if (!userData.id) {
        throw new Error('User ID is required for update');
      }
      
      return await this.userRepository.updateUser(userData);
    } catch (error) {
      console.error('UpdateUserUseCase error:', error);
      throw new Error('Failed to update user');
    }
  }
} 