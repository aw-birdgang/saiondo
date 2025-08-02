# Dependency Injection & Repository Pattern Guide

## Overview
이 디렉토리는 의존성 주입(DI) 컨테이너와 Repository 패턴의 인터페이스-구현체 분리를 관리합니다.

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

### 3. 의존성 주입 컨테이너
```typescript
// di/container.ts
export class DIContainer {
  private services: Map<string, any> = new Map();
  
  // Repository 등록
  this.services.set('UserRepository', new UserRepositoryImpl(apiClient));
  
  // Repository 조회
  public getUserRepository(): IUserRepository {
    return this.getRepository<IUserRepository>('User');
  }
}
```

## 사용법

### 1. Repository 사용
```typescript
import { container } from '../di/container';

// Repository 가져오기
const userRepository = container.getUserRepository();
const channelRepository = container.getChannelRepository();

// 사용
const user = await userRepository.findById('user-id');
const channels = await channelRepository.findByUserId('user-id');
```

### 2. Use Case에서 사용
```typescript
import { container } from '../di/container';

export class GetCurrentUserUseCase {
  constructor() {
    this.userRepository = container.getUserRepository();
  }
  
  async execute(): Promise<User> {
    const user = await this.userRepository.getCurrentUser();
    return user?.toJSON();
  }
}
```

### 3. 컴포넌트에서 사용
```typescript
import { container } from '../di/container';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const loadUser = async () => {
      const userRepository = container.getUserRepository();
      const userEntity = await userRepository.getCurrentUser();
      setUser(userEntity?.toJSON() || null);
    };
    
    loadUser();
  }, []);
  
  // ... 렌더링 로직
};
```

## 장점

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
    const user = UserEntity.create({ email: 'test@example.com', username: 'test' });
    mockRepository.save(user);
    
    const result = await useCase.execute();
    
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });
});
```

## 네이밍 컨벤션

- **인터페이스**: `I{Entity}Repository` (예: `IUserRepository`)
- **구현체**: `{Entity}RepositoryImpl` (예: `UserRepositoryImpl`)
- **파일명**: 인터페이스는 `I{Entity}Repository.ts`, 구현체는 `{Entity}RepositoryImpl.ts`
- **메서드명**: CRUD는 `findById`, `save`, `update`, `delete`, 비즈니스 로직은 `updateOnlineStatus` 등

## 확장 가이드

### 새로운 Repository 추가
1. Domain Layer에 인터페이스 정의
2. Infrastructure Layer에 구현체 작성
3. DI Container에 등록
4. Use Case에서 사용

### 새로운 Use Case 추가
1. Domain Layer에 Use Case 클래스 작성
2. DI Container에서 Repository 주입
3. 비즈니스 로직 구현
4. 테스트 코드 작성 