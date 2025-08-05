export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface WebSocketConfig {
  url: string;
  options: {
    autoConnect: boolean;
    reconnection: boolean;
    reconnectionAttempts: number;
    reconnectionDelay: number;
  };
}

export interface I18nConfig {
  defaultLanguage: string;
  fallbackLanguage: string;
  supportedLanguages: string[];
  debug: boolean;
}

export interface AppConfig {
  api: ApiConfig;
  websocket: WebSocketConfig;
  i18n: I18nConfig;
  environment: 'development' | 'production' | 'test';
  debug: boolean;
}

export const defaultApiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const defaultWebSocketConfig: WebSocketConfig = {
  url: import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3000',
  options: {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
};

export const defaultI18nConfig: I18nConfig = {
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  supportedLanguages: ['en', 'ko'],
  debug: import.meta.env.DEV,
};

export const defaultAppConfig: AppConfig = {
  api: defaultApiConfig,
  websocket: defaultWebSocketConfig,
  i18n: defaultI18nConfig,
  environment:
    (import.meta.env.MODE as AppConfig['environment']) || 'development',
  debug: import.meta.env.DEV,
};

export const createApiConfig = (overrides?: Partial<ApiConfig>): ApiConfig => ({
  ...defaultApiConfig,
  ...overrides,
});

export const createWebSocketConfig = (
  overrides?: Partial<WebSocketConfig>
): WebSocketConfig => ({
  ...defaultWebSocketConfig,
  ...overrides,
});

export const createI18nConfig = (overrides?: Partial<I18nConfig>): I18nConfig => ({
  ...defaultI18nConfig,
  ...overrides,
});

export const createAppConfig = (overrides?: Partial<AppConfig>): AppConfig => ({
  ...defaultAppConfig,
  ...overrides,
}); 