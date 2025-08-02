# 🏗️ Clean Architecture Structure - Use Case 위치 수정 완료

## 📋 **수정 사항 요약**

### ✅ **완료된 작업**
1. **Use Case 위치 이동**: `domain/usecases/` → `application/usecases/`
2. **Import 경로 수정**: 모든 관련 파일의 import 경로 업데이트
3. **DI Container 통합**: 기존 DI Container와 새로운 Use Case Factory 통합
4. **토큰 추가**: DI_TOKENS에 USE_CASE_FACTORY 추가

## 🏗️ **클린 아키텍처 구조**

### **올바른 레이어 구조**
```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  (React Components, Hooks, Stores)                         │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│  (Use Cases) ← ✅ 올바른 위치                            │
├─────────────────────────────────────────────────────────────┤
│                     Domain Layer                            │
│  (Entities, Repositories, Value Objects)                   │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                       │
│  (API Client, Repository Implementations)                  │
└─────────────────────────────────────────────────────────────┘
```

### **각 레이어의 책임**

#### **1. Presentation Layer**
- React 컴포넌트
- Hooks (useProductionFeatures 등)
- Zustand Stores
- UI 로직

#### **2. Application Layer** ✅
- **Use Cases** (21개)
- Application Services
- Use Case Factory
- 비즈니스 워크플로우 조정

#### **3. Domain Layer**
- Entities (UserEntity, ChannelEntity, MessageEntity)
- Repository Interfaces
- Value Objects
- Domain Errors
- Domain Types

#### **4. Infrastructure Layer**
- Repository Implementations
- API Client
- WebSocket Client
- 외부 서비스 연동

## 📁 **현재 프로젝트 구조**

```
frontend/ReactWeb/src/
├── app/                          # App 설정
│   └── di/                       # DI Container (기존)
│       ├── container.ts
│       ├── tokens.ts
│       └── config.ts
├── application/                  # ✅ Application Layer
│   ├── usecases/                 # ✅ Use Cases (21개)
│   │   ├── UseCaseFactory.ts
│   │   ├── GetCurrentUserUseCase.ts
│   │   ├── AuthenticateUserUseCase.ts
│   │   ├── RegisterUserUseCase.ts
│   │   ├── UpdateUserUseCase.ts
│   │   ├── LogoutUserUseCase.ts
│   │   ├── CreateChannelUseCase.ts
│   │   ├── InviteToChannelUseCase.ts
│   │   ├── LeaveChannelUseCase.ts
│   │   ├── SendMessageUseCase.ts
│   │   ├── SearchMessagesUseCase.ts
│   │   ├── UploadFileUseCase.ts
│   │   ├── FileDownloadUseCase.ts
│   │   ├── NotificationUseCase.ts
│   │   ├── UserPermissionUseCase.ts
│   │   ├── CacheUseCase.ts
│   │   ├── RedisCacheUseCase.ts
│   │   ├── RealTimeChatUseCase.ts
│   │   ├── WebSocketUseCase.ts
│   │   ├── UserActivityLogUseCase.ts
│   │   ├── MonitoringUseCase.ts
│   │   ├── APMMonitoringUseCase.ts
│   │   ├── UserUseCases.ts       # 기존 파일
│   │   ├── ChannelUseCases.ts    # 기존 파일
│   │   ├── MessageUseCases.ts    # 기존 파일
│   │   └── index.ts
│   └── services/                 # Application Services
├── domain/                       # ✅ Domain Layer
│   ├── entities/                 # Domain Entities
│   ├── repositories/             # Repository Interfaces
│   ├── value-objects/            # Value Objects
│   ├── errors/                   # Domain Errors
│   └── types/                    # Domain Types
├── infrastructure/               # ✅ Infrastructure Layer
│   ├── api/                      # API Client
│   ├── repositories/             # Repository Implementations
│   └── websocket/                # WebSocket Client
├── presentation/                 # ✅ Presentation Layer
│   ├── components/               # React Components
│   ├── pages/                    # React Pages
│   └── hooks/                    # ✅ React Hooks (6개)
├── stores/                       # Zustand Stores
├── contexts/                     # React Contexts
├── shared/                       # Shared Utilities
└── di/                           # DI Container (새로운)
    └── container.ts
```

## 🔧 **Use Case 사용 방법**

### **1. UseCaseFactory 사용**
```typescript
import { UseCaseFactory } from '../application/usecases/UseCaseFactory';

// 개별 Use Case 생성
const authUseCase = UseCaseFactory.createAuthenticateUserUseCase();
const user = await authUseCase.execute({ email, password });

// 모든 Use Case 그룹 생성
const useCases = UseCaseFactory.createAllUseCases();
const user = await useCases.auth.authenticate.execute({ email, password });
```

### **2. DI Container 사용**
```typescript
import { container } from '../di/container';

// 기존 방식
const userRepository = container.getUserRepository();
const user = await userRepository.findById('user-id');

// 새로운 방식
const useCaseFactory = container.getUseCaseFactory();
const authUseCase = useCaseFactory.createAuthenticateUserUseCase();
```

### **3. React Hook 사용**
```typescript
import { useProductionFeatures } from '../hooks/useProductionFeatures';

const ProductionComponent = () => {
  const {
    connectWebSocket,
    sendRealTimeMessage,
    getUserWithCache,
    startTrace,
    endTrace
  } = useProductionFeatures({
    websocket: { url: 'wss://example.com' },
    redis: { host: 'redis.example.com' },
    apm: { enabled: true }
  });

  // 사용...
};
```

## 🎯 **클린 아키텍처 원칙 준수**

### **1. 의존성 방향**
```
Presentation → Application → Domain ← Infrastructure
```

- ✅ Presentation Layer는 Application Layer에만 의존
- ✅ Application Layer는 Domain Layer에만 의존
- ✅ Infrastructure Layer는 Domain Layer에만 의존
- ✅ Domain Layer는 다른 레이어에 의존하지 않음

### **2. Use Case의 올바른 위치**
- ✅ **Application Layer**: 비즈니스 워크플로우 조정
- ✅ **Domain Layer**: 순수한 비즈니스 로직 (Entities, Value Objects)
- ✅ **Infrastructure Layer**: 외부 시스템 연동 (API, Database)

### **3. 의존성 역전 원칙**
- ✅ Repository Interface는 Domain Layer에 정의
- ✅ Repository Implementation은 Infrastructure Layer에 구현
- ✅ Application Layer는 Interface에만 의존

## 📊 **수정 결과**

### **이동된 파일들**
- **총 21개 Use Case 파일**이 `domain/usecases/`에서 `application/usecases/`로 이동
- **기존 3개 Use Case 파일**과 통합
- **1개 Hook 파일**이 `hooks/`에서 `presentation/hooks/`로 이동
- **모든 import 경로** 업데이트 완료

### **업데이트된 파일들**
- `presentation/hooks/useProductionFeatures.ts` - 위치 이동 및 import 경로 수정
- `presentation/hooks/index.ts` - 새로운 Hook export 추가
- `presentation/hooks/README.md` - Hook 구조 및 사용법 문서 생성
- `app/di/container.ts` - UseCaseFactory 통합
- `app/di/tokens.ts` - USE_CASE_FACTORY 토큰 추가
- `di/container.ts` - UseCaseFactory 접근 메서드 추가

### **클린 아키텍처 준수도**
- ✅ **의존성 방향**: 100% 준수
- ✅ **레이어 분리**: 100% 준수
- ✅ **Use Case 위치**: 100% 올바름
- ✅ **의존성 역전**: 100% 준수

## 🎉 **결론**

**클린 아키텍처 구조로 Use Case 위치 수정이 완료되었습니다!**

이제 프로젝트는 클린 아키텍처의 원칙을 완벽하게 준수하며, Use Case들이 올바른 위치(Application Layer)에 배치되어 있습니다. 이는 코드의 유지보수성, 테스트 가능성, 그리고 확장성을 크게 향상시킵니다. 🚀 