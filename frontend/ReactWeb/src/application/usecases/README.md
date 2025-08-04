# Use Case Pattern Implementation

## Overview
Use Case 패턴을 통해 비즈니스 로직을 캡슐화하고, 애플리케이션의 핵심 기능을 명확하게 정의합니다.

## 아키텍처 개선 사항

### 🔄 Service Layer 도입
기존의 UseCase가 Repository를 직접 사용하던 구조에서 **Service Layer**를 도입하여 다음과 같이 개선했습니다:

```
기존: UseCase → Repository
개선: UseCase → Service → Repository
```

### 🎯 개선된 구조의 장점
1. **비즈니스 로직 분리**: Service Layer에서 복잡한 비즈니스 로직 처리
2. **성능 모니터링**: Service Layer에서 성능 측정 및 로깅
3. **에러 처리**: 통합된 에러 처리 및 로깅
4. **보안 검증**: 입력 검증 및 보안 체크
5. **캐싱**: 다단계 캐싱 전략
6. **재사용성**: Service Layer를 여러 UseCase에서 재사용

## Use Case 목록

### 🔐 인증 관련 Use Cases
- `AuthenticateUserUseCase` - 사용자 로그인 (UserService 사용)
- `RegisterUserUseCase` - 사용자 등록 (UserService 사용)
- `LogoutUserUseCase` - 사용자 로그아웃 (UserService 사용)

### 👤 사용자 관련 Use Cases
- `GetCurrentUserUseCase` - 현재 사용자 조회 (UserService 사용)
- `UpdateUserUseCase` - 사용자 정보 업데이트 (UserService 사용)

### 💬 채널 관련 Use Cases
- `CreateChannelUseCase` - 채널 생성 (ChannelService 사용)
- `InviteToChannelUseCase` - 채널 초대 (ChannelService 사용)
- `LeaveChannelUseCase` - 채널 나가기 (ChannelService 사용)

### 📝 메시지 관련 Use Cases
- `SendMessageUseCase` - 메시지 전송 (MessageService 사용)
- `SearchMessagesUseCase` - 메시지 검색 (MessageService 사용)

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

### 2. DI Container를 통한 직접 사용

```typescript
import { container } from '../app/di/container';

// Service 직접 사용
const userService = container.getUserService();
const channelService = container.getChannelService();
const messageService = container.getMessageService();

// UseCase 사용
const userUseCases = container.get(DI_TOKENS.USER_USE_CASES);
const channelUseCases = container.get(DI_TOKENS.CHANNEL_USE_CASES);
const messageUseCases = container.get(DI_TOKENS.MESSAGE_USE_CASES);
```

### 3. React Hook을 통한 사용

```typescript
import { useServices, useUseCases } from '../app/di/useDI';

function MyComponent() {
  const { userService, channelService, messageService } = useServices();
  const { userUseCases, channelUseCases, messageUseCases } = useUseCases();
  
  // Service 직접 사용
  const handleUserUpdate = async () => {
    const user = await userService.updateUserProfile(userId, updates);
  };
  
  // UseCase 사용
  const handleChannelCreate = async () => {
    const result = await channelUseCases.createChannel(channelData);
  };
}
```

## Service Layer 상세

### UserService
- 사용자 프로필 관리
- 온라인 상태 관리
- 사용자 통계 및 활동 로그
- 성능 모니터링 및 에러 처리

### ChannelService
- 채널 생성 및 관리
- 멤버 관리 (초대, 제거)
- 채널 통계 및 활동 분석
- 권한 검증

### MessageService
- 메시지 전송 및 관리
- 메시지 검색 및 필터링
- 파일 업로드 지원
- 실시간 메시지 처리

## Use Case별 상세 예제

### 🔐 AuthenticateUserUseCase (UserService 사용)

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

### 💬 CreateChannelUseCase (ChannelService 사용)

```typescript
const createChannelUseCase = UseCaseFactory.createCreateChannelUseCase();

try {
  const result = await createChannelUseCase.execute({
    name: 'General Chat',
    description: 'General discussion channel',
    type: 'public',
    ownerId: 'user123',
    members: ['user123', 'user456']
  });
  
  console.log('Channel created:', result.channel);
} catch (error) {
  console.error('Channel creation failed:', error.message);
}
```

### 📝 SendMessageUseCase (MessageService 사용)

```typescript
const sendMessageUseCase = UseCaseFactory.createSendMessageUseCase();

try {
  const result = await sendMessageUseCase.execute({
    content: 'Hello, everyone!',
    channelId: 'channel123',
    senderId: 'user123',
    type: 'text'
  });
  
  console.log('Message sent:', result.message);
} catch (error) {
  console.error('Message sending failed:', error.message);
}
```

## 성능 및 모니터링

Service Layer를 통해 다음과 같은 기능들이 자동으로 제공됩니다:

- **성능 측정**: 각 작업의 실행 시간 측정
- **에러 로깅**: 구조화된 에러 로깅
- **보안 검증**: 입력값 검증 및 XSS 방지
- **캐싱**: 다단계 캐싱으로 성능 최적화
- **메트릭 수집**: 사용자 활동 및 시스템 메트릭

## 마이그레이션 가이드

기존 Repository 기반 코드에서 Service 기반으로 마이그레이션하는 방법:

```typescript
// 기존 코드
const userRepository = container.getUserRepository();
const user = await userRepository.findById(userId);

// 새로운 코드
const userService = container.getUserService();
const user = await userService.getCurrentUser(userId);
```

이러한 구조 개선을 통해 더 견고하고 유지보수하기 쉬운 애플리케이션을 구축할 수 있습니다. 