# Use Case Pattern Implementation

## Overview
Use Case 패턴을 통해 비즈니스 로직을 캡슐화하고, 애플리케이션의 핵심 기능을 명확하게 정의합니다.

## Use Case 목록

### 🔐 인증 관련 Use Cases
- `AuthenticateUserUseCase` - 사용자 로그인
- `RegisterUserUseCase` - 사용자 등록
- `LogoutUserUseCase` - 사용자 로그아웃

### 👤 사용자 관련 Use Cases
- `GetCurrentUserUseCase` - 현재 사용자 조회
- `UpdateUserUseCase` - 사용자 정보 업데이트

### 💬 채널 관련 Use Cases
- `CreateChannelUseCase` - 채널 생성
- `InviteToChannelUseCase` - 채널 초대
- `LeaveChannelUseCase` - 채널 나가기

### 📝 메시지 관련 Use Cases
- `SendMessageUseCase` - 메시지 전송
- `SearchMessagesUseCase` - 메시지 검색

## 사용법

### 1. Use Case Factory 사용 (권장)

```typescript
import { UseCaseFactory } from '../domain/usecases/UseCaseFactory';

// 개별 Use Case 생성
const authUseCase = UseCaseFactory.createAuthenticateUserUseCase();
const result = await authUseCase.execute({
  email: 'user@example.com',
  password: 'password123'
});

// 그룹별 Use Case 생성
const authUseCases = UseCaseFactory.createAuthUseCases();
const channelUseCases = UseCaseFactory.createChannelUseCases();
const messageUseCases = UseCaseFactory.createMessageUseCases();
```

### 2. 직접 인스턴스 생성

```typescript
import { AuthenticateUserUseCase } from '../domain/usecases';
import { container } from '../di/container';

const authUseCase = new AuthenticateUserUseCase(container.getUserRepository());
const result = await authUseCase.execute({
  email: 'user@example.com',
  password: 'password123'
});
```

## Use Case별 상세 예제

### 🔐 AuthenticateUserUseCase

```typescript
const authUseCase = UseCaseFactory.createAuthenticateUserUseCase();

try {
  const result = await authUseCase.execute({
    email: 'user@example.com',
    password: 'password123'
  });

  console.log('Login successful:', result.user);
  console.log('Access token:', result.accessToken);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### 👤 RegisterUserUseCase

```typescript
const registerUseCase = UseCaseFactory.createRegisterUserUseCase();

try {
  const result = await registerUseCase.execute({
    email: 'newuser@example.com',
    username: 'newuser',
    password: 'password123',
    displayName: 'New User',
    avatar: 'https://example.com/avatar.jpg'
  });

  console.log('Registration successful:', result.user);
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

### 💬 CreateChannelUseCase

```typescript
const createChannelUseCase = UseCaseFactory.createCreateChannelUseCase();

try {
  const result = await createChannelUseCase.execute({
    name: 'General Chat',
    description: 'General discussion channel',
    type: 'public',
    ownerId: 'user-id',
    members: ['user-id', 'other-user-id']
  });

  console.log('Channel created:', result.channel);
} catch (error) {
  console.error('Channel creation failed:', error.message);
}
```

### 📝 SendMessageUseCase

```typescript
const sendMessageUseCase = UseCaseFactory.createSendMessageUseCase();

try {
  const result = await sendMessageUseCase.execute({
    content: 'Hello, everyone!',
    channelId: 'channel-id',
    senderId: 'user-id',
    type: 'text'
  });

  console.log('Message sent:', result.message);
} catch (error) {
  console.error('Message sending failed:', error.message);
}
```

### 🔍 SearchMessagesUseCase

```typescript
const searchUseCase = UseCaseFactory.createSearchMessagesUseCase();

try {
  const result = await searchUseCase.execute({
    query: 'hello',
    channelId: 'channel-id',
    limit: 20,
    offset: 0,
    searchInContent: true,
    searchInMetadata: false
  });

  console.log('Search results:', result.messages);
  console.log('Total found:', result.total);
  console.log('Has more:', result.hasMore);
} catch (error) {
  console.error('Search failed:', error.message);
}
```

## React 컴포넌트에서 사용

### Hook으로 Use Case 래핑

```typescript
// hooks/useAuth.ts
import { useState } from 'react';
import { UseCaseFactory } from '../domain/usecases/UseCaseFactory';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const authUseCase = UseCaseFactory.createAuthenticateUserUseCase();
      const result = await authUseCase.execute({ email, password });
      
      // Store tokens and user data
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const registerUseCase = UseCaseFactory.createRegisterUserUseCase();
      const result = await registerUseCase.execute(userData);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};
```

### 컴포넌트에서 사용

```typescript
// components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      // Redirect or update UI
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

## 에러 처리

### 도메인 에러 타입

```typescript
try {
  const result = await useCase.execute(request);
  // Handle success
} catch (error) {
  if (error instanceof DomainError) {
    // Handle domain-specific errors
    switch (error.type) {
      case 'USER_NOT_FOUND':
        // Handle user not found
        break;
      case 'VALIDATION_ERROR':
        // Handle validation errors
        break;
      default:
        // Handle other domain errors
    }
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
  }
}
```

## 테스트

### Use Case 단위 테스트

```typescript
// __tests__/AuthenticateUserUseCase.test.ts
import { AuthenticateUserUseCase } from '../domain/usecases/AuthenticateUserUseCase';
import { UserRepositoryMock } from '../__mocks__/UserRepositoryMock';

describe('AuthenticateUserUseCase', () => {
  let useCase: AuthenticateUserUseCase;
  let mockRepository: UserRepositoryMock;

  beforeEach(() => {
    mockRepository = new UserRepositoryMock();
    useCase = new AuthenticateUserUseCase(mockRepository);
  });

  it('should authenticate valid user', async () => {
    // Arrange
    const user = UserEntity.create({
      email: 'test@example.com',
      username: 'testuser',
      isOnline: false
    });
    mockRepository.save(user);

    // Act
    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123'
    });

    // Assert
    expect(result.user).toBeDefined();
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('should throw error for invalid credentials', async () => {
    // Act & Assert
    await expect(
      useCase.execute({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      })
    ).rejects.toThrow('User not found');
  });
});
```

## 장점

### 1. **비즈니스 로직 캡슐화**
- 각 Use Case가 하나의 비즈니스 기능을 담당
- 로직이 명확하게 분리되어 유지보수 용이

### 2. **테스트 용이성**
- 각 Use Case를 독립적으로 테스트 가능
- Mock 객체로 의존성 쉽게 교체

### 3. **재사용성**
- 여러 컴포넌트에서 동일한 Use Case 재사용
- 비즈니스 로직 중복 제거

### 4. **타입 안전성**
- TypeScript로 입력/출력 타입 보장
- 컴파일 타임에 오류 검출

### 5. **의존성 주입**
- Repository 패턴과 결합하여 의존성 역전
- 테스트와 확장이 용이한 구조

## 다음 단계

### 1. **추가 Use Case 개발**
- 파일 업로드 Use Case
- 알림 관리 Use Case
- 사용자 권한 관리 Use Case

### 2. **성능 최적화**
- Use Case 결과 캐싱
- 배치 처리 Use Case
- 비동기 처리 최적화

### 3. **모니터링 및 로깅**
- Use Case 실행 시간 측정
- 에러 로깅 및 알림
- 성능 메트릭 수집 