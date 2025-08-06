import type { UserSettings } from '@/presentation/pages/settings/types/settingsTypes';

// Mock 사용자 설정 데이터
export const MOCK_USER_SETTINGS: UserSettings = {
  id: '1',
  userId: 'user123',
  theme: 'system',
  language: 'ko',
  notifications: {
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: false,
    chatNotifications: true,
    channelNotifications: true,
    analysisNotifications: true,
    marketingNotifications: false,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
    },
  },
  privacy: {
    profileVisibility: 'friends',
    showOnlineStatus: true,
    allowFriendRequests: true,
    allowMessages: true,
    dataSharing: false,
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
    autoPlayVideos: false,
    showReadReceipts: true,
  },
  updatedAt: new Date().toISOString(),
};

// 설정 섹션 데이터
export const SETTINGS_SECTIONS = [
  {
    id: 'general',
    title: '일반',
    description: '기본 설정',
    icon: '⚙️',
  },
  {
    id: 'notifications',
    title: '알림',
    description: '알림 설정',
    icon: '🔔',
  },
  {
    id: 'privacy',
    title: '개인정보',
    description: '개인정보 보호',
    icon: '🔒',
  },
  {
    id: 'accessibility',
    title: '접근성',
    description: '접근성 설정',
    icon: '♿',
  },
  {
    id: 'display',
    title: '표시',
    description: '화면 표시 설정',
    icon: '🖥️',
  },
  {
    id: 'account',
    title: '계정',
    description: '계정 관리',
    icon: '👤',
  },
];

// 테마 옵션
export const THEME_OPTIONS = [
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
  { value: 'system', label: '시스템' },
];

// 언어 옵션
export const LANGUAGE_OPTIONS = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
];

// 폰트 크기 옵션
export const FONT_SIZE_OPTIONS = [
  { value: 'small', label: '작게' },
  { value: 'medium', label: '보통' },
  { value: 'large', label: '크게' },
];

// 색맹 옵션
export const COLOR_BLINDNESS_OPTIONS = [
  { value: 'none', label: '없음' },
  { value: 'protanopia', label: '적색맹' },
  { value: 'deuteranopia', label: '녹색맹' },
  { value: 'tritanopia', label: '청색맹' },
];

// 프로필 가시성 옵션
export const PROFILE_VISIBILITY_OPTIONS = [
  { value: 'public', label: '전체 공개' },
  { value: 'friends', label: '친구만' },
  { value: 'private', label: '비공개' },
];

// 시간 옵션 (조용한 시간)
export const TIME_OPTIONS = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

// 설정 저장 시뮬레이션 시간 (ms)
export const SETTINGS_SAVE_TIME = 1000;

// 설정 로딩 시뮬레이션 시간 (ms)
export const SETTINGS_LOAD_TIME = 500;
