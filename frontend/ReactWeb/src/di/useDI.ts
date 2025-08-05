import { useMemo } from 'react';
import { container } from './container';
import { DI_TOKENS, type DIToken } from './tokens';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useUserStore } from '../stores/userStore';
import { useChannelStore } from '../stores/channelStore';
import { useMessageStore } from '../stores/messageStore';
import { useUIStore } from '../stores/uiStore';

// Core DI hook
export const useDI = <T>(token: DIToken): T => {
  return useMemo(() => container.get<T>(token), [token]);
};

// Multiple DI hook
export const useDIMultiple = <T extends Record<string, DIToken>>(
  tokens: T
): { [K in keyof T]: ReturnType<typeof container.get<T[K]>> } => {
  return useMemo(() => {
    const result: any = {};
    Object.entries(tokens).forEach(([key, token]) => {
      result[key] = container.get(token);
    });
    return result;
  }, [tokens]);
};

// Use Cases hook
export const useUseCases = () => {
  return useMemo(() => ({
    user: container.get(DI_TOKENS.USER_USE_CASES),
    channel: container.get(DI_TOKENS.CHANNEL_USE_CASES),
    message: container.get(DI_TOKENS.MESSAGE_USE_CASES),
    payment: container.get(DI_TOKENS.PAYMENT_USE_CASE),
    search: container.get(DI_TOKENS.SEARCH_USE_CASE),
    invite: container.get(DI_TOKENS.INVITE_USE_CASE),
    category: container.get(DI_TOKENS.CATEGORY_USE_CASE),
  }), []);
};

// Repositories hook
export const useRepositories = () => {
  return useMemo(() => ({
    user: container.getUserRepository(),
    channel: container.getChannelRepository(),
    message: container.getMessageRepository(),
  }), []);
};

// Services hook
export const useServices = () => {
  return useMemo(() => ({
    auth: container.getAuthService(),
    user: container.getUserService(),
    channel: container.getChannelService(),
    message: container.getMessageService(),
    file: container.getFileService(),
    notification: container.getNotificationService(),
  }), []);
};

// Infrastructure hook
export const useInfrastructure = () => {
  return useMemo(() => ({
    apiClient: container.getApiClient(),
    webSocketClient: container.getWebSocketClient(),
    logger: container.getLogger(),
    cache: container.getCache(),
  }), []);
};

// Stores hook
export const useStores = () => {
  return useMemo(() => ({
    auth: useAuthStore,
    theme: useThemeStore,
    user: useUserStore,
    channel: useChannelStore,
    message: useMessageStore,
    ui: useUIStore,
  }), []);
};

// Configuration hook
export const useConfig = () => {
  return useMemo(() => container.getConfig(), []);
}; 