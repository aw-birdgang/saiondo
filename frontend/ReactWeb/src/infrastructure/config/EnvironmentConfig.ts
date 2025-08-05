export interface EnvironmentConfig {
  // API Configuration
  apiBaseUrl: string;
  apiTimeout: number;
  apiRetryAttempts: number;

  // WebSocket Configuration
  wsUrl: string;
  wsReconnectInterval: number;
  wsMaxReconnectAttempts: number;

  // Authentication Configuration
  authTokenKey: string;
  refreshTokenKey: string;
  tokenExpiryBuffer: number;

  // Cache Configuration
  cacheTTL: number;
  cachePrefix: string;

  // Feature Flags
  features: {
    realTimeChat: boolean;
    fileUpload: boolean;
    pushNotifications: boolean;
    analytics: boolean;
  };

  // External Services
  externalServices: {
    fileUploadUrl: string;
    analyticsUrl: string;
    monitoringUrl: string;
  };

  // Development Configuration
  isDevelopment: boolean;
  isProduction: boolean;
  enableDebugLogs: boolean;
}

export class EnvironmentConfigManager {
  private static instance: EnvironmentConfigManager;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): EnvironmentConfigManager {
    if (!EnvironmentConfigManager.instance) {
      EnvironmentConfigManager.instance = new EnvironmentConfigManager();
    }
    return EnvironmentConfigManager.instance;
  }

  getConfig(): EnvironmentConfig {
    return { ...this.config };
  }

  /**
   * 환경별 설정 로드
   */
  private loadConfig(): EnvironmentConfig {
    const env = import.meta.env.MODE;
    const isDevelopment = env === 'development';
    const isProduction = env === 'production';

    const baseConfig: EnvironmentConfig = {
      // API Configuration
      apiBaseUrl: this.getEnvVar(
        'VITE_API_BASE_URL',
        'http://localhost:3000/api'
      ),
      apiTimeout: parseInt(this.getEnvVar('VITE_API_TIMEOUT', '30000')),
      apiRetryAttempts: parseInt(
        this.getEnvVar('VITE_API_RETRY_ATTEMPTS', '3')
      ),

      // WebSocket Configuration
      wsUrl: this.getEnvVar('VITE_WS_URL', 'ws://localhost:3000/ws'),
      wsReconnectInterval: parseInt(
        this.getEnvVar('VITE_WS_RECONNECT_INTERVAL', '5000')
      ),
      wsMaxReconnectAttempts: parseInt(
        this.getEnvVar('VITE_WS_MAX_RECONNECT_ATTEMPTS', '5')
      ),

      // Authentication Configuration
      authTokenKey: this.getEnvVar('VITE_AUTH_TOKEN_KEY', 'auth_token'),
      refreshTokenKey: this.getEnvVar(
        'VITE_REFRESH_TOKEN_KEY',
        'refresh_token'
      ),
      tokenExpiryBuffer: parseInt(
        this.getEnvVar('VITE_TOKEN_EXPIRY_BUFFER', '300000')
      ), // 5 minutes

      // Cache Configuration
      cacheTTL: parseInt(this.getEnvVar('VITE_CACHE_TTL', '3600000')), // 1 hour
      cachePrefix: this.getEnvVar('VITE_CACHE_PREFIX', 'saiondo_cache_'),

      // Feature Flags
      features: {
        realTimeChat:
          this.getEnvVar('VITE_FEATURE_REAL_TIME_CHAT', 'true') === 'true',
        fileUpload:
          this.getEnvVar('VITE_FEATURE_FILE_UPLOAD', 'true') === 'true',
        pushNotifications:
          this.getEnvVar('VITE_FEATURE_PUSH_NOTIFICATIONS', 'true') === 'true',
        analytics: this.getEnvVar('VITE_FEATURE_ANALYTICS', 'false') === 'true',
      },

      // External Services
      externalServices: {
        fileUploadUrl: this.getEnvVar(
          'VITE_FILE_UPLOAD_URL',
          'https://api.saiondo.com/upload'
        ),
        analyticsUrl: this.getEnvVar(
          'VITE_ANALYTICS_URL',
          'https://analytics.saiondo.com'
        ),
        monitoringUrl: this.getEnvVar(
          'VITE_MONITORING_URL',
          'https://monitoring.saiondo.com'
        ),
      },

      // Development Configuration
      isDevelopment,
      isProduction,
      enableDebugLogs:
        this.getEnvVar(
          'VITE_ENABLE_DEBUG_LOGS',
          isDevelopment ? 'true' : 'false'
        ) === 'true',
    };

    // 환경별 설정 오버라이드
    if (isDevelopment) {
      return this.overrideForDevelopment(baseConfig);
    } else if (isProduction) {
      return this.overrideForProduction(baseConfig);
    }

    return baseConfig;
  }

  /**
   * 개발 환경 설정 오버라이드
   */
  private overrideForDevelopment(config: EnvironmentConfig): EnvironmentConfig {
    return {
      ...config,
      enableDebugLogs: true,
      features: {
        ...config.features,
        analytics: false, // 개발 환경에서는 분석 비활성화
      },
    };
  }

  /**
   * 프로덕션 환경 설정 오버라이드
   */
  private overrideForProduction(config: EnvironmentConfig): EnvironmentConfig {
    return {
      ...config,
      enableDebugLogs: false,
      features: {
        ...config.features,
        analytics: true, // 프로덕션 환경에서는 분석 활성화
      },
    };
  }

  /**
   * 환경 변수 조회 (기본값 포함)
   */
  private getEnvVar(key: string, defaultValue: string): string {
    const value = import.meta.env[key];
    return value !== undefined ? value : defaultValue;
  }

  /**
   * 설정 유효성 검증
   */
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = this.config;

    // 필수 설정 검증
    if (!config.apiBaseUrl) {
      errors.push('API base URL is required');
    }

    if (!config.wsUrl) {
      errors.push('WebSocket URL is required');
    }

    if (config.apiTimeout <= 0) {
      errors.push('API timeout must be greater than 0');
    }

    if (config.apiRetryAttempts < 0) {
      errors.push('API retry attempts must be non-negative');
    }

    if (config.wsReconnectInterval <= 0) {
      errors.push('WebSocket reconnect interval must be greater than 0');
    }

    if (config.wsMaxReconnectAttempts < 0) {
      errors.push('WebSocket max reconnect attempts must be non-negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 설정 리로드 (개발 환경에서만)
   */
  reloadConfig(): void {
    if (this.config.isDevelopment) {
      this.config = this.loadConfig();
      console.log('Configuration reloaded:', this.config);
    } else {
      console.warn(
        'Configuration reload is only available in development mode'
      );
    }
  }
}

export default EnvironmentConfigManager;
