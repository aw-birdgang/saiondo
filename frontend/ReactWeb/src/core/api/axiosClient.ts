import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

// Default configuration
const DEFAULT_CONFIG: ApiConfig = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://api.saiondo.com' 
    : 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Request/Response interceptors
export class AxiosClient {
  private axiosInstance: AxiosInstance;
  private config: ApiConfig;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.axiosInstance = axios.create(this.config);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request
        console.log(`[API][REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        if (config.params) {
          console.log(`[API][REQUEST][QUERY]`, config.params);
        }
        if (config.data) {
          console.log(`[API][REQUEST][BODY]`, config.data);
        }

        return config;
      },
      (error) => {
        console.error('[API][REQUEST][ERROR]', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`[API][RESPONSE] ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        console.error(`[API][ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
        console.error('[API][ERROR][DETAIL]', error.message);

        // Handle specific error cases
        if (error.response?.status === 401) {
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          localStorage.removeItem('user_id');
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // Update auth token
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  // Remove auth token
  removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common.Authorization;
  }

  // Get axios instance for advanced usage
  get instance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Create default instance
export const apiClient = new AxiosClient();

// Export for use in other files
export default apiClient; 