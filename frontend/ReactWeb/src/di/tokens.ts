// Infrastructure Layer Tokens
export const API_CLIENT = Symbol('ApiClient');
export const WEBSOCKET_CLIENT = Symbol('WebSocketClient');

// Repository Tokens
export const USER_REPOSITORY = Symbol('UserRepository');
export const CHANNEL_REPOSITORY = Symbol('ChannelRepository');
export const MESSAGE_REPOSITORY = Symbol('MessageRepository');
export const SYSTEM_REPOSITORY = Symbol('SystemRepository');

// Infrastructure Service Tokens
export const USER_INFRASTRUCTURE_SERVICE = Symbol('UserInfrastructureService');
export const CHANNEL_INFRASTRUCTURE_SERVICE = Symbol('ChannelInfrastructureService');
export const MESSAGE_INFRASTRUCTURE_SERVICE = Symbol('MessageInfrastructureService');
export const FILE_INFRASTRUCTURE_SERVICE = Symbol('FileInfrastructureService');
export const SYSTEM_INFRASTRUCTURE_SERVICE = Symbol('SystemInfrastructureService');

// Use Case Tokens
export const USER_USE_CASES = Symbol('UserUseCases');
export const CHANNEL_USE_CASES = Symbol('ChannelUseCases');
export const MESSAGE_USE_CASES = Symbol('MessageUseCases');
export const PAYMENT_USE_CASE = Symbol('PaymentUseCase');
export const SEARCH_USE_CASE = Symbol('SearchUseCase');
export const INVITE_USE_CASE = Symbol('InviteUseCase');
export const CATEGORY_USE_CASE = Symbol('CategoryUseCase');
export const USE_CASE_FACTORY = Symbol('UseCaseFactory');

// Individual Use Case Tokens (for backward compatibility)
export const GET_CURRENT_USER_USE_CASE = Symbol('GetCurrentUserUseCase');
export const UPDATE_USER_USE_CASE = Symbol('UpdateUserUseCase');
export const CREATE_CHANNEL_USE_CASE = Symbol('CreateChannelUseCase');
export const SEND_MESSAGE_USE_CASE = Symbol('SendMessageUseCase');
export const AUTHENTICATE_USER_USE_CASE = Symbol('AuthenticateUserUseCase');
export const REGISTER_USER_USE_CASE = Symbol('RegisterUserUseCase');
export const INVITE_TO_CHANNEL_USE_CASE = Symbol('InviteToChannelUseCase');
export const SEARCH_MESSAGES_USE_CASE = Symbol('SearchMessagesUseCase');
export const LOGOUT_USER_USE_CASE = Symbol('LogoutUserUseCase');
export const LEAVE_CHANNEL_USE_CASE = Symbol('LeaveChannelUseCase');
export const UPLOAD_FILE_USE_CASE = Symbol('UploadFileUseCase');
export const NOTIFICATION_USE_CASE = Symbol('NotificationUseCase');
export const USER_PERMISSION_USE_CASE = Symbol('UserPermissionUseCase');
export const CACHE_USE_CASE = Symbol('CacheUseCase');
export const REAL_TIME_CHAT_USE_CASE = Symbol('RealTimeChatUseCase');
export const FILE_DOWNLOAD_USE_CASE = Symbol('FileDownloadUseCase');
export const USER_ACTIVITY_LOG_USE_CASE = Symbol('UserActivityLogUseCase');
export const MONITORING_USE_CASE = Symbol('MonitoringUseCase');
export const REDIS_CACHE_USE_CASE = Symbol('RedisCacheUseCase');
export const WEB_SOCKET_USE_CASE = Symbol('WebSocketUseCase');
export const APM_MONITORING_USE_CASE = Symbol('APMMonitoringUseCase');
export const ANALYTICS_USE_CASE = Symbol('AnalyticsUseCase');
export const SYSTEM_MANAGEMENT_USE_CASE = Symbol('SystemManagementUseCase');
export const PROFILE_USE_CASE = Symbol('ProfileUseCase');

// Configuration Tokens
export const API_CONFIG = Symbol('ApiConfig');
export const WEBSOCKET_CONFIG = Symbol('WebSocketConfig');
export const I18N_CONFIG = Symbol('I18nConfig');

// Base Services Tokens
export const LOGGER = Symbol('Logger');
export const CACHE = Symbol('Cache');

// Service Tokens
export const AUTH_SERVICE = Symbol('AuthService');
export const USER_SERVICE = Symbol('UserService');
export const CHANNEL_SERVICE = Symbol('ChannelService');
export const MESSAGE_SERVICE = Symbol('MessageService');
export const FILE_SERVICE = Symbol('FileService');
export const NOTIFICATION_SERVICE = Symbol('NotificationService');
export const PROFILE_REPOSITORY = Symbol('ProfileRepository');

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
  SYSTEM_REPOSITORY,

  // Infrastructure Services
  USER_INFRASTRUCTURE_SERVICE,
  CHANNEL_INFRASTRUCTURE_SERVICE,
  MESSAGE_INFRASTRUCTURE_SERVICE,
  FILE_INFRASTRUCTURE_SERVICE,
  SYSTEM_INFRASTRUCTURE_SERVICE,

  // Use Cases
  USER_USE_CASES,
  CHANNEL_USE_CASES,
  MESSAGE_USE_CASES,
  PAYMENT_USE_CASE,
  SEARCH_USE_CASE,
  INVITE_USE_CASE,
  CATEGORY_USE_CASE,
  USE_CASE_FACTORY,

  // Individual Use Cases
  GET_CURRENT_USER_USE_CASE,
  UPDATE_USER_USE_CASE,
  CREATE_CHANNEL_USE_CASE,
  SEND_MESSAGE_USE_CASE,
  AUTHENTICATE_USER_USE_CASE,
  REGISTER_USER_USE_CASE,
  INVITE_TO_CHANNEL_USE_CASE,
  SEARCH_MESSAGES_USE_CASE,
  LOGOUT_USER_USE_CASE,
  LEAVE_CHANNEL_USE_CASE,
  UPLOAD_FILE_USE_CASE,
  NOTIFICATION_USE_CASE,
  USER_PERMISSION_USE_CASE,
  CACHE_USE_CASE,
  REAL_TIME_CHAT_USE_CASE,
  FILE_DOWNLOAD_USE_CASE,
  USER_ACTIVITY_LOG_USE_CASE,
  MONITORING_USE_CASE,
  REDIS_CACHE_USE_CASE,
  WEB_SOCKET_USE_CASE,
  APM_MONITORING_USE_CASE,
  ANALYTICS_USE_CASE,
  SYSTEM_MANAGEMENT_USE_CASE,
  PROFILE_USE_CASE,

  // Configuration
  API_CONFIG,
  WEBSOCKET_CONFIG,
  I18N_CONFIG,

  // Base Services
  LOGGER,
  CACHE,

  // Services
  AUTH_SERVICE,
  USER_SERVICE,
  CHANNEL_SERVICE,
  MESSAGE_SERVICE,
  FILE_SERVICE,
  NOTIFICATION_SERVICE,
  PROFILE_REPOSITORY,

  // Stores
  AUTH_STORE,
  THEME_STORE,
  USER_STORE,
  CHANNEL_STORE,
  MESSAGE_STORE,
  UI_STORE,
} as const;

export type DIToken = (typeof DI_TOKENS)[keyof typeof DI_TOKENS]; 