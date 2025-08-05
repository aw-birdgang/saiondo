# ReactWeb 프로젝트 - 클린 아키텍처 다이어그램

## 전체 아키텍처 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  React Components │ Pages │ Hooks │ Routes │ Contexts │ Stores  │
│                                                                 │
│  ┌─────────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │ Components  │ │ Pages   │ │ Hooks   │ │ Routes  │ │ Stores  │ │
│  │             │ │         │ │         │ │         │ │         │ │
│  │ • Common    │ │ • Auth  │ │ • useDI │ │ • App   │ │ • Auth  │ │
│  │ • Layout    │ │ • Chat  │ │ • useUC │ │ Routes  │ │ • User  │ │
│  │ • Specific  │ │ • Channel│ │ • useAuth│ │         │ │ • Channel│ │
│  └─────────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                    Use Cases & Services                         │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │ UserUseCases│ │ChannelUseCases│ │MessageUseCases│ │ Services   │ │
│  │             │ │             │ │             │ │             │ │
│  │ • createUser│ │ • createChannel│ │ • createMessage│ │ • AuthService│ │
│  │ • updateUser│ │ • getChannel │ │ • getMessage │ │ • Notification│ │
│  │ • getUser   │ │ • addMember │ │ • updateMessage│ │   Service   │ │
│  │ • searchUsers│ │ • removeMember│ │ • deleteMessage│ │             │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│              Entities │ Value Objects │ Repositories            │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │   Entities  │ │Value Objects│ │Repositories │ │ Use Cases   │ │
│  │             │ │             │ │             │ │             │ │
│  │ • User      │ │ • Email     │ │ • IUserRepo │ │ • GetCurrent│ │
│  │ • Channel   │ │ • UserId    │ │ • IChannelRepo│ │   UserUC   │ │
│  │ • Message   │ │ • ChannelId │ │ • IMessageRepo│ │ • UpdateUser│ │
│  │             │ │ • MessageId │ │             │ │   UC        │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Domain Errors                            │ │
│  │  • UserNotFoundError  • ChannelNotFoundError               │ │
│  │  • MessageValidationError  • AuthenticationError           │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                INFRASTRUCTURE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│              Repositories │ API │ WebSocket │ External Services │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │Repositories │ │    API      │ │ WebSocket   │ │   External  │ │
│  │             │ │             │ │             │ │   Services  │ │
│  │ • UserRepoImpl│ │ • ApiClient │ │ • WebSocketClient│ │ • Firebase │ │
│  │ • ChannelRepoImpl│ │ • endpoints │ │ • Socket.IO │ │ • Auth0   │ │
│  │ • MessageRepoImpl│ │ • services │ │ • Real-time │ │ • AWS S3  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 의존성 방향

```
Presentation Layer
        │
        ▼ (depends on)
Application Layer
        │
        ▼ (depends on)
Domain Layer
        │
        ▲ (implements)
Infrastructure Layer
```

## 의존성 주입 (DI) 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                        DI Container                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │   Tokens    │ │  Container  │ │   Config    │ │   Hooks     │ │
│  │             │ │             │ │             │ │             │ │
│  │ • API_CLIENT│ │ • register  │ │ • api       │ │ • useDI     │ │
│  │ • USER_REPO │ │ • get       │ │ • websocket │ │ • useUseCases│ │
│  │ • USER_UC   │ │ • resolve   │ │ • auth      │ │ • useAuth   │ │
│  │ • CHANNEL_UC│ │ • has       │ │ • theme     │ │ • useTheme  │ │
│  │ • MESSAGE_UC│ │ • clear     │ │             │ │             │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Service Registration                     │ │
│  │  container.register(USER_REPO, () => new UserRepoImpl())   │ │
│  │  container.register(USER_UC, () => new UserUseCases())     │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 데이터 흐름

```
User Action
    │
    ▼
React Component (Presentation)
    │
    ▼
Custom Hook (Presentation)
    │
    ▼
Use Case (Application)
    │
    ▼
Repository Interface (Domain)
    │
    ▼
Repository Implementation (Infrastructure)
    │
    ▼
API Client (Infrastructure)
    │
    ▼
External API
```

## 상태 관리 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                    Zustand Stores                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │ Auth Store  │ │ User Store  │ │Channel Store│ │Message Store│ │
│  │             │ │             │ │             │ │             │ │
│  │ • isAuth    │ │ • user      │ │ • channels  │ │ • messages  │ │
│  │ • token     │ │ • profile   │ │ • current   │ │ • unread    │ │
│  │ • login     │ │ • settings  │ │ • members   │ │ • typing    │ │
│  │ • logout    │ │ • update    │ │ • create    │ │ • send      │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐                               │
│  │Theme Store  │ │  UI Store   │                               │
│  │             │ │             │                               │
│  │ • isDark    │ │ • sidebar   │                               │
│  │ • colors    │ │ • modal     │                               │
│  │ • toggle    │ │ • loading   │                               │
│  │ • setTheme  │ │ • notification│                             │
│  └─────────────┘ └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

## 에러 처리 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                    Error Handling                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │Domain Errors│ │Error Factory│ │Error Handler│ │Error Display│ │
│  │             │ │             │ │             │ │             │ │
│  │ • UserError │ │ • createUser│ │ • catch     │ │ • Toast     │ │
│  │ • ChannelError│ │ • createChannel│ │ • log     │ │ • Modal    │ │
│  │ • MessageError│ │ • createMessage│ │ • notify  │ │ • Alert    │ │
│  │ • AuthError │ │ • createAuth│ │ • retry     │ │ • Snackbar  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 테스트 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                        Testing Strategy                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │ Unit Tests  │ │Integration  │ │Component    │ │ E2E Tests   │ │
│  │             │ │   Tests     │ │   Tests     │ │             │ │
│  │ • Entities  │ │ • Use Cases │ │ • Components│ │ • User Flow │ │
│  │ • Value Obj │ │ • Services  │ │ • Pages     │ │ • Auth Flow │ │
│  │ • Repositories│ │ • Repositories│ │ • Hooks     │ │ • Chat Flow │ │
│  │ • Use Cases │ │ • API       │ │ • Contexts  │ │ • Settings  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 개발 워크플로우

```
1. Domain Layer
   ├── Define Entities & Value Objects
   ├── Create Repository Interfaces
   ├── Implement Domain Use Cases
   └── Define Domain Errors

2. Application Layer
   ├── Implement Application Use Cases
   ├── Create Application Services
   └── Define Request/Response DTOs

3. Infrastructure Layer
   ├── Implement Repository Classes
   ├── Create API Clients
   ├── Set up External Services
   └── Configure DI Container

4. Presentation Layer
   ├── Create React Components
   ├── Implement Pages
   ├── Set up Routing
   ├── Create Custom Hooks
   └── Configure State Management

5. Testing
   ├── Write Unit Tests
   ├── Write Integration Tests
   ├── Write Component Tests
   └── Write E2E Tests
```

이 구조를 통해 각 계층이 명확히 분리되어 있어 유지보수성, 테스트 가능성, 확장성을 모두 확보할 수 있습니다.
