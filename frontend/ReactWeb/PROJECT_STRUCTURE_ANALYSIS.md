# ReactWeb 프로젝트 구조 분석 및 PlantUML 다이어그램

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [클린 아키텍처 구조](#클린-아키텍처-구조)
3. [계층별 상세 분석](#계층별-상세-분석)
4. [PlantUML 다이어그램 설명](#plantuml-다이어그램-설명)
5. [데이터 흐름 분석](#데이터-흐름-분석)
6. [의존성 주입 시스템](#의존성-주입-시스템)
7. [상태 관리 구조](#상태-관리-구조)
8. [개발 가이드라인](#개발-가이드라인)

## 🎯 프로젝트 개요

### 기술 스택
- **Frontend Framework**: React 19.1.0
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 7.0.4
- **State Management**: Zustand 5.0.7
- **Styling**: Tailwind CSS 3.4.0
- **HTTP Client**: Axios 1.11.0
- **Real-time**: Socket.io-client 4.8.1
- **Package Manager**: pnpm 8.15.0

### 주요 특징
- ✅ **클린 아키텍처** 원칙 적용
- ✅ **의존성 주입** 패턴 사용
- ✅ **TypeScript** 엄격한 타입 체크
- ✅ **Zustand** 기반 상태 관리
- ✅ **React Context** 보조 상태 관리
- ✅ **실시간 통신** WebSocket 지원
- ✅ **모듈화된 구조** 유지보수성 향상

## 🏗️ 클린 아키텍처 구조

### 전체 계층 구조
```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  (React Components, Hooks, Stores, Contexts)               │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│  (Use Cases, Controllers, Application Services)            │
├─────────────────────────────────────────────────────────────┤
│                     Domain Layer                            │
│  (Entities, Value Objects, Repository Interfaces)          │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                       │
│  (API Client, Repository Implementations, WebSocket)       │
└─────────────────────────────────────────────────────────────┘
```

### 의존성 방향
- **Presentation Layer** → **Application Layer** → **Domain Layer**
- **Infrastructure Layer** → **Domain Layer**
- **Domain Layer**는 다른 계층에 의존하지 않음

## 📊 계층별 상세 분석

### 1. Presentation Layer (프레젠테이션 계층)

#### 구성 요소
```
presentation/
├── components/          # React 컴포넌트
│   ├── common/         # 공통 컴포넌트 (Button, Input, Modal)
│   ├── layout/         # 레이아웃 컴포넌트 (Header, Sidebar)
│   └── specific/       # 특정 기능 컴포넌트 (ChatMessage, ChannelList)
├── pages/              # 페이지 컴포넌트
│   ├── auth/           # 인증 페이지
│   ├── chat/           # 채팅 페이지
│   └── channel/        # 채널 페이지
├── hooks/              # 커스텀 훅 (6개)
├── routes/             # 라우팅 설정
└── providers/          # Context Provider
```

#### 주요 책임
- 사용자 인터페이스 렌더링
- 사용자 상호작용 처리
- 상태 표시 및 업데이트
- 라우팅 관리

#### 상태 관리
```typescript
// Zustand Store 사용
const { user, setUser } = useUserStore();
const { channels, addChannel } = useChannelStore();

// React Context 보조
const { auth } = useAuthContext();
const { theme } = useThemeContext();
```

### 2. Application Layer (애플리케이션 계층)

#### 구성 요소
```
application/
├── usecases/           # 유스케이스 (21개)
│   ├── UseCaseFactory.ts
│   ├── GetCurrentUserUseCase.ts
│   ├── AuthenticateUserUseCase.ts
│   ├── CreateChannelUseCase.ts
│   ├── SendMessageUseCase.ts
│   └── ... (총 21개)
├── services/           # 애플리케이션 서비스
├── controllers/        # 컨트롤러
└── dto/               # 데이터 전송 객체
```

#### 주요 책임
- 비즈니스 워크플로우 조정
- 도메인 객체 조합
- 트랜잭션 관리
- 에러 처리

#### Use Case 패턴
```typescript
// Use Case Factory 사용
const useCaseFactory = UseCaseFactory.createAllUseCases();
const user = await useCaseFactory.auth.authenticate.execute({
  email: 'user@example.com',
  password: 'password'
});
```

### 3. Domain Layer (도메인 계층)

#### 구성 요소
```
domain/
├── entities/           # 도메인 엔티티
│   ├── User.ts
│   ├── Channel.ts
│   └── Message.ts
├── value-objects/      # 값 객체
│   ├── Email.ts
│   ├── UserId.ts
│   ├── ChannelId.ts
│   └── MessageId.ts
├── repositories/       # 리포지토리 인터페이스
├── errors/            # 도메인 에러
├── types/             # 도메인 타입
└── dto/               # 도메인 DTO
```

#### 주요 책임
- 비즈니스 로직 정의
- 도메인 규칙 구현
- 엔티티 관계 정의
- 값 객체 캡슐화

#### 엔티티 예시
```typescript
export class UserEntity {
  constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly name: string,
    private readonly status: UserStatus
  ) {}

  public isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  public canSendMessage(): boolean {
    return this.isActive();
  }
}
```

### 4. Infrastructure Layer (인프라스트럭처 계층)

#### 구성 요소
```
infrastructure/
├── api/               # API 클라이언트
│   ├── ApiClient.ts
│   ├── HttpClient.ts
│   └── endpoints.ts
├── repositories/      # 리포지토리 구현체
├── websocket/        # WebSocket 클라이언트
├── payment/          # 결제 서비스
└── notification/     # 알림 서비스
```

#### 주요 책임
- 외부 시스템과의 통신
- 데이터 영속성 처리
- 외부 서비스 연동
- 기술적 세부사항 구현

#### Repository 구현 예시
```typescript
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async findById(id: UserId): Promise<UserEntity> {
    const response = await this.apiClient.get(`/users/${id.value}`);
    return UserEntity.fromDTO(response.data);
  }
}
```

## 🎨 PlantUML 다이어그램 설명

### 1. 클린 아키텍처 구조 다이어그램 (`architecture-diagram.puml`)

#### 주요 특징
- **4계층 구조** 명확히 구분
- **의존성 방향** 시각화
- **각 계층의 구성 요소** 상세 표시
- **관계선**으로 의존성 표현

#### 다이어그램 구성
```
Presentation Layer (파란색)
├── React Components
├── State Management (Zustand)
├── React Contexts
├── Custom Hooks
└── Routing

Application Layer (주황색)
├── Use Cases (21개)
├── Application Services
├── Controllers
└── DTOs

Domain Layer (초록색)
├── Entities
├── Value Objects
├── Repository Interfaces
├── Domain Errors
└── Domain Types

Infrastructure Layer (보라색)
├── API Client
├── Repository Implementations
├── WebSocket
├── Payment
└── Notification
```

### 2. 프로젝트 구조 다이어그램 (`project-structure.puml`)

#### 주요 특징
- **실제 파일 구조** 반영
- **폴더별 색상 구분**
- **파일 목록** 상세 표시
- **계층별 의존성** 표현

#### 파일 구조 분석
```
총 파일 수: 약 150개
- TypeScript/TSX: 120개
- 설정 파일: 15개
- 문서 파일: 10개
- 기타: 5개
```

### 3. 데이터 흐름 시퀀스 다이어그램 (`data-flow-sequence.puml`)

#### 주요 플로우
1. **사용자 인증 플로우**
2. **채널 생성 플로우**
3. **실시간 메시지 전송 플로우**
4. **실시간 메시지 수신 플로우**
5. **에러 처리 플로우**

#### 시퀀스 다이어그램 특징
- **시간 순서** 명확히 표현
- **컴포넌트 간 상호작용** 시각화
- **비동기 처리** 표현
- **에러 처리** 포함

## 🔄 데이터 흐름 분석

### 1. 일반적인 데이터 흐름
```
User Action → React Component → Custom Hook → Use Case → Repository → API → Backend
```

### 2. 상태 업데이트 흐름
```
Backend Response → Repository → Use Case → Store → Context → Component → UI Update
```

### 3. 실시간 데이터 흐름
```
WebSocket Message → WebSocket Client → Use Case → Store → Context → Component → Real-time UI Update
```

### 4. 에러 처리 흐름
```
Error → Repository → Use Case → Error Handler → Store → Context → Component → Error UI
```

## 💉 의존성 주입 시스템

### DI Container 구조
```typescript
// DI 토큰 정의
export const DI_TOKENS = {
  API_CLIENT: Symbol('ApiClient'),
  USER_REPOSITORY: Symbol('UserRepository'),
  USER_USE_CASES: Symbol('UserUseCases'),
  USE_CASE_FACTORY: Symbol('UseCaseFactory'),
};

// 컨테이너 설정
container.register(DI_TOKENS.API_CLIENT, () => new ApiClient());
container.register(DI_TOKENS.USER_REPOSITORY, () => {
  const apiClient = container.get<ApiClient>(DI_TOKENS.API_CLIENT);
  return new UserRepositoryImpl(apiClient);
});
```

### Use Case Factory
```typescript
export class UseCaseFactory {
  static createAuthenticateUserUseCase(): AuthenticateUserUseCase {
    const userRepository = container.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY);
    return new AuthenticateUserUseCase(userRepository);
  }
}
```

## 📊 상태 관리 구조

### Zustand Store 구조
```typescript
// Auth Store
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));

// Channel Store
export const useChannelStore = create<ChannelStore>((set, get) => ({
  channels: [],
  currentChannel: null,
  addChannel: (channel) => set((state) => ({
    channels: [...state.channels, channel]
  })),
}));
```

### React Context 보조
```typescript
// Auth Context
export const AuthContext = createContext<AuthContextType | null>(null);

// Theme Context
export const ThemeContext = createContext<ThemeContextType | null>(null);
```

## 🛠️ 개발 가이드라인

### 1. 새로운 기능 추가 시
1. **Domain Layer**: 엔티티/값 객체 정의
2. **Application Layer**: Use Case 구현
3. **Infrastructure Layer**: Repository 구현
4. **Presentation Layer**: UI 컴포넌트 구현

### 2. 코드 작성 원칙
- **단일 책임 원칙** 준수
- **의존성 역전 원칙** 적용
- **TypeScript 엄격 모드** 사용
- **에러 처리** 일관성 유지

### 3. 테스트 전략
- **단위 테스트**: 각 계층별 독립적 테스트
- **통합 테스트**: Use Case 중심 테스트
- **컴포넌트 테스트**: UI 컴포넌트 테스트

### 4. 성능 최적화
- **React.memo** 적절한 사용
- **useCallback/useMemo** 최적화
- **코드 스플리팅** 적용
- **이미지 최적화** 구현

## 📈 프로젝트 구조의 장점

### 1. 유지보수성
- ✅ **명확한 계층 분리**
- ✅ **의존성 방향 제어**
- ✅ **모듈화된 구조**

### 2. 테스트 가능성
- ✅ **단위 테스트 용이**
- ✅ **Mock 객체 사용 가능**
- ✅ **의존성 주입으로 격리**

### 3. 확장성
- ✅ **새로운 기능 추가 용이**
- ✅ **기존 코드 영향 최소화**
- ✅ **플러그인 아키텍처 지원**

### 4. 개발 효율성
- ✅ **명확한 개발 가이드라인**
- ✅ **재사용 가능한 컴포넌트**
- ✅ **일관된 코딩 스타일**

## 🎉 결론

ReactWeb 프로젝트는 **클린 아키텍처** 원칙을 완벽하게 적용한 현대적인 React 애플리케이션입니다. 

### 주요 성과
- ✅ **4계층 구조**로 명확한 책임 분리
- ✅ **21개의 Use Case**로 비즈니스 로직 체계화
- ✅ **Zustand + Context** 조합으로 효율적인 상태 관리
- ✅ **TypeScript** 엄격한 타입 체크로 안정성 확보
- ✅ **의존성 주입**으로 테스트 가능성 향상

### 향후 발전 방향
- 🔄 **마이크로 프론트엔드** 아키텍처 도입 검토
- 🔄 **성능 모니터링** 시스템 구축
- 🔄 **자동화된 테스트** 커버리지 향상
- 🔄 **CI/CD 파이프라인** 최적화

이 구조를 통해 **유지보수성**, **확장성**, **테스트 가능성**을 모두 확보하여 장기적으로 안정적인 개발 환경을 제공할 수 있습니다. 🚀 