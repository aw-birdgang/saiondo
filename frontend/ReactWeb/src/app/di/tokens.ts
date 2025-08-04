// Infrastructure Layer Tokens
export const API_CLIENT = Symbol('ApiClient');
export const WEBSOCKET_CLIENT = Symbol('WebSocketClient');

// Repository Tokens
export const USER_REPOSITORY = Symbol('UserRepository');
export const CHANNEL_REPOSITORY = Symbol('ChannelRepository');
export const MESSAGE_REPOSITORY = Symbol('MessageRepository');

// Service Tokens
export const AUTH_SERVICE = Symbol('AuthService');
export const USER_SERVICE = Symbol('UserService');
export const CHANNEL_SERVICE = Symbol('ChannelService');
export const MESSAGE_SERVICE = Symbol('MessageService');
export const FILE_SERVICE = Symbol('FileService');
export const NOTIFICATION_SERVICE = Symbol('NotificationService');

// Use Case Tokens
export const USER_USE_CASES = Symbol('UserUseCases');
export const CHANNEL_USE_CASES = Symbol('ChannelUseCases');
export const MESSAGE_USE_CASES = Symbol('MessageUseCases');
export const USE_CASE_FACTORY = Symbol('UseCaseFactory');

// Configuration Tokens
export const API_CONFIG = Symbol('ApiConfig');
export const WEBSOCKET_CONFIG = Symbol('WebSocketConfig');

// Store Tokens (for Zustand integration)
export const AUTH_STORE = Symbol('AuthStore');
export const THEME_STORE = Symbol('ThemeStore');
export const USER_STORE = Symbol('UserStore');
export const CHANNEL_STORE = Symbol('ChannelStore');
export const MESSAGE_STORE = Symbol('MessageStore');
export const UI_STORE = Symbol('UIStore');

// All tokens for type safety
export const DI_TOKENS = {
  // Infrastructure
  API_CLIENT,
  WEBSOCKET_CLIENT,
  
  // Repositories
  USER_REPOSITORY,
  CHANNEL_REPOSITORY,
  MESSAGE_REPOSITORY,
  
  // Services
  AUTH_SERVICE,
  USER_SERVICE,
  CHANNEL_SERVICE,
  MESSAGE_SERVICE,
  FILE_SERVICE,
  NOTIFICATION_SERVICE,
  
  // Use Cases
  USER_USE_CASES,
  CHANNEL_USE_CASES,
  MESSAGE_USE_CASES,
  USE_CASE_FACTORY,
  
  // Configuration
  API_CONFIG,
  WEBSOCKET_CONFIG,
  
  // Stores
  AUTH_STORE,
  THEME_STORE,
  USER_STORE,
  CHANNEL_STORE,
  MESSAGE_STORE,
  UI_STORE,
} as const;

export type DIToken = typeof DI_TOKENS[keyof typeof DI_TOKENS]; 