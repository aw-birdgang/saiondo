import { initializeFileUploadService } from '../../infrastructure/api/FileUploadService';
import { initializeWebSocket } from '../../infrastructure/websocket/WebSocketService';
import { initializePaymentService } from '../../infrastructure/payment/PaymentService';
import { initializePushNotificationService } from '../../infrastructure/notification/PushNotificationService';

// 서비스 초기화 함수
export const initializeServices = (token: string) => {
  // 파일 업로드 서비스 초기화
  initializeFileUploadService(token);
  
  // WebSocket 서비스 초기화
  initializeWebSocket({
    url: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001',
    token,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5
  });
  
  // 결제 서비스 초기화
  initializePaymentService(token);
  
  // 푸시 알림 서비스 초기화
  initializePushNotificationService(token);
  
  console.log('All services initialized successfully');
};

// Container and core DI functionality
export { container, DIContainer, getContainer } from './container';
export { DI_TOKENS, type DIToken } from './tokens';
export { 
  type ApiConfig, 
  type WebSocketConfig, 
  type AppConfig,
  defaultApiConfig,
  defaultWebSocketConfig,
  defaultAppConfig,
  createApiConfig,
  createWebSocketConfig,
  createAppConfig,
} from './config';

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
} from './useDI';

// Re-export for convenience
export { container as di } from './container'; 