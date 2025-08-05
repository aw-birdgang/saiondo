import { ApiClient } from '../ApiClient';
import type { UserSettings } from '../../../domain/types';

const apiClient = new ApiClient();

export const settingsService = {
  // 사용자 설정 조회
  getUserSettings: async (): Promise<UserSettings> => {
    return await apiClient.get<UserSettings>('/settings');
  },

  // 사용자 설정 업데이트
  updateUserSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    return await apiClient.patch<UserSettings>('/settings', settings);
  },

  // 설정 초기화
  resetUserSettings: async (): Promise<UserSettings> => {
    return await apiClient.post<UserSettings>('/settings/reset');
  },

  // 특정 설정 섹션 업데이트
  updateSettingsSection: async (section: string, settings: Record<string, any>): Promise<UserSettings> => {
    return await apiClient.patch<UserSettings>(`/settings/${section}`, settings);
  }
}; 