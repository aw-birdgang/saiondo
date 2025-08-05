# Dependency Injection Container

이 문서는 ReactWeb 프로젝트의 Dependency Injection Container에 대한 설명입니다.

## 개요

DI Container는 Clean Architecture 패턴을 구현하기 위해 의존성 주입을 관리하는 컨테이너입니다. UseCase와 서비스의 의존성을 중앙에서 관리하고, 토큰 기반으로 서비스를 등록하고 조회할 수 있습니다.

## 구조

```
src/di/
├── container.ts          # DI Container 구현
├── UseCaseRegistry.ts    # UseCase 레지스트리
└── README.md            # 이 문서
```

## 주요 기능

### 1. 서비스 등록 및 조회

- 토큰 기반 서비스 관리
- 팩토리 패턴 지원
- 타입 안전성 보장

### 2. UseCase 관리

- UseCase 등록 및 의존성 주입
- 메타데이터 관리
- Lazy loading 지원

### 3. 의존성 주입

- 생성자 주입 패턴
- 인터페이스 기반 의존성 분리
- 싱글톤 패턴 지원

## 사용법

### 1. Container 인스턴스 가져오기

```typescript
import { container } from './di/container';

// Singleton 인스턴스 사용
const diContainer = container;
```

### 2. Repository 가져오기

```typescript
// User Repository
const userRepository = container.getUserRepository();

// Channel Repository
const channelRepository = container.getChannelRepository();

// Message Repository
const messageRepository = container.getMessageRepository();
```

### 3. Service 가져오기

```typescript
// User Service
const userService = container.getUserService();

// Channel Service
const channelService = container.getChannelService();

// Message Service
const messageService = container.getMessageService();

// File Service
const fileService = container.getFileService();
```

### 4. UseCase 생성

```typescript
import { UseCaseFactory } from '../application/usecases/UseCaseFactory';

// 개별 UseCase 생성
const getUserUseCase = UseCaseFactory.createGetCurrentUserUseCase();

// 그룹별 UseCase 생성
const authUseCases = UseCaseFactory.createAuthUseCases();
const channelUseCases = UseCaseFactory.createChannelUseCases();
```

### 5. API Client 가져오기

```typescript
const apiClient = container.getApiClient();
```

## 등록된 서비스

### Repositories

- `UserRepository`: 사용자 관련 데이터 접근
- `ChannelRepository`: 채널 관련 데이터 접근
- `MessageRepository`: 메시지 관련 데이터 접근

### Services

- `UserService`: 사용자 관련 비즈니스 로직
- `ChannelService`: 채널 관련 비즈니스 로직
- `MessageService`: 메시지 관련 비즈니스 로직
- `FileService`: 파일 관련 비즈니스 로직

### Infrastructure

- `ApiClient`: API 통신을 위한 HTTP 클라이언트

### UseCases

- `GetCurrentUserUseCase`: 현재 사용자 조회
- `UpdateUserUseCase`: 사용자 정보 업데이트
- `CreateChannelUseCase`: 채널 생성
- `SendMessageUseCase`: 메시지 전송
- 기타 다양한 UseCase들...

## 토큰 시스템

DI Container는 토큰 기반으로 서비스를 관리합니다:

```typescript
export const DI_TOKENS = {
  // Infrastructure
  API_CLIENT: 'ApiClient',

  // Repositories
  USER_REPOSITORY: 'UserRepository',
  CHANNEL_REPOSITORY: 'ChannelRepository',
  MESSAGE_REPOSITORY: 'MessageRepository',

  // Services
  USER_SERVICE: 'UserService',
  CHANNEL_SERVICE: 'ChannelService',
  MESSAGE_SERVICE: 'MessageService',
  FILE_SERVICE: 'FileService',

  // Use Cases
  GET_CURRENT_USER_USE_CASE: 'GetCurrentUserUseCase',
  // ... 기타 UseCase 토큰들
} as const;
```

## 예시

### UseCase 사용 예시

```typescript
import { UseCaseFactory } from '../application/usecases/UseCaseFactory';

class UserComponent {
  private getUserUseCase = UseCaseFactory.createGetCurrentUserUseCase();

  async getUser() {
    return await this.getUserUseCase.execute();
  }
}
```

### 서비스 사용 예시

```typescript
import { container } from './di/container';

class UserService {
  private userRepository = container.getUserRepository();

  async getUser(id: string) {
    return await this.userRepository.findById(id);
  }
}
```

### 새로운 서비스 등록

```typescript
// 서비스 등록
container.register('CustomService', new CustomService());

// 팩토리 등록
container.registerFactory('CustomService', () => new CustomService());

// UseCase 등록
container.registerUseCase({
  token: 'CustomUseCase',
  useCase: CustomUseCase,
  dependencies: ['CustomService'],
  metadata: {
    name: 'CustomUseCase',
    description: 'Custom use case',
    version: '1.0.0',
  },
});
```

## 초기화

애플리케이션 시작 시 UseCase 레지스트리가 자동으로 초기화됩니다:

```typescript
// main.tsx에서 자동 초기화
await UseCaseFactory.initialize();
```

## 장점

1. **의존성 분리**: 인터페이스와 구현체를 분리하여 관리
2. **테스트 용이성**: Mock 객체 주입이 쉬워짐
3. **확장성**: 새로운 서비스와 UseCase 추가가 용이
4. **중앙 관리**: 모든 의존성을 한 곳에서 관리
5. **타입 안전성**: TypeScript를 통한 타입 안전성 보장
6. **일관성**: 모든 UseCase가 동일한 인터페이스 구현
7. **메타데이터 관리**: UseCase의 메타데이터 관리 지원

## Repository Pattern 구조

### 1. 인터페이스 (Domain Layer)

```typescript
// domain/repositories/IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<UserEntity>;
  // ... 기타 메서드들
}
```

### 2. 구현체 (Infrastructure Layer)

```typescript
// infrastructure/repositories/UserRepositoryImpl.ts
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async findById(id: string): Promise<UserEntity | null> {
    // API 호출 및 도메인 엔티티 변환 로직
  }
}
```

## 테스트 예제

### Repository Mock 생성

```typescript
// __mocks__/UserRepositoryMock.ts
export class UserRepositoryMock implements IUserRepository {
  private users: UserEntity[] = [];

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    this.users.push(user);
    return user;
  }

  // ... 기타 메서드들
}
```

### Use Case 테스트

```typescript
// GetCurrentUserUseCase.test.ts
describe('GetCurrentUserUseCase', () => {
  let useCase: GetCurrentUserUseCase;
  let mockRepository: UserRepositoryMock;

  beforeEach(() => {
    mockRepository = new UserRepositoryMock();
    useCase = new GetCurrentUserUseCase(mockRepository);
  });

  it('should return current user', async () => {
    const user = UserEntity.create({
      email: 'test@example.com',
      username: 'test',
    });
    mockRepository.save(user);

    const result = await useCase.execute();

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });
});
```

## 확장 가이드

### 새로운 Repository 추가

1. Domain Layer에 인터페이스 정의
2. Infrastructure Layer에 구현체 작성
3. DI Container에 등록
4. Use Case에서 사용

### 새로운 Use Case 추가

1. IUseCase 인터페이스 구현
2. UseCaseRegistry에 등록
3. DI_TOKENS에 토큰 추가
4. UseCaseFactory에 생성 메서드 추가
