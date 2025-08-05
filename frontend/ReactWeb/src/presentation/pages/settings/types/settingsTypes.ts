export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en' | 'ja' | 'zh';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  display: DisplaySettings;
  updatedAt: string; // API에서 string으로 오므로 Date에서 string으로 변경
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

export interface SettingsState {
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  settings: UserSettings | null;
  hasUnsavedChanges: boolean;
}

export interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export interface SettingsItemProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export interface ToggleSettingProps {
  title: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export interface SelectSettingProps {
  title: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export interface TimeSettingProps {
  title: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export interface SettingsHeaderProps {
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  className?: string;
}

export interface SettingsContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
}

export interface SettingsContentProps {
  activeSection: string;
  settings: UserSettings | null;
  onSettingChange: (key: string, value: any) => void;
  onExportSettings?: () => void;
  onImportSettings?: () => void;
  className?: string;
}
