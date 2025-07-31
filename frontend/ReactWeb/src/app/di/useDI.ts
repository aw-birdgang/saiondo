import { useMemo } from 'react';
import { container } from './container';
import { DI_TOKENS, type DIToken } from './tokens';

/**
 * Custom hook for dependency injection in React components
 * @param token - The DI token to resolve
 * @returns The resolved service instance
 */
export function useDI<T>(token: DIToken): T {
  return useMemo(() => {
    return container.get<T>(token);
  }, [token]);
}

/**
 * Hook for getting multiple services at once
 * @param tokens - Array of DI tokens to resolve
 * @returns Array of resolved service instances
 */
export function useDIMultiple<T extends readonly DIToken[]>(
  tokens: T
): { [K in keyof T]: T[K] extends DIToken ? ReturnType<typeof container.get<T[K]>> : never } {
  return useMemo(() => {
    return tokens.map(token => container.get(token)) as any;
  }, [tokens]);
}

/**
 * Hook for getting use cases
 */
export function useUseCases() {
  return useMemo(() => ({
    userUseCases: container.get(DI_TOKENS.USER_USE_CASES),
    channelUseCases: container.get(DI_TOKENS.CHANNEL_USE_CASES),
    messageUseCases: container.get(DI_TOKENS.MESSAGE_USE_CASES),
  }), []);
}

/**
 * Hook for getting repositories
 */
export function useRepositories() {
  return useMemo(() => ({
    userRepository: container.get(DI_TOKENS.USER_REPOSITORY),
    channelRepository: container.get(DI_TOKENS.CHANNEL_REPOSITORY),
    messageRepository: container.get(DI_TOKENS.MESSAGE_REPOSITORY),
  }), []);
}

/**
 * Hook for getting services
 */
export function useServices() {
  return useMemo(() => ({
    authService: container.get(DI_TOKENS.AUTH_SERVICE),
    notificationService: container.get(DI_TOKENS.NOTIFICATION_SERVICE),
  }), []);
}

/**
 * Hook for getting infrastructure clients
 */
export function useInfrastructure() {
  return useMemo(() => ({
    apiClient: container.get(DI_TOKENS.API_CLIENT),
    webSocketClient: container.get(DI_TOKENS.WEBSOCKET_CLIENT),
  }), []);
}

/**
 * Hook for getting Zustand stores
 */
export function useStores() {
  return useMemo(() => ({
    authStore: container.get(DI_TOKENS.AUTH_STORE),
    themeStore: container.get(DI_TOKENS.THEME_STORE),
    userStore: container.get(DI_TOKENS.USER_STORE),
    channelStore: container.get(DI_TOKENS.CHANNEL_STORE),
    messageStore: container.get(DI_TOKENS.MESSAGE_STORE),
    uiStore: container.get(DI_TOKENS.UI_STORE),
  }), []);
}

/**
 * Hook for getting configuration
 */
export function useConfig() {
  return useMemo(() => ({
    apiConfig: container.get(DI_TOKENS.API_CONFIG),
    webSocketConfig: container.get(DI_TOKENS.WEBSOCKET_CONFIG),
    appConfig: container.getConfig(),
  }), []);
} 