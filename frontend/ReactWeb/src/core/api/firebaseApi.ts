import { apiClient } from './axiosClient';
import { Endpoints } from './endpoints';

// Types
export interface FCMTokenRequest {
  token: string;
}

export interface FCMTokenResponse {
  success: boolean;
  message: string;
}

// Firebase API class
export class FirebaseApi {
  /**
   * FCM 토큰 등록
   */
  static async registerFCMToken(userId: string, token: string): Promise<FCMTokenResponse> {
    try {
      const response = await apiClient.post<FCMTokenResponse>(
        Endpoints.userFcmToken(userId),
        { token }
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'FCM 토큰 등록 실패';
      throw new Error(`FCM 토큰 등록 실패: ${message}`);
    }
  }

  /**
   * FCM 토큰 삭제
   */
  static async unregisterFCMToken(userId: string): Promise<FCMTokenResponse> {
    try {
      const response = await apiClient.delete<FCMTokenResponse>(
        Endpoints.userFcmToken(userId)
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'FCM 토큰 삭제 실패';
      throw new Error(`FCM 토큰 삭제 실패: ${message}`);
    }
  }

  /**
   * FCM 토큰 업데이트
   */
  static async updateFCMToken(userId: string, token: string): Promise<FCMTokenResponse> {
    try {
      const response = await apiClient.put<FCMTokenResponse>(
        Endpoints.userFcmToken(userId),
        { token }
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'FCM 토큰 업데이트 실패';
      throw new Error(`FCM 토큰 업데이트 실패: ${message}`);
    }
  }

  /**
   * FCM 토큰 상태 확인
   */
  static async checkFCMTokenStatus(userId: string): Promise<{
    registered: boolean;
    lastUpdated?: string;
  }> {
    try {
      const response = await apiClient.get(
        `${Endpoints.userFcmToken(userId)}/status`
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'FCM 토큰 상태 확인 실패';
      throw new Error(`FCM 토큰 상태 확인 실패: ${message}`);
    }
  }
} 