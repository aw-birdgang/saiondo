import type { User, UserProfile } from '../entities/User';
import type { IUserRepository } from '../repositories/IUserRepository';

export const createUpdateUserUseCase = (userRepository: IUserRepository) => {
  return async (id: string, userData: Partial<UserProfile>): Promise<User> => {
    try {
      return await userRepository.updateUser(id, userData);
    } catch (error) {
      console.error('UpdateUserUseCase error:', error);
      throw new Error('Failed to update user');
    }
  };
}; 