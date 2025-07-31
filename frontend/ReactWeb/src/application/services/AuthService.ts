import { ApiClient } from '../../infrastructure/api/ApiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class AuthService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.apiClient.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('authToken', response.token);
    this.apiClient.setAuthToken(response.token);
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.apiClient.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('authToken', response.token);
    this.apiClient.setAuthToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      this.apiClient.removeAuthToken();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.apiClient.post<AuthResponse>('/auth/refresh');
    localStorage.setItem('authToken', response.token);
    this.apiClient.setAuthToken(response.token);
    return response;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
} 