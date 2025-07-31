import { apiClient } from './axiosClient';
import { Endpoints } from './endpoints';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  gender: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    gender?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  error?: string;
}

// Auth API class
export class AuthApi {
  /**
   * 로그인
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(Endpoints.authLogin, {
        email,
        password,
      });
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '로그인 실패';
      throw new Error(`로그인 실패: ${message}`);
    }
  }

  /**
   * 회원가입
   */
  static async register(email: string, password: string, name: string, gender: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(Endpoints.authRegister, {
        email,
        password,
        name,
        gender,
      });
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '회원가입 실패';
      throw new Error(`회원가입 실패: ${message}`);
    }
  }

  /**
   * 토큰 검증
   */
  static async verifyToken(): Promise<boolean> {
    try {
      await apiClient.get('/auth/verify');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 로그아웃
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // 로그아웃 실패해도 클라이언트에서 토큰을 제거
      console.warn('Logout API call failed, but clearing local tokens');
    }
  }

  /**
   * 비밀번호 재설정 요청
   */
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '비밀번호 재설정 요청 실패';
      throw new Error(`비밀번호 재설정 요청 실패: ${message}`);
    }
  }

  /**
   * 비밀번호 재설정
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '비밀번호 재설정 실패';
      throw new Error(`비밀번호 재설정 실패: ${message}`);
    }
  }

  /**
   * 프로필 업데이트
   */
  static async updateProfile(userId: string, data: Partial<{ name: string; gender: string }>): Promise<AuthResponse['user']> {
    try {
      const response = await apiClient.put<AuthResponse['user']>(Endpoints.userById(userId), data);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '프로필 업데이트 실패';
      throw new Error(`프로필 업데이트 실패: ${message}`);
    }
  }

  /**
   * 사용자 정보 조회
   */
  static async getUserProfile(userId: string): Promise<AuthResponse['user']> {
    try {
      const response = await apiClient.get<AuthResponse['user']>(Endpoints.userById(userId));
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '사용자 정보 조회 실패';
      throw new Error(`사용자 정보 조회 실패: ${message}`);
    }
  }
} 