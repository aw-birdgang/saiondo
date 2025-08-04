import { AuthenticateUserUseCase } from '../usecases/AuthenticateUserUseCase';
import { RegisterUserUseCase } from '../usecases/RegisterUserUseCase';
import { LogoutUserUseCase } from '../usecases/LogoutUserUseCase';
import { GetCurrentUserUseCase } from '../usecases/GetCurrentUserUseCase';
import type { AuthenticateUserRequest, AuthenticateUserResponse, RegisterUserRequest, RegisterUserResponse, LogoutUserRequest } from '../dto/AuthDto';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  displayName?: string;
  avatar?: string;
}

export interface AuthResult {
  user: any; // User DTO
  accessToken: string;
  refreshToken: string;
}

export class AuthenticationService {
  constructor(
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private registerUserUseCase: RegisterUserUseCase,
    private logoutUserUseCase: LogoutUserUseCase,
    private getCurrentUserUseCase: GetCurrentUserUseCase
  ) {}

  async login(credentials: AuthCredentials): Promise<AuthResult> {
    try {
      const result = await this.authenticateUserUseCase.execute(credentials);
      
      return {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResult> {
    try {
      const result = await this.registerUserUseCase.execute(data);
      
      return {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async logout(userId: string, accessToken: string): Promise<void> {
    try {
      await this.logoutUserUseCase.execute({ userId, accessToken });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  async getCurrentUser(userId?: string): Promise<any | null> {
    try {
      const result = await this.getCurrentUserUseCase.execute({ userId });
      return result.user || null;
    } catch (error) {
      console.error('Get current user failed:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    // 토큰 존재 여부 확인
    const token = localStorage.getItem('auth_token');
    return !!token;
  }
}

export default AuthenticationService; 