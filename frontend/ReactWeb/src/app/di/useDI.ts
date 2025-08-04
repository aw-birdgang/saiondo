import { container } from './container';
import { DI_TOKENS, type DIToken } from './tokens';

export function useDI<T>(token: DIToken): T {
  return container.get<T>(token);
}

export function useDIMultiple<T>(tokens: DIToken[]): T[] {
  return tokens.map(token => container.get<T>(token));
}

export function useUseCases() {
  return {
    userUseCases: useDI(DI_TOKENS.USER_USE_CASES),
    channelUseCases: useDI(DI_TOKENS.CHANNEL_USE_CASES),
    messageUseCases: useDI(DI_TOKENS.MESSAGE_USE_CASES),
  };
}

export function useRepositories() {
  return {
    userRepository: useDI(DI_TOKENS.USER_REPOSITORY),
    channelRepository: useDI(DI_TOKENS.CHANNEL_REPOSITORY),
    messageRepository: useDI(DI_TOKENS.MESSAGE_REPOSITORY),
  };
}

export function useServices() {
  return {
    authService: useDI(DI_TOKENS.AUTH_SERVICE),
    userService: useDI(DI_TOKENS.USER_SERVICE),
    channelService: useDI(DI_TOKENS.CHANNEL_SERVICE),
    messageService: useDI(DI_TOKENS.MESSAGE_SERVICE),
    fileService: useDI(DI_TOKENS.FILE_SERVICE),
    notificationService: useDI(DI_TOKENS.NOTIFICATION_SERVICE),
  };
}

export function useInfrastructure() {
  return {
    apiClient: useDI(DI_TOKENS.API_CLIENT),
    webSocketClient: useDI(DI_TOKENS.WEBSOCKET_CLIENT),
  };
}

export function useAuthService() {
  return useDI(DI_TOKENS.AUTH_SERVICE);
}

export function useUserService() {
  return useDI(DI_TOKENS.USER_SERVICE);
}

export function useChannelService() {
  return useDI(DI_TOKENS.CHANNEL_SERVICE);
}

export function useMessageService() {
  return useDI(DI_TOKENS.MESSAGE_SERVICE);
}

export function useFileService() {
  return useDI(DI_TOKENS.FILE_SERVICE);
}

export function useNotificationService() {
  return useDI(DI_TOKENS.NOTIFICATION_SERVICE);
}

export function useApiClient() {
  return useDI(DI_TOKENS.API_CLIENT);
}

export function useWebSocketClient() {
  return useDI(DI_TOKENS.WEBSOCKET_CLIENT);
}

export function useConfig() {
  return {
    apiConfig: useDI(DI_TOKENS.API_CONFIG),
    webSocketConfig: useDI(DI_TOKENS.WEBSOCKET_CONFIG),
  };
}

export function useStores() {
  return {
    authStore: useDI(DI_TOKENS.AUTH_STORE),
    themeStore: useDI(DI_TOKENS.THEME_STORE),
    userStore: useDI(DI_TOKENS.USER_STORE),
    channelStore: useDI(DI_TOKENS.CHANNEL_STORE),
    messageStore: useDI(DI_TOKENS.MESSAGE_STORE),
    uiStore: useDI(DI_TOKENS.UI_STORE),
  };
} 