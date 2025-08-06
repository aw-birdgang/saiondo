import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthenticationService } from '@/application/services/AuthenticationService';
import { AuthenticateUserUseCase } from '@/application/usecases/AuthenticateUserUseCase';
import { RegisterUserUseCase } from '@/application/usecases/RegisterUserUseCase';
import { LogoutUserUseCase } from '@/application/usecases/LogoutUserUseCase';
import { GetCurrentUserUseCase } from '@/application/usecases/GetCurrentUserUseCase';

// Mock Use Cases
const mockAuthenticateUserUseCase = {
  execute: vi.fn(),
} as unknown as AuthenticateUserUseCase;

const mockRegisterUserUseCase = {
  execute: vi.fn(),
} as unknown as RegisterUserUseCase;

const mockLogoutUserUseCase = {
  execute: vi.fn(),
} as unknown as LogoutUserUseCase;

const mockGetCurrentUserUseCase = {
  execute: vi.fn(),
} as unknown as GetCurrentUserUseCase;

describe('AuthenticationService', () => {
  let authService: AuthenticationService;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthenticationService(
      mockAuthenticateUserUseCase,
      mockRegisterUserUseCase,
      mockLogoutUserUseCase,
      mockGetCurrentUserUseCase
    );
  });

  describe('login', () => {
    it('should successfully authenticate user', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockResponse = {
        user: { id: '1', email: 'test@example.com', username: 'testuser' },
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_123',
      };

      mockAuthenticateUserUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await authService.login(credentials);

      // Assert
      expect(mockAuthenticateUserUseCase.execute).toHaveBeenCalledWith(
        credentials
      );
      expect(result).toEqual({
        user: mockResponse.user,
        accessToken: mockResponse.accessToken,
        refreshToken: mockResponse.refreshToken,
      });
    });

    it('should throw error when authentication fails', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const error = new Error('Invalid credentials');

      mockAuthenticateUserUseCase.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.login(credentials)).rejects.toThrow(
        'Invalid credentials'
      );
      expect(mockAuthenticateUserUseCase.execute).toHaveBeenCalledWith(
        credentials
      );
    });
  });

  describe('register', () => {
    it('should successfully register user', async () => {
      // Arrange
      const registerData = {
        email: 'new@example.com',
        password: 'password123',
        username: 'newuser',
        displayName: 'New User',
      };
      const mockResponse = {
        user: { id: '2', email: 'new@example.com', username: 'newuser' },
        accessToken: 'access_token_456',
        refreshToken: 'refresh_token_456',
      };

      mockRegisterUserUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await authService.register(registerData);

      // Assert
      expect(mockRegisterUserUseCase.execute).toHaveBeenCalledWith(
        registerData
      );
      expect(result).toEqual({
        user: mockResponse.user,
        accessToken: mockResponse.accessToken,
        refreshToken: mockResponse.refreshToken,
      });
    });

    it('should throw error when registration fails', async () => {
      // Arrange
      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        username: 'existinguser',
      };
      const error = new Error('User already exists');

      mockRegisterUserUseCase.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.register(registerData)).rejects.toThrow(
        'User already exists'
      );
      expect(mockRegisterUserUseCase.execute).toHaveBeenCalledWith(
        registerData
      );
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      // Arrange
      const userId = '1';
      const accessToken = 'access_token_123';

      mockLogoutUserUseCase.execute.mockResolvedValue(undefined);

      // Act
      await authService.logout(userId, accessToken);

      // Assert
      expect(mockLogoutUserUseCase.execute).toHaveBeenCalledWith({
        userId,
        accessToken,
      });
    });

    it('should throw error when logout fails', async () => {
      // Arrange
      const userId = '1';
      const accessToken = 'invalid_token';
      const error = new Error('Logout failed');

      mockLogoutUserUseCase.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.logout(userId, accessToken)).rejects.toThrow(
        'Logout failed'
      );
      expect(mockLogoutUserUseCase.execute).toHaveBeenCalledWith({
        userId,
        accessToken,
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '1';
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
      };
      const mockResponse = { user: mockUser };

      mockGetCurrentUserUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await authService.getCurrentUser(userId);

      // Assert
      expect(mockGetCurrentUserUseCase.execute).toHaveBeenCalledWith({
        userId,
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = '999';
      const mockResponse = { user: null };

      mockGetCurrentUserUseCase.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await authService.getCurrentUser(userId);

      // Assert
      expect(mockGetCurrentUserUseCase.execute).toHaveBeenCalledWith({
        userId,
      });
      expect(result).toBeNull();
    });

    it('should return null when error occurs', async () => {
      // Arrange
      const userId = '1';
      const error = new Error('Network error');

      mockGetCurrentUserUseCase.execute.mockRejectedValue(error);

      // Act
      const result = await authService.getCurrentUser(userId);

      // Assert
      expect(mockGetCurrentUserUseCase.execute).toHaveBeenCalledWith({
        userId,
      });
      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when auth token exists', () => {
      // Arrange
      const mockToken = 'valid_token';
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockToken);

      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(result).toBe(true);
      expect(localStorage.getItem).toHaveBeenCalledWith('auth_token');
    });

    it('should return false when auth token does not exist', () => {
      // Arrange
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(result).toBe(false);
      expect(localStorage.getItem).toHaveBeenCalledWith('auth_token');
    });
  });
});
