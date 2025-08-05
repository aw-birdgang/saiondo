import { ApiClient } from '../../infrastructure/api/ApiClient';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
} from '../../domain/types';

export class AuthService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    this.apiClient.setAuthToken(response.data.accessToken);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    this.apiClient.setAuthToken(response.data.accessToken);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.apiClient.removeAuthToken();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const response =
      await this.apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh');
    this.apiClient.setAuthToken(response.data.accessToken);
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}
