import type { User } from '../entities/User';
import type { IUserRepository } from '../repositories/IUserRepository';

export const createGetCurrentUserUseCase = (userRepository: IUserRepository) => {
  return async (): Promise<User | null> => {
    try {
      return await userRepository.getCurrentUser();
    } catch (error) {
      console.error('GetCurrentUserUseCase error:', error);
      throw new Error('Failed to get current user');
    }
  };
}; 