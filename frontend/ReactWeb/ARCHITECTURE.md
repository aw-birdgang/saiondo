# ReactWeb 프로젝트 - 클린 아키텍처 구조

## 개요

이 프로젝트는 클린 아키텍처(Clean Architecture) 원칙을 적용하여 설계된 React 웹 애플리케이션입니다. 각 계층이 명확히 분리되어 있어 유지보수성, 테스트 가능성, 그리고 확장성을 보장합니다.

## 전체 계층 구조

```
frontend/ReactWeb/
├── src/
│   ├── domain/                    # 도메인 계층 (가장 안쪽)
│   │   ├── entities/              # 도메인 엔티티
│   │   │   ├── User.ts           # 사용자 엔티티
│   │   │   ├── Channel.ts        # 채널 엔티티
│   │   │   ├── Message.ts        # 메시지 엔티티
│   │   │   └── index.ts
│   │   ├── value-objects/         # 값 객체
│   │   │   ├── Email.ts          # 이메일 값 객체
│   │   │   ├── UserId.ts         # 사용자 ID 값 객체
│   │   │   ├── ChannelId.ts      # 채널 ID 값 객체
│   │   │   ├── MessageId.ts      # 메시지 ID 값 객체
│   │   │   └── index.ts
│   │   ├── repositories/          # 리포지토리 인터페이스
│   │   │   ├── IUserRepository.ts
│   │   │   ├── IChannelRepository.ts
│   │   │   ├── IMessageRepository.ts
│   │   │   └── index.ts
│   │   ├── usecases/             # 도메인 유스케이스
│   │   │   ├── GetCurrentUserUseCase.ts
│   │   │   └── index.ts
│   │   ├── errors/               # 도메인 에러
│   │   │   └── DomainError.ts
│   │   └── types/                # 도메인 타입
│   │
│   ├── application/              # 애플리케이션 계층
│   │   ├── usecases/             # 애플리케이션 유스케이스
│   │   │   ├── UserUseCases.ts   # 사용자 관련 유스케이스
│   │   │   ├── ChannelUseCases.ts # 채널 관련 유스케이스
│   │   │   ├── MessageUseCases.ts # 메시지 관련 유스케이스
│   │   │   └── index.ts
│   │   └── services/             # 애플리케이션 서비스
│   │       ├── AuthService.ts    # 인증 서비스
│   │       ├── NotificationService.ts # 알림 서비스
│   │       └── index.ts
│   │
│   ├── infrastructure/           # 인프라스트럭처 계층
│   │   ├── api/                  # API 클라이언트
│   │   │   ├── ApiClient.ts      # HTTP 클라이언트
│   │   │   ├── endpoints.ts      # API 엔드포인트
│   │   │   └── index.ts
│   │   ├── repositories/         # 리포지토리 구현체
│   │   │   ├── UserRepositoryImpl.ts
│   │   │   ├── ChannelRepositoryImpl.ts
│   │   │   ├── MessageRepositoryImpl.ts
│   │   │   └── index.ts
│   │   └── websocket/            # WebSocket 클라이언트
│   │       └── WebSocketClient.ts
│   │
│   ├── presentation/             # 프레젠테이션 계층
│   │   ├── components/           # React 컴포넌트
│   │   │   ├── common/           # 공통 컴포넌트
│   │   │   ├── layout/           # 레이아웃 컴포넌트
│   │   │   ├── specific/         # 특정 기능 컴포넌트
│   │   │   └── index.ts
│   │   ├── pages/                # 페이지 컴포넌트
│   │   │   ├── auth/             # 인증 페이지
│   │   │   ├── chat/             # 채팅 페이지
│   │   │   ├── channel/          # 채널 페이지
│   │   │   └── index.ts
│   │   ├── hooks/                # 커스텀 훅
│   │   ├── routes/               # 라우팅
│   │   │   └── AppRoutes.tsx
│   │   └── index.ts
│   │
│   ├── app/                      # 애플리케이션 설정
│   │   ├── di/                   # 의존성 주입
│   │   │   ├── container.ts      # DI 컨테이너
│   │   │   ├── tokens.ts         # DI 토큰
│   │   │   ├── config.ts         # 설정
│   │   │   ├── useDI.ts          # DI 훅
│   │   │   └── index.ts
│   │   ├── App.tsx               # 메인 앱 컴포넌트
│   │   └── di/
│   │
│   ├── contexts/                 # React Context
│   │   ├── AuthContext.tsx       # 인증 컨텍스트
│   │   ├── UserContext.tsx       # 사용자 컨텍스트
│   │   ├── ThemeContext.tsx      # 테마 컨텍스트
│   │   ├── UseCaseContext.tsx    # 유스케이스 컨텍스트
│   │   └── index.ts
│   │
│   ├── stores/                   # 상태 관리 (Zustand)
│   │   ├── authStore.ts          # 인증 상태
│   │   ├── userStore.ts          # 사용자 상태
│   │   ├── channelStore.ts       # 채널 상태
│   │   ├── messageStore.ts       # 메시지 상태
│   │   ├── themeStore.ts         # 테마 상태
│   │   ├── uiStore.ts            # UI 상태
│   │   └── index.ts
│   │
│   ├── shared/                   # 공유 유틸리티
│   │   ├── constants/            # 상수
│   │   ├── types/                # 공유 타입
│   │   ├── utils/                # 유틸리티 함수
│   │   └── index.ts
│   │
│   ├── assets/                   # 정적 자산
│   ├── main.tsx                  # 앱 진입점
│   └── index.css                 # 전역 스타일
│
├── public/                       # 정적 파일
├── package.json                  # 의존성 관리
├── tsconfig.json                 # TypeScript 설정
├── vite.config.ts                # Vite 설정
└── README.md                     # 프로젝트 문서
```

## 계층별 설명

### 1. Domain Layer (도메인 계층)

- **목적**: 비즈니스 로직과 규칙을 포함
- **의존성**: 외부 계층에 의존하지 않음
- **구성요소**:
  - **Entities**: 비즈니스 엔티티 (User, Channel, Message)
  - **Value Objects**: 불변 값 객체 (Email, UserId, ChannelId, MessageId)
  - **Repository Interfaces**: 데이터 접근 인터페이스
  - **Domain Use Cases**: 핵심 비즈니스 유스케이스
  - **Domain Errors**: 도메인별 에러 타입

### 2. Application Layer (애플리케이션 계층)

- **목적**: 도메인 계층을 조합하여 애플리케이션 기능 구현
- **의존성**: 도메인 계층에만 의존
- **구성요소**:
  - **Application Use Cases**: 복합적인 비즈니스 로직
  - **Application Services**: 도메인 간 조정 서비스

### 3. Infrastructure Layer (인프라스트럭처 계층)

- **목적**: 외부 시스템과의 통신 및 데이터 영속성
- **의존성**: 도메인 계층의 인터페이스 구현
- **구성요소**:
  - **Repository Implementations**: 리포지토리 인터페이스 구현체
  - **API Client**: HTTP 통신 클라이언트
  - **WebSocket Client**: 실시간 통신 클라이언트

### 4. Presentation Layer (프레젠테이션 계층)

- **목적**: 사용자 인터페이스와 사용자 상호작용
- **의존성**: 애플리케이션 계층에 의존
- **구성요소**:
  - **React Components**: UI 컴포넌트
  - **Pages**: 페이지 컴포넌트
  - **Hooks**: 커스텀 React 훅
  - **Routes**: 라우팅 설정

## 의존성 주입 (Dependency Injection)

프로젝트는 의존성 주입 패턴을 사용하여 느슨한 결합을 구현합니다:

```typescript
// DI 토큰 정의
export const DI_TOKENS = {
  API_CLIENT: Symbol('ApiClient'),
  USER_REPOSITORY: Symbol('UserRepository'),
  USER_USE_CASES: Symbol('UserUseCases'),
  // ...
};

// DI 컨테이너에서 서비스 등록
container.register(
  DI_TOKENS.USER_REPOSITORY,
  () => {
    const apiClient = container.get<ApiClient>(DI_TOKENS.API_CLIENT);
    return new UserRepositoryImpl(apiClient);
  },
  true
);

// 컴포넌트에서 사용
const { userUseCases } = useUseCaseContext();
```

## 상태 관리

Zustand를 사용한 상태 관리:

```typescript
// 스토어 정의
export const useUserStore = create<UserStore>(set => ({
  user: null,
  setUser: user => set({ user }),
  clearUser: () => set({ user: null }),
}));

// 컴포넌트에서 사용
const { user, setUser } = useUserStore();
```

## 에러 처리

도메인별 에러 타입을 정의하여 일관된 에러 처리를 구현:

```typescript
// 도메인 에러 정의
export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`, 'USER_NOT_FOUND', { userId });
  }
}

// 에러 팩토리 사용
throw DomainErrorFactory.createUserNotFound(userId);
```

## 주요 개선사항

### 1. 도메인 엔티티 강화

- 비즈니스 규칙과 유효성 검사를 엔티티 내부에 캡슐화
- 불변성 보장을 위한 팩토리 메서드 패턴 적용
- 도메인 로직의 명확한 분리

### 2. 값 객체 도입

- ID, 이메일 등의 기본 타입을 값 객체로 래핑
- 타입 안전성과 도메인 의미 강화
- 유효성 검사 로직 캡슐화

### 3. 리포지토리 패턴 개선

- 인터페이스와 구현체의 명확한 분리
- 도메인 중심의 메서드명 사용
- 일관된 에러 처리

### 4. Use Case 패턴 적용

- Request/Response 객체를 통한 명확한 입출력 정의
- 비즈니스 로직의 단일 책임 원칙 준수
- 테스트 가능한 구조

### 5. 의존성 역전 원칙 적용

- 도메인 계층이 외부 계층에 의존하지 않음
- 인터페이스를 통한 느슨한 결합
- 의존성 주입을 통한 제어 역전

## 개발 가이드라인

### 1. 새로운 기능 추가 시

1. 도메인 계층에 엔티티/값 객체 정의
2. 리포지토리 인터페이스 정의
3. 애플리케이션 계층에 Use Case 구현
4. 인프라스트럭처 계층에 구현체 작성
5. 프레젠테이션 계층에 UI 구현

### 2. 테스트 작성 시

- 각 계층별로 독립적인 테스트 작성
- 도메인 로직은 단위 테스트로 검증
- Use Case는 통합 테스트로 검증
- UI는 컴포넌트 테스트로 검증

### 3. 코드 품질

- TypeScript의 엄격한 타입 체크 활용
- ESLint와 Prettier를 통한 코드 스타일 통일
- 의존성 주입을 통한 테스트 가능성 확보

이 구조를 통해 유지보수성, 확장성, 테스트 가능성을 모두 확보할 수 있습니다.
