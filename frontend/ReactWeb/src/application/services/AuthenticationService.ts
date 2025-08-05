import { AuthenticateUserUseCase } from '../usecases/AuthenticateUserUseCase';
import { RegisterUserUseCase } from '../usecases/RegisterUserUseCase';
import { LogoutUserUseCase } from '../usecases/LogoutUserUseCase';
import { GetCurrentUserUseCase } from '../usecases/GetCurrentUserUseCase';
import type { User } from '../../domain/dto/UserDto';

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
  user: User;
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
      throw error;
    }
  }

  async logout(userId: string, accessToken: string): Promise<void> {
    try {
      await this.logoutUserUseCase.execute({ userId, accessToken });
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(userId?: string): Promise<User | null> {
    try {
      const result = await this.getCurrentUserUseCase.execute({ userId });
      return result.user || null;
    } catch (error) {
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
