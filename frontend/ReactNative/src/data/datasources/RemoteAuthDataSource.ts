import axios, { AxiosInstance } from 'axios';
import {
  LoginCredentials,
  AuthResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '../../domain/entities/Auth';
import { AuthDataSource } from './AuthDataSource';
import { API_CONFIG, API_ENDPOINTS } from '../../core/constants/ApiConfig';
import { logger } from '../../core/utils/Logger';
import { AppError } from '../../core/errors/AppError';

export class RemoteAuthDataSource implements AuthDataSource {
  private apiClient: AxiosInstance;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.apiClient = axios.create({
      baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.apiClient.interceptors.request.use(
      (config) => {
        logger.logAPIRequest(config.method?.toUpperCase() || 'GET', config.url || '', config.data);
        return config;
      },
      (error) => {
        logger.logAPIError('REQUEST', error.config?.url || '', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.apiClient.interceptors.response.use(
      (response) => {
        logger.logAPIResponse(
          response.config.method?.toUpperCase() || 'GET',
          response.config.url || '',
          response.status,
          response.data
        );
        return response;
      },
      (error) => {
        logger.logAPIError(
          error.config?.method?.toUpperCase() || 'GET',
          error.config?.url || '',
          error
        );
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private handleApiError(error: any): AppError {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return AppError.fromValidationError(data.message || 'Bad request');
        case 401:
          return AppError.fromAuthenticationError(data.message || 'Unauthorized');
        case 403:
          return AppError.fromAuthorizationError(data.message || 'Forbidden');
        case 404:
          return AppError.fromNotFoundError('Resource not found');
        case 500:
          return AppError.fromServerError(data.message || 'Internal server error');
        default:
          return AppError.fromServerError(data.message || 'Unknown error occurred');
      }
    } else if (error.request) {
      return AppError.fromNetworkError(error);
    } else {
      return AppError.fromServerError(error.message || 'Unknown error occurred');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return this.mapToAuthResponse(response.data);
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(request: RefreshTokenRequest): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post(API_ENDPOINTS.AUTH.REFRESH, request);
      return this.mapToAuthResponse(response.data);
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    try {
      await this.apiClient.post('/auth/forgot-password', request);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    try {
      await this.apiClient.post('/auth/reset-password', request);
    } catch (error) {
      throw error;
    }
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    try {
      await this.apiClient.post('/auth/change-password', request);
    } catch (error) {
      throw error;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.apiClient.post('/auth/validate', { token });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }

  private mapToAuthResponse(data: any): AuthResponse {
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        avatar: data.user.avatar,
        createdAt: new Date(data.user.createdAt),
        updatedAt: new Date(data.user.updatedAt),
      },
      token: {
        accessToken: data.token.accessToken,
        refreshToken: data.token.refreshToken,
        expiresIn: data.token.expiresIn,
        tokenType: data.token.tokenType,
      },
    };
  }
} 