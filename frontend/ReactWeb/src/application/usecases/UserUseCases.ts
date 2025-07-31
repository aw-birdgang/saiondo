import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { User, UserProfile } from '../../domain/entities/User';

export class UserUseCases {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.userRepository.getCurrentUser();
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw new Error('Failed to get current user');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.getUserById(id);
    } catch (error) {
      console.error('Failed to get user by id:', error);
      throw new Error('Failed to get user');
    }
  }

  async updateUser(id: string, data: Partial<UserProfile>): Promise<User> {
    try {
      return await this.userRepository.updateUser(id, data);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userRepository.deleteUser(id);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Failed to delete user');
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      return await this.userRepository.searchUsers(query);
    } catch (error) {
      console.error('Failed to search users:', error);
      throw new Error('Failed to search users');
    }
  }
} 