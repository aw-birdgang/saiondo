import { apiClient } from '../ApiClient';
import { ENDPOINTS } from '../endpoints';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
} from '../../../domain/types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        ENDPOINTS.AUTH_LOGIN,
        credentials
      );

      // Store token in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '로그인 실패';
      throw new Error(`로그인 실패: ${message}`);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        ENDPOINTS.AUTH_REGISTER,
        userData
      );

      // Store token in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '회원가입 실패';
      throw new Error(`회원가입 실패: ${message}`);
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
