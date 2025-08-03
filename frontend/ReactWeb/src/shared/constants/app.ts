export const APP_CONFIG = {
  NAME: 'Saiondo',
  VERSION: '1.0.0',
  DESCRIPTION: '사랑을 이어주는 커플 앱',
} as const;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const LANGUAGES = {
  KO: 'ko',
  EN: 'en',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  THEME: 'theme',
  LANGUAGE: 'language',
  USER_PREFERENCES: 'userPreferences',
} as const;

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  REGISTER: '/register',
  CHAT: '/chat',
  CHANNELS: '/channels',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ASSISTANT: '/assistant',
  ANALYSIS: '/analysis',
  CALENDAR: '/calendar',
  PAYMENT: '/payment',
  MYPAGE: '/mypage',
} as const;
