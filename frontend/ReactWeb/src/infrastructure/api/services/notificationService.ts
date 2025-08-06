import { ApiClient } from '@/infrastructure/api/ApiClient';

const apiClient = new ApiClient();

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'channel' | 'system' | 'analysis';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface NotificationRequest {
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

export const notificationService = {
  // 알림 목록 조회
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: string;
  }): Promise<{ notifications: Notification[]; total: number }> => {
    return await apiClient.get<{
      notifications: Notification[];
      total: number;
    }>('/notifications', {
      params,
    });
  },

  // 알림 읽음 처리
  markAsRead: async (notificationId: string): Promise<{ success: boolean }> => {
    return await apiClient.patch<{ success: boolean }>(
      `/notifications/${notificationId}/read`
    );
  },

  // 모든 알림 읽음 처리
  markAllAsRead: async (): Promise<{ success: boolean }> => {
    return await apiClient.patch<{ success: boolean }>(
      '/notifications/read-all'
    );
  },

  // 알림 삭제
  deleteNotification: async (
    notificationId: string
  ): Promise<{ success: boolean }> => {
    return await apiClient.delete<{ success: boolean }>(
      `/notifications/${notificationId}`
    );
  },

  // 알림 설정 조회
  getNotificationSettings: async (): Promise<Record<string, boolean>> => {
    return await apiClient.get<Record<string, boolean>>(
      '/notifications/settings'
    );
  },

  // 알림 설정 업데이트
  updateNotificationSettings: async (
    settings: Record<string, boolean>
  ): Promise<Record<string, boolean>> => {
    return await apiClient.patch<Record<string, boolean>>(
      '/notifications/settings',
      settings
    );
  },
};
