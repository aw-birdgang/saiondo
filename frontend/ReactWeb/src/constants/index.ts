// App Constants
export const APP_NAME = "Saiondo";
export const APP_VERSION = "1.0.0";

// API Constants
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

// Firebase Config
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  USER_ID: "user_id",
  THEME: "theme",
  LANGUAGE: "language",
  PREFERENCES: "preferences",
} as const;

// Route Paths
export const ROUTES = {
  SPLASH: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/home",
  CHANNEL: "/channel",
  CALENDAR: "/calendar",
  MYPAGE: "/mypage",
  CHAT: "/chat",
  ANALYSIS: "/analysis",
  NOTIFICATIONS: "/notifications",
  INVITE_PARTNER: "/invite-partner",
  CHANNEL_INVITATIONS: "/channel-invitations",
  PAYMENT_SUBSCRIPTION: "/payment-subscription",
  CATEGORY_GUIDE: "/category-guide",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
  UNAUTHORIZED: "인증이 필요합니다.",
  FORBIDDEN: "접근 권한이 없습니다.",
  NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.",
  SERVER_ERROR: "서버 오류가 발생했습니다.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "로그인에 성공했습니다.",
  REGISTER_SUCCESS: "회원가입에 성공했습니다.",
  LOGOUT_SUCCESS: "로그아웃되었습니다.",
  SAVE_SUCCESS: "저장되었습니다.",
  DELETE_SUCCESS: "삭제되었습니다.",
} as const;
