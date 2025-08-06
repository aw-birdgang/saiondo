import { initializeFileUploadService } from '@/infrastructure/api/FileUploadService';
import { initializeWebSocket } from '@/infrastructure/websocket/WebSocketService';
import { initializePaymentService } from '@/infrastructure/payment/PaymentService';
import { initializePushNotificationService } from '@/infrastructure/notification/PushNotificationService';

// 서비스 초기화 함수
export const initializeServices = (token?: string) => {
  try {
    // 파일 업로드 서비스 초기화 (토큰이 있으면 인증된 상태로)
    if (token) {
      initializeFileUploadService(token);
    }

    // WebSocket 서비스 초기화 (토큰이 있으면 인증된 상태로)
    if (token) {
      initializeWebSocket({
        url: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001',
        token,
        reconnectInterval: 3000,
        maxReconnectAttempts: 5,
      });
    }

    // 결제 서비스 초기화 (토큰이 있으면 인증된 상태로)
    if (token) {
      initializePaymentService(token);
    }

    // 푸시 알림 서비스 초기화 (토큰이 있으면 인증된 상태로)
    if (token) {
      initializePushNotificationService(token);
    }

    console.log('Services initialized successfully', { hasToken: !!token });
  } catch (error) {
    console.error('Failed to initialize services:', error);
  }
};

// Container and core DI functionality
export { container, DIContainer, getContainer } from '@/di/container';
export { DI_TOKENS, type DIToken } from '@/di/tokens';
export {
  type ApiConfig,
  type WebSocketConfig,
  type I18nConfig,
  type AppConfig,
  defaultApiConfig,
  defaultWebSocketConfig,
  defaultI18nConfig,
  defaultAppConfig,
  createApiConfig,
  createWebSocketConfig,
  createI18nConfig,
  createAppConfig,
} from '@/di/config';

// React hooks for DI
export {
  useDI,
  useDIMultiple,
  useUseCases,
  useRepositories,
  useServices,
  useInfrastructure,
  useStores,
  useConfig,
} from '@/di/useDI';

// i18n and language utilities
export { default as i18n } from '@/di/i18n';
export {
  initializeLanguage,
  setLanguage,
  getCurrentLanguage,
  getLanguageName,
  getNativeLanguageName,
  availableLanguages,
} from '@/di/languageUtils';

// Re-export for convenience
export { container as di } from '@/di/container'; 