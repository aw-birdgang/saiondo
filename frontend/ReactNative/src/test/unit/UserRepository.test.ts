import { UserRepositoryImpl } from '../../data/repositories/UserRepositoryImpl';
import { UserDataSource } from '../../data/datasources/UserDataSource';
import { User } from '../../domain/entities/User';

// Mock the UserDataSource
const mockUserDataSource: jest.Mocked<UserDataSource> = {
  getCurrentUser: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  deleteUser: jest.fn(),
};

describe('UserRepositoryImpl', () => {
  let userRepository: UserRepositoryImpl;

  beforeEach(() => {
    userRepository = new UserRepositoryImpl(mockUserDataSource);
    jest.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return current user when data source returns user', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserDataSource.getCurrentUser.mockResolvedValue(mockUser);

      const result = await userRepository.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(mockUserDataSource.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should return null when data source returns null', async () => {
      mockUserDataSource.getCurrentUser.mockResolvedValue(null);

      const result = await userRepository.getCurrentUser();

      expect(result).toBeNull();
      expect(mockUserDataSource.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from data source', async () => {
      const error = new Error('Network error');
      mockUserDataSource.getCurrentUser.mockRejectedValue(error);

      await expect(userRepository.getCurrentUser()).rejects.toThrow('Network error');
      expect(mockUserDataSource.getCurrentUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserById', () => {
    it('should return user when data source returns user', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserDataSource.getUserById.mockResolvedValue(mockUser);

      const result = await userRepository.getUserById('1');

      expect(result).toEqual(mockUser);
      expect(mockUserDataSource.getUserById).toHaveBeenCalledWith('1');
    });

    it('should return null when user not found', async () => {
      mockUserDataSource.getUserById.mockResolvedValue(null);

      const result = await userRepository.getUserById('999');

      expect(result).toBeNull();
      expect(mockUserDataSource.getUserById).toHaveBeenCalledWith('999');
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Updated Name',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserDataSource.updateUser.mockResolvedValue(updatedUser);

      const result = await userRepository.updateUser({ id: '1', ...updateData });

      expect(result).toEqual(updatedUser);
      expect(mockUserDataSource.updateUser).toHaveBeenCalledWith({ id: '1', ...updateData });
    });
  });
}); 