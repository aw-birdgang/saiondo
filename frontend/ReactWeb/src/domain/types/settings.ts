// ============================================================================
// SETTINGS TYPES
// ============================================================================

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en' | 'ja' | 'zh';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  display: DisplaySettings;
  updatedAt: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  chatNotifications: boolean;
  channelNotifications: boolean;
  analysisNotifications: boolean;
  marketingNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  allowFriendRequests: boolean;
  allowMessages: boolean;
  dataSharing: boolean;
  analyticsEnabled: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface DisplaySettings {
  compactMode: boolean;
  showAvatars: boolean;
  showTimestamps: boolean;
  autoPlayVideos: boolean;
  showReadReceipts: boolean;
}

export interface SettingsUpdateRequest {
  theme?: 'light' | 'dark' | 'system';
  language?: 'ko' | 'en' | 'ja' | 'zh';
  notifications?: Partial<NotificationSettings>;
  privacy?: Partial<PrivacySettings>;
  accessibility?: Partial<AccessibilitySettings>;
  display?: Partial<DisplaySettings>;
}
