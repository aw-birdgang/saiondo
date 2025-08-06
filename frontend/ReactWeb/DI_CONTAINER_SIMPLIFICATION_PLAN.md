# DI Container 단순화 계획 (이중 구조 → 단일 구조)

## 📊 **현재 DI Container 분석**

### 현재 구조
```
src/di/
├── container.ts           # 메인 DI Container (16KB, 509 lines)
├── tokens.ts             # DI 토큰 정의 (5.2KB, 154 lines)
├── config.ts             # 설정 관리 (2.0KB, 86 lines)
├── UseCaseRegistry.ts    # Use Case 레지스트리 (12KB, 422 lines)
├── useDI.ts              # React Hook (2.6KB, 88 lines)
├── index.ts              # Export 파일 (2.2KB, 82 lines)
├── i18n.ts               # 국제화 설정 (605B, 28 lines)
├── languageUtils.ts      # 언어 유틸리티 (1.4KB, 43 lines)
└── README.md             # 문서 (10KB, 351 lines)
```

### 문제점 분석
1. **복잡한 Container 구조**: 509줄의 거대한 Container 클래스
2. **과도한 토큰**: 154줄의 토큰 정의
3. **복잡한 UseCaseRegistry**: 422줄의 레지스트리 로직
4. **중복된 기능**: 여러 파일에 분산된 DI 관련 로직

## 🎯 **단순화 후 구조**

### 1. **단일 DI Container** - `container.ts`
```typescript
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();
  private factories: Map<string, () => any> = new Map();

  // 싱글톤 패턴
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // 서비스 등록
  register<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  // 서비스 해결
  resolve<T>(token: string): T {
    if (this.services.has(token)) {
      return this.services.get(token);
    }

    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(`Service not found: ${token}`);
    }

    const instance = factory();
    this.services.set(token, instance);
    return instance;
  }

  // Use Case 생성
  createUseCase<T>(useCaseType: string): T {
    return this.resolve<T>(`USE_CASE_${useCaseType}`);
  }

  // 초기화
  initialize(): void {
    this.registerDefaultServices();
    this.registerUseCases();
  }

  private registerDefaultServices(): void {
    // Repository 등록
    this.register('USER_REPOSITORY', () => new UserRepositoryImpl());
    this.register('CHANNEL_REPOSITORY', () => new ChannelRepositoryImpl());
    this.register('MESSAGE_REPOSITORY', () => new MessageRepositoryImpl());
    this.register('FILE_REPOSITORY', () => new FileRepositoryImpl());

    // External Services 등록
    this.register('API_CLIENT', () => new ApiClient());
    this.register('WEBSOCKET_CLIENT', () => new WebSocketClient());
    this.register('CACHE_SERVICE', () => new RedisCache());
  }

  private registerUseCases(): void {
    // Use Case 등록
    this.register('USE_CASE_USER', () => new UserUseCase(
      this.resolve('USER_REPOSITORY')
    ));
    this.register('USE_CASE_CHANNEL', () => new ChannelUseCase(
      this.resolve('CHANNEL_REPOSITORY')
    ));
    this.register('USE_CASE_MESSAGE', () => new MessageUseCase(
      this.resolve('MESSAGE_REPOSITORY')
    ));
    this.register('USE_CASE_FILE', () => new FileUseCase(
      this.resolve('FILE_REPOSITORY')
    ));
    this.register('USE_CASE_SYSTEM', () => new SystemUseCase(
      this.resolve('API_CLIENT'),
      this.resolve('CACHE_SERVICE')
    ));
  }
}
```

### 2. **단순화된 토큰** - `tokens.ts`
```typescript
export const DI_TOKENS = {
  // Repository Tokens
  USER_REPOSITORY: 'USER_REPOSITORY',
  CHANNEL_REPOSITORY: 'CHANNEL_REPOSITORY',
  MESSAGE_REPOSITORY: 'MESSAGE_REPOSITORY',
  FILE_REPOSITORY: 'FILE_REPOSITORY',

  // External Service Tokens
  API_CLIENT: 'API_CLIENT',
  WEBSOCKET_CLIENT: 'WEBSOCKET_CLIENT',
  CACHE_SERVICE: 'CACHE_SERVICE',

  // Use Case Tokens
  USE_CASE_USER: 'USE_CASE_USER',
  USE_CASE_CHANNEL: 'USE_CASE_CHANNEL',
  USE_CASE_MESSAGE: 'USE_CASE_MESSAGE',
  USE_CASE_FILE: 'USE_CASE_FILE',
  USE_CASE_SYSTEM: 'USE_CASE_SYSTEM',
} as const;

export type DIToken = typeof DI_TOKENS[keyof typeof DI_TOKENS];
```

### 3. **단순화된 Use Case Factory** - `UseCaseFactory.ts`
```typescript
import { DIContainer } from './container';

export class UseCaseFactory {
  private static container = DIContainer.getInstance();

  // User Use Cases
  static createUserUseCase() {
    return this.container.createUseCase('USER');
  }

  // Channel Use Cases
  static createChannelUseCase() {
    return this.container.createUseCase('CHANNEL');
  }

  // Message Use Cases
  static createMessageUseCase() {
    return this.container.createUseCase('MESSAGE');
  }

  // File Use Cases
  static createFileUseCase() {
    return this.container.createUseCase('FILE');
  }

  // System Use Cases
  static createSystemUseCase() {
    return this.container.createUseCase('SYSTEM');
  }

  // 모든 Use Case 생성
  static createAllUseCases() {
    return {
      user: this.createUserUseCase(),
      channel: this.createChannelUseCase(),
      message: this.createMessageUseCase(),
      file: this.createFileUseCase(),
      system: this.createSystemUseCase(),
    };
  }
}
```

### 4. **단순화된 React Hook** - `useDI.ts`
```typescript
import { useContext, createContext } from 'react';
import { DIContainer } from './container';

const DIContext = createContext<DIContainer | null>(null);

export const DIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const container = DIContainer.getInstance();
  
  return (
    <DIContext.Provider value={container}>
      {children}
    </DIContext.Provider>
  );
};

export const useDI = () => {
  const container = useContext(DIContext);
  if (!container) {
    throw new Error('useDI must be used within DIProvider');
  }
  return container;
};

export const useUseCase = <T>(useCaseType: string): T => {
  const container = useDI();
  return container.createUseCase<T>(useCaseType);
};
```

## 🔧 **구현 단계**

### Phase 1: 기존 구조 분석 (1일)
1. 현재 DI Container 구조 분석
2. 중복 및 불필요한 코드 식별
3. 의존성 관계 매핑

### Phase 2: 새로운 Container 설계 (2일)
1. 단순화된 Container 클래스 설계
2. 토큰 구조 단순화
3. Factory 패턴 단순화

### Phase 3: 기존 코드 마이그레이션 (3일)
1. 새로운 Container로 서비스 등록
2. Use Case 등록 로직 업데이트
3. React Hook 업데이트

### Phase 4: 기존 파일 정리 (1일)
1. 불필요한 파일 제거
2. 중복 코드 제거
3. 문서 업데이트

### Phase 5: 테스트 및 검증 (2일)
1. DI Container 단위 테스트
2. Use Case 생성 테스트
3. React Hook 테스트

## 📈 **예상 효과**

### 코드 복잡성 감소
- Container 코드: 509줄 → 150줄 (70% 감소)
- 토큰 정의: 154줄 → 20줄 (87% 감소)
- UseCaseRegistry: 422줄 → 50줄 (88% 감소)

### 성능 향상
- 서비스 해결 속도 향상
- 메모리 사용량 감소
- 초기화 시간 단축

### 유지보수성 향상
- 단순한 구조로 이해도 향상
- 의존성 관리 용이
- 디버깅 편의성 증대

## 🚀 **사용 예시**

### React Component에서 사용
```typescript
import { useUseCase } from '../di/useDI';

const UserComponent = () => {
  const userUseCase = useUseCase('USER');
  const channelUseCase = useUseCase('CHANNEL');

  const handleLogin = async () => {
    const user = await userUseCase.authenticate(credentials);
    // ...
  };

  return (
    // JSX
  );
};
```

### 일반 클래스에서 사용
```typescript
import { UseCaseFactory } from '../di/UseCaseFactory';

class UserService {
  private userUseCase = UseCaseFactory.createUserUseCase();
  private channelUseCase = UseCaseFactory.createChannelUseCase();

  async processUserAction() {
    const user = await this.userUseCase.getCurrentUser();
    // ...
  }
}
```

## 🎉 **결론**

DI Container 단순화를 통해:
- **코드 복잡성 80% 감소**
- **성능 30% 향상**
- **유지보수성 50% 향상**

을 달성할 수 있을 것으로 예상됩니다.

이러한 단순화를 통해 더욱 견고하고 확장 가능한 의존성 주입 구조를 구축할 수 있습니다. 