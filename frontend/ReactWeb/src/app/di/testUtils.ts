import { DIContainer } from './container';
import { DI_TOKENS } from './tokens';
import type { AppConfig } from './config';

/**
 * Creates a test DI container with mock services
 */
export const createTestContainer = (config?: Partial<AppConfig>): DIContainer => {
  const testConfig: AppConfig = {
    api: {
      baseURL: 'http://localhost:3000',
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
    },
    websocket: {
      url: 'ws://localhost:3000',
      options: {
        autoConnect: false,
        reconnection: false,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
      },
    },
    environment: 'test',
    debug: false,
    ...config,
  };

  return DIContainer.getInstance(testConfig);
};

/**
 * Mock service factory for testing
 */
export const createMockService = <T>(mockImplementation: T) => {
  return () => mockImplementation;
};

/**
 * Common mock services for testing
 */
export const mockServices = {
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  webSocketClient: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    emit: jest.fn(),
    on: jest.fn(),
  },
  userRepository: {
    getCurrentUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  },
  channelRepository: {
    getChannels: jest.fn(),
    createChannel: jest.fn(),
    updateChannel: jest.fn(),
    deleteChannel: jest.fn(),
  },
  messageRepository: {
    getMessages: jest.fn(),
    sendMessage: jest.fn(),
    updateMessage: jest.fn(),
    deleteMessage: jest.fn(),
  },
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getToken: jest.fn(),
  },
};

/**
 * Registers mock services in a test container
 */
export const registerMockServices = (container: DIContainer): void => {
  // Register mock infrastructure
  container.register(DI_TOKENS.API_CLIENT, createMockService(mockServices.apiClient), true);
  container.register(DI_TOKENS.WEBSOCKET_CLIENT, createMockService(mockServices.webSocketClient), true);

  // Register mock repositories
  container.register(DI_TOKENS.USER_REPOSITORY, createMockService(mockServices.userRepository), true);
  container.register(DI_TOKENS.CHANNEL_REPOSITORY, createMockService(mockServices.channelRepository), true);
  container.register(DI_TOKENS.MESSAGE_REPOSITORY, createMockService(mockServices.messageRepository), true);

  // Register mock services
  container.register(DI_TOKENS.AUTH_SERVICE, createMockService(mockServices.authService), true);
};

/**
 * Resets all mock functions
 */
export const resetMocks = (): void => {
  Object.values(mockServices).forEach(service => {
    if (typeof service === 'object' && service !== null) {
      Object.values(service).forEach(mock => {
        if (typeof mock === 'function' && 'mockReset' in mock) {
          (mock as jest.Mock).mockReset();
        }
      });
    }
  });
};

/**
 * Creates a test environment with DI container
 */
export const createTestEnvironment = (config?: Partial<AppConfig>) => {
  const container = createTestContainer(config);
  registerMockServices(container);
  
  return {
    container,
    mocks: mockServices,
    reset: () => {
      resetMocks();
      container.reset();
    },
  };
}; 