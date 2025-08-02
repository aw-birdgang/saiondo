# 🎣 Presentation Layer Hooks

## 📋 **개요**

이 디렉토리는 클린 아키텍처의 **Presentation Layer**에 속하는 React Hooks들을 포함합니다. 모든 Hooks는 UI 로직과 상태 관리를 담당하며, Application Layer의 Use Cases와 연동됩니다.

## 🏗️ **클린 아키텍처에서의 위치**

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  (React Components, Hooks, Stores) ← 여기에 위치         │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│  (Use Cases)                                               │
├─────────────────────────────────────────────────────────────┤
│                     Domain Layer                            │
│  (Entities, Repositories, Value Objects)                   │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                       │
│  (API Client, Repository Implementations)                  │
└─────────────────────────────────────────────────────────────┘
```

## 📁 **Hook 유형별 분류**

### **1. UI State Hooks** (기본 UI 상태 관리)
- `useTheme.ts` - 테마 상태 관리
- `useAuth.ts` - 인증 상태 관리 (Zustand Store 연동)

### **2. Domain State Hooks** (도메인 상태 관리)
- `useUser.ts` - 사용자 상태 관리 (Store + Context 연동)
- `useChannels.ts` - 채널 상태 관리
- `useMessages.ts` - 메시지 상태 관리

### **3. Application Integration Hooks** (Application Layer 연동)
- `useProductionFeatures.ts` - 프로덕션 기능 통합 (Use Cases 연동)

## 🔧 **Hook 사용법**

### **1. 기본 UI Hooks**

#### **useTheme**
```typescript
import { useTheme } from '../presentation/hooks';

const MyComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <div className={theme}>
      <button onClick={toggleTheme}>
        {isDark ? '라이트 모드' : '다크 모드'}
      </button>
    </div>
  );
};
```

#### **useAuth**
```typescript
import { useAuth } from '../presentation/hooks';

const LoginComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    loading, 
    error 
  } = useAuth();

  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'password' });
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>로그아웃</button>
      ) : (
        <button onClick={handleLogin} disabled={loading}>
          로그인
        </button>
      )}
      {error && <p>에러: {error}</p>}
    </div>
  );
};
```

### **2. Domain State Hooks**

#### **useUser**
```typescript
import { useUser } from '../presentation/hooks';

const UserProfile = () => {
  const { 
    currentUser, 
    updateUserProfile, 
    refreshUser, 
    loading 
  } = useUser();

  const handleUpdateProfile = async () => {
    await updateUserProfile({
      displayName: '새 이름',
      avatar: 'new-avatar.jpg'
    });
  };

  return (
    <div>
      {currentUser && (
        <div>
          <h2>{currentUser.displayName}</h2>
          <img src={currentUser.avatar} alt="Avatar" />
          <button onClick={handleUpdateProfile}>프로필 업데이트</button>
        </div>
      )}
    </div>
  );
};
```

#### **useChannels**
```typescript
import { useChannels } from '../presentation/hooks';

const ChannelList = () => {
  const { 
    channels, 
    selectedChannel, 
    selectChannel, 
    loading 
  } = useChannels();

  return (
    <div>
      {channels.map(channel => (
        <div 
          key={channel.id}
          onClick={() => selectChannel(channel.id)}
          className={selectedChannel?.id === channel.id ? 'selected' : ''}
        >
          {channel.name}
        </div>
      ))}
    </div>
  );
};
```

#### **useMessages**
```typescript
import { useMessages } from '../presentation/hooks';

const MessageList = () => {
  const { 
    messages, 
    sendMessage, 
    loading, 
    hasMore, 
    loadMore 
  } = useMessages();

  const handleSendMessage = async (content: string) => {
    await sendMessage({
      content,
      channelId: 'channel-id'
    });
  };

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <strong>{message.sender.displayName}</strong>
          <p>{message.content}</p>
        </div>
      ))}
      {hasMore && (
        <button onClick={loadMore}>더 보기</button>
      )}
    </div>
  );
};
```

### **3. Application Integration Hooks**

#### **useProductionFeatures**
```typescript
import { useProductionFeatures } from '../presentation/hooks';

const ProductionComponent = () => {
  const {
    connectWebSocket,
    disconnectWebSocket,
    sendRealTimeMessage,
    getUserWithCache,
    startTrace,
    endTrace,
    isConnected,
    connectionStatus,
    lastMessage,
    cacheStats,
    apmStats
  } = useProductionFeatures({
    websocket: { 
      url: 'wss://example.com',
      reconnectInterval: 5000 
    },
    redis: { 
      host: 'redis.example.com',
      port: 6379 
    },
    apm: { 
      enabled: true,
      sampleRate: 0.1 
    }
  });

  useEffect(() => {
    // WebSocket 연결
    connectWebSocket('user-id');
    
    // 성능 추적 시작
    const traceId = startTrace('component-mount', 'component');
    
    return () => {
      // WebSocket 연결 해제
      disconnectWebSocket();
      // 성능 추적 종료
      endTrace(traceId);
    };
  }, []);

  const handleSendMessage = async () => {
    await sendRealTimeMessage('Hello World!', 'channel-id', 'user-id');
  };

  const handleGetUser = async () => {
    const user = await getUserWithCache('user-id');
    console.log('User from cache:', user);
  };

  return (
    <div>
      <div>연결 상태: {connectionStatus}</div>
      <div>캐시 통계: {JSON.stringify(cacheStats)}</div>
      <div>APM 통계: {JSON.stringify(apmStats)}</div>
      <button onClick={handleSendMessage}>메시지 전송</button>
      <button onClick={handleGetUser}>사용자 조회</button>
    </div>
  );
};
```

## 🎯 **클린 아키텍처 원칙 준수**

### **1. 의존성 방향**
```
Presentation Hooks → Application Layer (Use Cases) → Domain Layer
```

- ✅ Hooks는 Application Layer의 Use Cases에만 의존
- ✅ Hooks는 Domain Layer에 직접 의존하지 않음
- ✅ Hooks는 Infrastructure Layer에 직접 의존하지 않음

### **2. 책임 분리**
- ✅ **UI State Hooks**: 순수한 UI 상태 관리
- ✅ **Domain State Hooks**: 도메인 상태와 Store 연동
- ✅ **Application Integration Hooks**: Use Cases와 연동하여 비즈니스 로직 조정

### **3. 테스트 가능성**
- ✅ 각 Hook은 독립적으로 테스트 가능
- ✅ Use Cases를 Mock으로 대체하여 테스트
- ✅ UI 로직과 비즈니스 로직 분리

## 📊 **Hook 구조 요약**

| Hook 유형 | 파일 | 책임 | 의존성 |
|-----------|------|------|--------|
| UI State | `useTheme.ts` | 테마 상태 관리 | Zustand Store |
| UI State | `useAuth.ts` | 인증 상태 관리 | Zustand Store |
| Domain State | `useUser.ts` | 사용자 상태 관리 | Store + Context |
| Domain State | `useChannels.ts` | 채널 상태 관리 | Zustand Store |
| Domain State | `useMessages.ts` | 메시지 상태 관리 | Zustand Store |
| Application Integration | `useProductionFeatures.ts` | 프로덕션 기능 통합 | Use Cases |

## 🎉 **결론**

모든 Hooks가 클린 아키텍처의 **Presentation Layer**에 올바르게 위치하며, 각각의 책임과 의존성이 명확하게 분리되어 있습니다. 이를 통해 코드의 유지보수성, 테스트 가능성, 그리고 확장성을 크게 향상시킬 수 있습니다. 🚀 