import type { UserSettings } from '@/domain/types';

const SETTINGS_STORAGE_KEY = 'user_settings';

// 기본 설정값
const DEFAULT_SETTINGS: UserSettings = {
  id: 'local-settings',
  userId: 'local-user',
  theme: 'system',
  language: 'ko',
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    chatNotifications: true,
    channelNotifications: true,
    analysisNotifications: true,
    marketingNotifications: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  },
  privacy: {
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowFriendRequests: true,
    allowMessages: true,
    dataSharing: true,
    analyticsEnabled: true,
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    colorBlindness: 'none',
  },
  display: {
    compactMode: false,
    showAvatars: true,
    showTimestamps: true,
    autoPlayVideos: true,
    showReadReceipts: true,
  },
  updatedAt: new Date().toISOString(),
};

// 설정 변경 이벤트 리스너들
const settingsChangeListeners: Array<(settings: UserSettings) => void> = [];

// localStorage에서 설정 불러오기
const loadSettingsFromStorage = (): UserSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 기본값과 병합하여 누락된 필드 보완
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return DEFAULT_SETTINGS;
};

// localStorage에 설정 저장하기
const saveSettingsToStorage = (settings: UserSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));

    // 설정 변경 이벤트 발생
    settingsChangeListeners.forEach(listener => listener(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
};

// storage 이벤트 리스너 (다른 탭에서의 변경 감지)
const handleStorageChange = (e: StorageEvent) => {
  if (e.key === SETTINGS_STORAGE_KEY && e.newValue) {
    try {
      const newSettings = JSON.parse(e.newValue);
      settingsChangeListeners.forEach(listener => listener(newSettings));
    } catch (error) {
      console.warn('Failed to parse settings from storage event:', error);
    }
  }
};

// storage 이벤트 리스너 등록
if (typeof window !== 'undefined') {
  window.addEventListener('storage', handleStorageChange);
}

export const settingsService = {
  // 사용자 설정 조회 (로컬 캐시에서)
  getUserSettings: async (): Promise<UserSettings> => {
    // 실제로는 동기적이지만 API와의 일관성을 위해 Promise 반환
    return Promise.resolve(loadSettingsFromStorage());
  },

  // 사용자 설정 업데이트 (로컬 캐시에)
  updateUserSettings: async (
    settings: Partial<UserSettings>
  ): Promise<UserSettings> => {
    const currentSettings = loadSettingsFromStorage();
    const updatedSettings: UserSettings = {
      ...currentSettings,
      ...settings,
      updatedAt: new Date().toISOString(),
    };

    saveSettingsToStorage(updatedSettings);
    return Promise.resolve(updatedSettings);
  },

  // 설정 초기화 (기본값으로)
  resetUserSettings: async (): Promise<UserSettings> => {
    saveSettingsToStorage(DEFAULT_SETTINGS);
    return Promise.resolve(DEFAULT_SETTINGS);
  },

  // 특정 설정 섹션 업데이트
  updateSettingsSection: async (
    section: keyof UserSettings,
    settings: Record<string, any>
  ): Promise<UserSettings> => {
    const currentSettings = loadSettingsFromStorage();
    const sectionValue = currentSettings[section];

    if (typeof sectionValue === 'object' && sectionValue !== null) {
      const updatedSettings: UserSettings = {
        ...currentSettings,
        [section]: { ...sectionValue, ...settings },
        updatedAt: new Date().toISOString(),
      };

      saveSettingsToStorage(updatedSettings);
      return Promise.resolve(updatedSettings);
    }

    // 섹션이 객체가 아닌 경우 전체 설정을 업데이트
    const updatedSettings: UserSettings = {
      ...currentSettings,
      [section]: settings,
      updatedAt: new Date().toISOString(),
    };

    saveSettingsToStorage(updatedSettings);
    return Promise.resolve(updatedSettings);
  },

  // 동기적으로 설정 불러오기 (필요시 사용)
  getSettingsSync: (): UserSettings => {
    return loadSettingsFromStorage();
  },

  // 동기적으로 설정 저장하기 (필요시 사용)
  saveSettingsSync: (settings: UserSettings): void => {
    saveSettingsToStorage(settings);
  },

  // 설정 변경 리스너 등록
  onSettingsChange: (
    listener: (settings: UserSettings) => void
  ): (() => void) => {
    settingsChangeListeners.push(listener);

    // 리스너 제거 함수 반환
    return () => {
      const index = settingsChangeListeners.indexOf(listener);
      if (index > -1) {
        settingsChangeListeners.splice(index, 1);
      }
    };
  },

  // 설정 백업 (JSON 파일로 내보내기)
  exportSettings: (): string => {
    const settings = loadSettingsFromStorage();
    return JSON.stringify(settings, null, 2);
  },

  // 설정 복원 (JSON 파일에서 가져오기)
  importSettings: (jsonString: string): UserSettings => {
    try {
      const importedSettings = JSON.parse(jsonString);

      // 기본값과 병합하여 유효성 검증
      const validatedSettings: UserSettings = {
        ...DEFAULT_SETTINGS,
        ...importedSettings,
      };

      saveSettingsToStorage(validatedSettings);
      return validatedSettings;
    } catch (error) {
      console.error('Failed to import settings:', error);
      throw new Error('설정 파일 형식이 올바르지 않습니다.');
    }
  },

  // 설정 초기화 (모든 설정 삭제)
  clearSettings: (): void => {
    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      settingsChangeListeners.forEach(listener => listener(DEFAULT_SETTINGS));
    } catch (error) {
      console.error('Failed to clear settings:', error);
    }
  },
};
