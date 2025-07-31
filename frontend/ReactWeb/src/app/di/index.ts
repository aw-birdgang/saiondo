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