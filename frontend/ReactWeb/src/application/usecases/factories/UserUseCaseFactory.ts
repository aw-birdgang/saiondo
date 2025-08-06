import type { IUserRepository } from '@/application/usecases/interfaces/IUserRepository';
import type { IUserUseCase } from '@/application/usecases/interfaces/IUserUseCase';
import type { ICache } from '@/application/usecases/interfaces/ICache';
import { UserService } from '@/application/usecases/services/UserService';
import { UserUseCases } from '@/application/usecases/UserUseCases';

// 의존성 주입을 위한 팩토리 함수
export const createUserUseCase = (
  repository: IUserRepository,
  cache?: ICache
): IUserUseCase => {
  const service = new UserService(repository, cache);
  return new UserUseCases(service);
};

// 테스트를 위한 Mock 팩토리
export const createMockUserUseCase = (): IUserUseCase => {
  const mockRepository: IUserRepository = {
    createUser: async () => ({
      user: {
        id: 'mock-user-id',
        username: 'mock-user',
        email: 'mock@example.com',
        avatar: '',
        status: 'offline',
      },
    }),
    updateUser: async () => ({
      user: {
        id: 'mock-user-id',
        username: 'mock-user',
        email: 'mock@example.com',
        avatar: '',
        status: 'online',
      },
    }),
    getUser: async () => ({
      user: {
        id: 'mock-user-id',
        username: 'mock-user',
        email: 'mock@example.com',
        avatar: '',
        status: 'online',
      },
    }),
    searchUsers: async () => ({
      users: [],
      total: 0,
      hasMore: false,
    }),
    getCurrentUser: async () => ({
      user: {
        id: 'mock-user-id',
        username: 'mock-user',
        email: 'mock@example.com',
        avatar: '',
        status: 'online',
      },
    }),
    deleteUser: async () => true,
    getUserById: async () => ({
      user: {
        id: 'mock-user-id',
        username: 'mock-user',
        email: 'mock@example.com',
        avatar: '',
        status: 'online',
      },
    }),
    updateUserStatus: async () => true,
  };

  return createUserUseCase(mockRepository);
};
