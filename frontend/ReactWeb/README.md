# ReactWeb - Clean Architecture with Advanced DI Pattern

A modern React application built with TypeScript, Vite, and Clean Architecture principles, featuring an advanced Dependency Injection (DI) pattern with Zustand state management.

## 🏗️ Architecture Overview

This project follows Clean Architecture principles with an advanced DI pattern that provides:

- **Type-safe dependency injection** with Symbol-based tokens
- **Singleton and transient service management**
- **Configuration-driven service registration**
- **React hooks integration** for seamless DI usage
- **Testing utilities** for mock service injection

```
src/
├── app/                    # Application entry point
│   ├── di/                # Advanced DI container system
│   │   ├── container.ts   # Main DI container with lifecycle management
│   │   ├── tokens.ts      # Type-safe DI tokens
│   │   ├── config.ts      # Configuration interfaces and defaults
│   │   ├── useDI.ts       # React hooks for DI
│   │   ├── testUtils.ts   # Testing utilities
│   │   └── index.ts       # DI module exports
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication context
│   ├── ThemeContext.tsx   # Theme management context
│   ├── UserContext.tsx    # User data context
│   └── UseCaseContext.tsx # Use case dependency injection
├── stores/                # Zustand state stores
│   ├── authStore.ts       # Authentication state
│   ├── themeStore.ts      # Theme state
│   ├── userStore.ts       # User profile state
│   ├── channelStore.ts    # Channel management state
│   ├── messageStore.ts    # Message state
│   ├── uiStore.ts         # UI state (modals, notifications)
│   └── index.ts           # Store exports
├── application/           # Application layer
│   ├── usecases/          # Business logic use cases
│   └── services/          # Application services
├── domain/                # Domain layer
│   ├── entities/          # Core business entities
│   └── repositories/      # Repository interfaces
├── infrastructure/        # Infrastructure layer
│   ├── api/              # API client implementations
│   ├── repositories/     # Repository implementations
│   └── websocket/        # WebSocket client
├── presentation/          # Presentation layer
│   ├── pages/            # Route-based page components
│   ├── components/       # Reusable UI components
│   └── hooks/            # Custom hooks (Zustand + Context)
└── shared/               # Shared utilities
    ├── constants/        # Application constants
    └── utils/            # Utility functions
```

## 🚀 Key Features

### 🔧 Advanced DI Pattern
- **Type-safe tokens**: Symbol-based DI tokens for compile-time safety
- **Service lifecycle management**: Singleton and transient service support
- **Configuration-driven**: Environment-based service configuration
- **React integration**: Custom hooks for seamless DI usage in components
- **Testing support**: Comprehensive testing utilities with mock injection

### 📦 DI Container Features

#### Token-based Registration
```typescript
import { DI_TOKENS, container } from '../app/di';

// Register a service
container.register(DI_TOKENS.API_CLIENT, () => new ApiClient(config), true);

// Resolve a service
const apiClient = container.get<ApiClient>(DI_TOKENS.API_CLIENT);
```

#### Configuration Management
```typescript
import { createAppConfig, container } from '../app/di';

const config = createAppConfig({
  api: { baseURL: 'https://api.example.com' },
  environment: 'production'
});

container.updateConfig(config);
```

#### React Hooks Integration
```typescript
import { useDI, useUseCases, useServices } from '../app/di';

// Single service
const apiClient = useDI<ApiClient>(DI_TOKENS.API_CLIENT);

// Multiple services
const { userUseCases, channelUseCases } = useUseCases();

// Service categories
const { authService, notificationService } = useServices();
```

### 🔄 Hybrid State Management
- **Zustand Stores**: For complex state management with persistence
- **React Context**: For dependency injection and cross-cutting concerns
- **Custom Hooks**: Unified interface combining both approaches

### 📦 Zustand Stores

#### AuthStore
```typescript
const { user, isAuthenticated, login, logout } = useAuthStore();
```
- User authentication state
- Token management
- Persistent authentication

#### ThemeStore
```typescript
const { theme, isDarkMode, setTheme, toggleTheme } = useThemeStore();
```
- Light/Dark/System theme support
- Automatic theme persistence
- DOM class management

#### UserStore
```typescript
const { currentUser, selectedUser, updateUserProfile } = useUserStore();
```
- User profile management
- Partner user selection
- Profile preferences

#### ChannelStore
```typescript
const { channels, currentChannel, addChannel, joinChannel } = useChannelStore();
```
- Channel management
- Member management
- Real-time updates

#### MessageStore
```typescript
const { messages, sendMessage, addReaction } = useMessageStore();
```
- Message management
- Reactions support
- Channel-based organization

#### UIStore
```typescript
const { notifications, modals, setLoading } = useUIStore();
```
- Global UI state
- Notification management
- Modal management

### 🎣 Custom Hooks

#### useAuth
```typescript
const { user, isAuthenticated, login, logout, loading, error } = useAuth();
```
Combines Zustand store state with Context actions.

#### useUser
```typescript
const { currentUser, refreshUser, updateUser, loading } = useUser();
```
Unified user management with both store and context.

#### useTheme
```typescript
const { theme, isDarkMode, setTheme, toggleTheme } = useTheme();
```
Theme management with automatic DOM updates.

#### useChannels
```typescript
const { channels, createChannel, joinChannel, loading } = useChannels();
```
Channel management with Zustand store integration.

#### useMessages
```typescript
const { messages, sendMessage, addReaction, loading } = useMessages(channelId);
```
Message management with channel-specific state.

## 🛠️ Technology Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Zustand** - Lightweight state management
- **React Router DOM** - Client-side routing
- **React Query** - Server state management
- **React Hot Toast** - Notifications
- **Tailwind CSS** - Utility-first CSS framework

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 🧪 Testing

```bash
npm run test
```

## 📁 DI System Details

### Container (`src/app/di/container.ts`)
Advanced DI container with:
- **Service registration**: Factory-based service creation
- **Lifecycle management**: Singleton and transient services
- **Dependency resolution**: Automatic dependency injection
- **Configuration integration**: Environment-based configuration
- **Debug capabilities**: Service inspection and debugging

### Tokens (`src/app/di/tokens.ts`)
Type-safe DI tokens:
- **Symbol-based**: Unique, non-colliding identifiers
- **Type-safe**: Compile-time type checking
- **Categorized**: Organized by layer and responsibility
- **Extensible**: Easy to add new services

### Configuration (`src/app/di/config.ts`)
Configuration management:
- **Environment-specific**: Development, production, test configs
- **Type-safe**: Full TypeScript support
- **Extensible**: Easy to add new configuration options
- **Validation**: Runtime configuration validation

### React Hooks (`src/app/di/useDI.ts`)
React integration:
- **useDI**: Single service resolution
- **useDIMultiple**: Multiple service resolution
- **useUseCases**: Use case access
- **useRepositories**: Repository access
- **useServices**: Service access
- **useInfrastructure**: Infrastructure access
- **useStores**: Zustand store access
- **useConfig**: Configuration access

### Testing Utilities (`src/app/di/testUtils.ts`)
Testing support:
- **Mock services**: Pre-configured mock implementations
- **Test containers**: Isolated DI containers for testing
- **Mock registration**: Easy mock service injection
- **Reset utilities**: Clean test state management

## 🔄 DI Usage Patterns

### Service Registration
```typescript
// Register a singleton service
container.register(DI_TOKENS.API_CLIENT, () => new ApiClient(config), true);

// Register a transient service
container.register(DI_TOKENS.LOGGER, () => new Logger(), false);
```

### Service Resolution
```typescript
// Direct resolution
const apiClient = container.get<ApiClient>(DI_TOKENS.API_CLIENT);

// React hook resolution
const apiClient = useDI<ApiClient>(DI_TOKENS.API_CLIENT);
```

### Configuration Management
```typescript
// Update configuration
container.updateConfig({
  api: { baseURL: 'https://new-api.example.com' }
});

// Get current configuration
const config = container.getConfig();
```

### Testing
```typescript
import { createTestEnvironment } from '../app/di/testUtils';

const { container, mocks, reset } = createTestEnvironment();

// Use mocks in tests
mocks.apiClient.get.mockResolvedValue({ data: 'test' });

// Clean up after tests
afterEach(reset);
```

## 🎯 Benefits

- **Type Safety**: Full TypeScript support with compile-time checking
- **Testability**: Easy mock injection and isolated testing
- **Maintainability**: Clear separation of concerns and dependencies
- **Scalability**: Modular architecture that grows with your application
- **Performance**: Efficient service lifecycle management
- **Developer Experience**: Intuitive API and comprehensive tooling

## 🔧 Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=ws://localhost:3000
VITE_ENVIRONMENT=development
```

### DI Configuration
```typescript
const config = createAppConfig({
  api: {
    baseURL: 'https://api.example.com',
    timeout: 10000,
  },
  websocket: {
    url: 'wss://ws.example.com',
    options: { autoConnect: true }
  },
  environment: 'production',
  debug: false
});
```

## 📝 Usage Examples

### Authentication with DI
```typescript
const { authService } = useServices();
const { user, isAuthenticated } = useAuthStore();

const handleLogin = async () => {
  await authService.login({ email, password });
};
```

### Theme Management with DI
```typescript
const { theme, isDarkMode, toggleTheme } = useThemeStore();

return (
  <button onClick={toggleTheme}>
    {isDarkMode ? '🌞' : '🌙'}
  </button>
);
```

### Channel Management with DI
```typescript
const { channelUseCases } = useUseCases();
const { channels, createChannel } = useChannels();

const handleCreateChannel = async () => {
  await createChannel({ name: 'New Channel', type: 'public' });
};
```

This advanced DI pattern provides a robust, scalable, and maintainable foundation for modern React applications with powerful dependency management capabilities.
