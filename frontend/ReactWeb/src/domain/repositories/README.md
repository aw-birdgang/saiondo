# Repository Pattern Implementation

## Overview
Repository Pattern을 통해 데이터 접근 계층을 추상화하고, 도메인 로직과 인프라스트럭처를 분리합니다.

## Architecture

```
Domain Layer (인터페이스)
├── IUserRepository
├── IChannelRepository
└── IMessageRepository

Infrastructure Layer (구현체)
├── UserRepositoryImpl
├── ChannelRepositoryImpl
└── MessageRepositoryImpl

Dependency Injection
└── DIContainer (의존성 주입 컨테이너)
```

## Repository Interface Structure

### 1. 기본 CRUD 작업
```typescript
export interface IUserRepository {
  // Create & Read
  findById(id: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<UserEntity>;
  
  // Update & Delete
  update(id: string, user: Partial<User>): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
```

### 2. 쿼리 작업
```typescript
export interface IUserRepository {
  // Query operations
  findAll(): Promise<UserEntity[]>;
  search(query: string): Promise<UserEntity[]>;
  findByEmail(email: string): Promise<UserEntity | null>;
}
```

### 3. 비즈니스 작업
```typescript
export interface IUserRepository {
  // Business operations
  getCurrentUser(): Promise<UserEntity | null>;
  updateOnlineStatus(id: string, isOnline: boolean): Promise<UserEntity>;
  updateProfile(id: string, displayName?: string, avatar?: string): Promise<UserEntity>;
}
```

## Repository Implementation Structure

### 1. 기본 구조
```typescript
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async findById(id: string): Promise<UserEntity | null> {
    try {
      const response = await this.apiClient.get<User>(`/users/${id}`);
      return response ? UserEntity.fromData(response) : null;
    } catch (error) {
      // 에러 처리 및 도메인 에러 변환
      throw this.handleError(error, 'Failed to find user by ID');
    }
  }
}
```

### 2. 도메인 엔티티 변환
```typescript
// API 응답을 도메인 엔티티로 변환
const response = await this.apiClient.get<User>(`/users/${id}`);
return response ? UserEntity.fromData(response) : null;

// 도메인 엔티티를 API 요청으로 변환
const userData = user.toJSON();
const response = await this.apiClient.post<User>('/users', userData);
```

### 3. 비즈니스 로직 활용
```typescript
async updateOnlineStatus(id: string, isOnline: boolean): Promise<UserEntity> {
  const currentUser = await this.findById(id);
  if (!currentUser) {
    throw DomainErrorFactory.createUserNotFound(id);
  }
  
  // 도메인 엔티티의 비즈니스 메서드 사용
  const updatedUser = currentUser.updateOnlineStatus(isOnline);
  const response = await this.apiClient.put<User>(`/users/${id}`, updatedUser.toJSON());
  return UserEntity.fromData(response);
}
```

## Dependency Injection Container

### 1. 컨테이너 구조
```typescript
export class DIContainer {
  private services: Map<string, any> = new Map();

  private initializeServices(): void {
    // 인프라스트럭처 서비스 등록
    this.services.set('ApiClient', new ApiClient());

    // Repository 구현체 등록
    this.services.set('UserRepository', new UserRepositoryImpl(
      this.get<ApiClient>('ApiClient')
    ));
  }

  // Repository 조회 메서드
  public getUserRepository(): IUserRepository {
    return this.getRepository<IUserRepository>('User');
  }
}
```

### 2. 사용법
```typescript
import { container } from '../di/container';

// Repository 가져오기
const userRepository = container.getUserRepository();
const channelRepository = container.getChannelRepository();

// 사용
const user = await userRepository.findById('user-id');
```

## Use Case Integration

### 1. Use Case에서 Repository 사용
```typescript
export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<GetCurrentUserResponse> {
    const user = await this.userRepository.getCurrentUser();
    
    if (!user) {
      throw DomainErrorFactory.createUserNotFound('current user');
    }

    return { user: user.toJSON() };
  }
}
```

### 2. DI Container와 Use Case 연결
```typescript
export class GetCurrentUserUseCase {
  constructor() {
    this.userRepository = container.getUserRepository();
  }
}
```

## Store Integration

### 1. Zustand Store에서 Repository 사용
```typescript
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      fetchCurrentUser: async () => {
        try {
          set({ loading: true, error: null });
          const userRepository = container.getUserRepository();
          const userEntity = await userRepository.getCurrentUser();
          
          if (userEntity) {
            set({ currentUser: userEntity.toJSON() as UserProfile, loading: false });
          }
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
    })
  )
);
```

## Testing Strategy

### 1. Repository Mock 생성
```typescript
export class UserRepositoryMock implements IUserRepository {
  private users: UserEntity[] = [];

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    this.users.push(user);
    return user;
  }
}
```

### 2. Use Case 테스트
```typescript
describe('GetCurrentUserUseCase', () => {
  let useCase: GetCurrentUserUseCase;
  let mockRepository: UserRepositoryMock;

  beforeEach(() => {
    mockRepository = new UserRepositoryMock();
    useCase = new GetCurrentUserUseCase(mockRepository);
  });

  it('should return current user', async () => {
    const user = UserEntity.create({ email: 'test@example.com', username: 'test' });
    mockRepository.save(user);

    const result = await useCase.execute();

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });
});
```

## Benefits

### 1. 인터페이스와 구현체 분리
- **테스트 용이성**: Mock 객체로 쉽게 교체 가능
- **유연성**: 다른 구현체로 쉽게 교체 가능
- **의존성 역전**: Domain이 Infrastructure에 의존하지 않음

### 2. 도메인 엔티티 활용
- **비즈니스 로직**: 엔티티 내부에 비즈니스 규칙 캡슐화
- **타입 안전성**: TypeScript의 강력한 타입 체크
- **불변성**: 엔티티는 불변 객체로 설계

### 3. 의존성 주입
- **단일 책임**: 각 클래스가 하나의 책임만 가짐
- **결합도 감소**: 클래스 간 의존성 최소화
- **확장성**: 새로운 기능 추가 시 기존 코드 수정 최소화

## Best Practices

### 1. 네이밍 컨벤션
- **인터페이스**: `I{Entity}Repository`
- **구현체**: `{Entity}RepositoryImpl`
- **메서드**: CRUD는 `findById`, `save`, `update`, `delete`, 비즈니스 로직은 `updateOnlineStatus` 등

### 2. 에러 처리
- **도메인 에러**: 비즈니스 로직 관련 에러는 도메인 에러로 변환
- **인프라 에러**: 네트워크, 데이터베이스 에러는 적절히 처리

### 3. 타입 안전성
- **제네릭 사용**: Repository 메서드에서 제네릭 타입 활용
- **타입 가드**: 런타임 타입 체크로 안전성 확보

### 4. 성능 최적화
- **캐싱**: 자주 사용되는 데이터는 캐싱 고려
- **배치 처리**: 여러 작업을 한 번에 처리하는 메서드 제공 