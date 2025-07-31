import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = unknown>(url: string, config?: Record<string, unknown>): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async delete<T = unknown>(url: string, config?: Record<string, unknown>): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }
} 