# 🔄 UseCase Service 사용 예제

## 📋 **개요**

새로운 UseCase Service 구조를 사용하는 방법을 보여주는 예제입니다.

## 🎯 **사용 방법**

### **1. UseCase Service 직접 사용**

```typescript
import { AnalyticsUseCaseService } from './usecases/services/analytics/AnalyticsUseCaseService';
import { ChannelUseCaseService } from './usecases/services/channel/ChannelUseCaseService';
import { AnalyticsService } from './services/analytics/AnalyticsService';
import { ChannelService } from './services/channel/ChannelService';
import { ConsoleLogger } from '../../domain/interfaces/ILogger';
import { MemoryCache } from './services/base/BaseCacheService';

// 서비스 인스턴스 생성
const logger = new ConsoleLogger();
const cache = new MemoryCache();

// Base Services 생성
const analyticsService = new AnalyticsService(
  mockAnalyticsRepository,
  userRepository,
  channelRepository,
  messageRepository,
  logger
);

const channelService = new ChannelService(
  channelRepository,
  userRepository,
  messageRepository,
  logger
);

// UseCase Services 생성
const analyticsUseCaseService = new AnalyticsUseCaseService(
  analyticsService,
  cache,
  logger
);

const channelUseCaseService = new ChannelUseCaseService(
  channelService,
  userService,
  cache,
  logger
);

// 사용 예제
async function example() {
  // 1. 이벤트 추적
  await analyticsUseCaseService.trackEvent({
    userId: 'user-123',
    eventType: 'page_view',
    properties: { page: '/dashboard' },
    sessionId: 'session-456'
  });

  // 2. 채널 생성
  const channelResponse = await channelUseCaseService.createChannel({
    name: 'General',
    description: 'General discussion channel',
    type: 'public',
    ownerId: 'user-123',
    members: ['user-123', 'user-456']
  });

  // 3. 분석 리포트 생성
  const reportResponse = await analyticsUseCaseService.generateAnalyticsReport({
    timeRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31')
    }
  });

  console.log('Channel created:', channelResponse.channel);
  console.log('Analytics report:', reportResponse.report);
}
```

### **2. UseCase Factory를 통한 사용**

```typescript
import { UseCaseFactory } from './usecases/UseCaseFactory';
import { AnalyticsUseCaseService } from './usecases/services/analytics/AnalyticsUseCaseService';
import { ChannelUseCaseService } from './usecases/services/channel/ChannelUseCaseService';

// UseCase Service 인스턴스 생성
const analyticsUseCaseService = new AnalyticsUseCaseService(/* dependencies */);
const channelUseCaseService = new ChannelUseCaseService(/* dependencies */);

// UseCase Factory를 통한 UseCase 생성
const analyticsUseCase = UseCaseFactory.createAnalyticsUseCaseWithService(analyticsUseCaseService);
const createChannelUseCase = UseCaseFactory.createCreateChannelUseCaseWithService(channelUseCaseService);

// 사용 예제
async function exampleWithFactory() {
  // 1. 분석 UseCase 사용
  await analyticsUseCase.trackPageView('user-123', '/dashboard');
  await analyticsUseCase.trackMessageSent('user-123', 'channel-456', 150);

  // 2. 채널 생성 UseCase 사용
  const channelResponse = await createChannelUseCase.execute({
    name: 'Development',
    description: 'Development team channel',
    type: 'private',
    ownerId: 'user-123',
    members: ['user-123', 'user-789']
  });

  console.log('Channel created:', channelResponse.channel);
}
```

### **3. 그룹화된 UseCase 사용**

```typescript
import { UseCaseFactory } from './usecases/UseCaseFactory';
import { AnalyticsUseCaseService } from './usecases/services/analytics/AnalyticsUseCaseService';
import { ChannelUseCaseService } from './usecases/services/channel/ChannelUseCaseService';

// UseCase Service 인스턴스 생성
const analyticsUseCaseService = new AnalyticsUseCaseService(/* dependencies */);
const channelUseCaseService = new ChannelUseCaseService(/* dependencies */);

// 그룹화된 UseCase 생성
const allUseCases = UseCaseFactory.createAllUseCasesWithService(
  analyticsUseCaseService,
  channelUseCaseService
);

// 사용 예제
async function exampleWithGroupedUseCases() {
  // 분석 관련 UseCase
  await allUseCases.system.analytics.trackEvent('user-123', 'login', { method: 'email' });
  const behavior = await allUseCases.system.analytics.analyzeUserBehavior('user-123', {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31')
  });

  // 채널 관련 UseCase
  const channelResponse = await allUseCases.channel.create.execute({
    name: 'Marketing',
    description: 'Marketing team channel',
    type: 'public',
    ownerId: 'user-123',
    members: ['user-123', 'user-456', 'user-789']
  });

  console.log('User behavior:', behavior);
  console.log('Channel created:', channelResponse.channel);
}
```

## 🔧 **DI Container 통합**

### **1. DI Container 설정**

```typescript
import { container } from '../../di/container';

// DI Container에서 서비스 가져오기
const analyticsUseCaseService = container.getAnalyticsUseCaseService();
const channelUseCaseService = container.getChannelUseCaseService();

// UseCase 생성
const analyticsUseCase = UseCaseFactory.createAnalyticsUseCaseWithService(analyticsUseCaseService);
const createChannelUseCase = UseCaseFactory.createCreateChannelUseCaseWithService(channelUseCaseService);
```

### **2. React Hook 사용**

```typescript
import { useServices, useUseCases } from '../../di/useDI';

function MyComponent() {
  const { analyticsUseCaseService, channelUseCaseService } = useServices();
  const { analyticsUseCase, createChannelUseCase } = useUseCases();

  const handlePageView = async () => {
    await analyticsUseCase.trackPageView('user-123', '/profile');
  };

  const handleCreateChannel = async () => {
    const response = await createChannelUseCase.execute({
      name: 'New Channel',
      description: 'A new channel',
      type: 'public',
      ownerId: 'user-123',
      members: ['user-123']
    });
  };

  return (
    <div>
      <button onClick={handlePageView}>Track Page View</button>
      <button onClick={handleCreateChannel}>Create Channel</button>
    </div>
  );
}
```

## 📊 **성능 모니터링**

### **1. 캐시 통계 조회**

```typescript
// Analytics 캐시 통계
const analyticsCacheStats = await analyticsUseCaseService.getAnalyticsCacheStats();
console.log('Analytics cache stats:', analyticsCacheStats);

// 사용자 캐시 무효화
await analyticsUseCaseService.invalidateUserCache('user-123');
```

### **2. 성능 측정**

```typescript
// 모든 서비스에서 자동으로 성능 측정이 이루어집니다
// 로그에서 다음과 같은 정보를 확인할 수 있습니다:

// [INFO] Starting operation: track_event { operationId: "op_1234567890_abc123", operation: "track_event", context: { userId: "user-123", eventType: "page_view" } }
// [INFO] Operation completed: track_event { operationId: "op_1234567890_abc123", operation: "track_event", duration: "45.23ms", context: { userId: "user-123", eventType: "page_view" } }
```

## 🎯 **장점**

### **1. 코드 중복 제거**
- 공통 로직은 Base Service로 통합
- UseCase별 특화 로직만 분리

### **2. 캐싱 전략**
- 지능적인 캐싱으로 성능 향상
- 캐시 무효화 전략으로 데이터 일관성 보장

### **3. 성능 모니터링**
- 모든 작업에 대한 자동 성능 측정
- 상세한 로깅으로 디버깅 용이

### **4. 타입 안전성**
- 완전한 TypeScript 타입 정의
- 컴파일 타임 에러 방지

### **5. 확장성**
- 새로운 UseCase Service 쉽게 추가 가능
- 기존 코드와의 호환성 유지

## 🚀 **다음 단계**

1. **기존 서비스 마이그레이션**: 점진적으로 기존 서비스를 새로운 구조로 이전
2. **테스트 작성**: 각 레이어별 단위 테스트 및 통합 테스트
3. **성능 최적화**: 캐싱 전략 및 성능 모니터링 개선
4. **문서화**: API 문서 및 개발자 가이드 업데이트 