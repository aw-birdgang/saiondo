# ReactWeb - Clean Architecture 기반 고성능 웹 애플리케이션

## 📋 프로젝트 개요

이 프로젝트는 **Clean Architecture** 원칙을 기반으로 구축된 고성능 웹 애플리케이션입니다. 
실시간 채팅, 파일 공유, 사용자 관리 등의 기능을 제공하며, 프로덕션 환경에서 사용할 수 있도록 
고급 모니터링, 보안, 캐싱 기능이 통합되어 있습니다.

## 🏗️ 아키텍처 구조

```
📁 frontend/ReactWeb/
├── 📁 src/
│   ├── 📁 application/           # Application Layer
│   │   ├── 📁 services/          # 비즈니스 로직 캡슐화
│   │   │   ├── AuthService.ts
│   │   │   ├── NotificationService.ts
│   │   │   ├── UserActivityService.ts
│   │   │   ├── UserPermissionService.ts
│   │   │   ├── RealTimeChatService.ts
│   │   │   ├── FileService.ts
│   │   │   ├── CacheService.ts
│   │   │   ├── MonitoringService.ts
│   │   │   ├── WebSocketService.ts
│   │   │   ├── PerformanceMonitoringService.ts
│   │   │   ├── ErrorHandlingService.ts
│   │   │   ├── AnalyticsService.ts
│   │   │   ├── MultiLevelCacheService.ts
│   │   │   ├── SecurityService.ts
│   │   │   └── SystemHealthService.ts
│   │   ├── 📁 usecases/          # 워크플로우 오케스트레이션
│   │   │   ├── GetCurrentUserUseCase.ts
│   │   │   ├── CreateChannelUseCase.ts
│   │   │   ├── UserActivityLogUseCase.ts
│   │   │   ├── UserPermissionUseCase.ts
│   │   │   ├── RealTimeChatUseCase.ts
│   │   │   ├── NotificationUseCase.ts
│   │   │   ├── UploadFileUseCase.ts
│   │   │   ├── CacheUseCase.ts
│   │   │   ├── MonitoringUseCase.ts
│   │   │   ├── WebSocketUseCase.ts
│   │   │   ├── AnalyticsUseCase.ts
│   │   │   └── SystemManagementUseCase.ts
│   │   ├── 📁 dto/               # 데이터 전송 객체
│   │   └── UseCaseFactory.ts     # Use Case 팩토리
│   ├── 📁 domain/                # Domain Layer
│   │   ├── 📁 entities/          # 도메인 엔티티
│   │   ├── 📁 repositories/      # 리포지토리 인터페이스
│   │   └── 📁 dto/               # 도메인 DTO
│   └── 📁 infrastructure/        # Infrastructure Layer
│       ├── 📁 repositories/      # 리포지토리 구현
│       └── 📁 clients/           # 외부 서비스 클라이언트
```

## 🚀 주요 기능

### 1. **실시간 채팅**
- WebSocket 기반 실시간 메시징
- 타이핑 인디케이터
- 읽음 확인
- 채널 관리

### 2. **파일 관리**
- 파일 업로드/다운로드
- 파일 타입 검증
- 용량 제한 관리

### 3. **사용자 관리**
- 인증/인가
- 권한 관리
- 사용자 활동 추적

### 4. **고급 모니터링**
- 성능 모니터링
- 에러 추적
- 보안 위반 감지
- 실시간 알림

### 5. **캐싱 시스템**
- 다단계 캐싱 (L1, L2, L3)
- 압축 지원
- 자동 만료 관리

### 6. **보안 기능**
- Rate Limiting
- XSS/CSRF 방지
- 입력 검증
- IP 차단

## 🛠️ 사용법

### 1. **기본 Use Case 사용**

```typescript
import { UseCaseFactory } from './application/usecases/UseCaseFactory';

// 사용자 정보 조회
const getUserUseCase = UseCaseFactory.createGetCurrentUserUseCase();
const user = await getUserUseCase.execute(userId);

// 채널 생성
const createChannelUseCase = UseCaseFactory.createCreateChannelUseCase();
const channel = await createChannelUseCase.execute({
  name: 'General',
  description: 'General discussion'
});
```

### 2. **고급 기능 사용**

```typescript
// 시스템 관리
const systemManagement = UseCaseFactory.createSystemManagementUseCase();

// 시스템 개요 조회
const overview = await systemManagement.getSystemOverview();

// 실시간 모니터링
const monitoring = await systemManagement.getRealTimeMonitoring();

// 시스템 진단
const diagnosis = await systemManagement.diagnoseSystem();
```

### 3. **성능 모니터링**

```typescript
// 성능 측정
const performanceService = new PerformanceMonitoringService(
  userRepository,
  channelRepository,
  messageRepository
);

const result = await performanceService.measurePerformance(
  'user_operation',
  async () => {
    // 측정할 작업
    return await someOperation();
  }
);
```

### 4. **보안 기능**

```typescript
// 입력 검증
const securityService = new SecurityService();
const validation = securityService.validateInput(data, {
  username: { required: true, type: 'string', minLength: 3 },
  email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
});

// Rate Limiting
const rateLimit = securityService.checkRateLimit(userId, {
  windowMs: 60000,
  maxRequests: 100
});
```

## 📊 모니터링 및 분석

### 1. **시스템 건강 상태**

```typescript
const healthService = new SystemHealthService(
  userRepository,
  channelRepository,
  messageRepository
);

const health = await healthService.getSystemHealth();
console.log('System Status:', health.overall);
console.log('Components:', health.components);
console.log('Alerts:', health.alerts);
```

### 2. **성능 메트릭**

```typescript
const metrics = await healthService.getSystemMetrics();
console.log('Response Time:', metrics.performance.averageResponseTime);
console.log('Error Rate:', metrics.performance.errorRate);
console.log('Cache Hit Rate:', metrics.cache.hitRate);
```

### 3. **사용자 분석**

```typescript
const analyticsService = new AnalyticsService(
  userRepository,
  channelRepository,
  messageRepository
);

// 사용자 행동 분석
const behavior = analyticsService.analyzeUserBehavior(userId, {
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일
  end: new Date()
});

// 이탈 예측
const churnPrediction = analyticsService.predictUserChurn(userId);
```

## 🔧 설정 및 구성

### 1. **캐시 설정**

```typescript
const cacheConfig = {
  levels: [
    { name: 'L1', ttl: 60000, maxSize: 1000, priority: 1 },    // 1분
    { name: 'L2', ttl: 300000, maxSize: 5000, priority: 2 },   // 5분
    { name: 'L3', ttl: 1800000, maxSize: 10000, priority: 3 }, // 30분
  ],
  enableCompression: true,
  enableMetrics: true,
};
```

### 2. **보안 설정**

```typescript
const securityConfig = {
  enableRateLimiting: true,
  enableInputValidation: true,
  enableXSSProtection: true,
  enableCSRFProtection: true,
  maxRequestSize: 10 * 1024 * 1024, // 10MB
  sessionTimeout: 30 * 60 * 1000,   // 30분
};
```

### 3. **모니터링 설정**

```typescript
const monitoringConfig = {
  checkInterval: 30000, // 30초
  enableMetrics: true,
  enableAlerts: true,
  alertThresholds: {
    responseTime: 1000,    // 1초
    errorRate: 0.05,       // 5%
    memoryUsage: 0.85,     // 85%
  }
};
```

## 🚀 성능 최적화

### 1. **캐싱 전략**

- **L1 캐시**: 자주 접근하는 데이터 (1분 TTL)
- **L2 캐시**: 중간 빈도 데이터 (5분 TTL)
- **L3 캐시**: 덜 자주 접근하는 데이터 (30분 TTL)

### 2. **배치 처리**

```typescript
// 배치 캐시 조회
const cacheService = new MultiLevelCacheService(
  userRepository,
  channelRepository,
  messageRepository,
  cacheConfig
);

const users = await cacheService.batchGet(userIds, async (keys) => {
  return await userRepository.findByIds(keys);
});
```

### 3. **성능 모니터링**

- 실시간 응답 시간 측정
- 에러율 추적
- 리소스 사용량 모니터링
- 자동 성능 알림

## 🔒 보안 기능

### 1. **입력 검증**

```typescript
const schema = {
  username: { required: true, type: 'string', minLength: 3, maxLength: 20 },
  email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { required: true, type: 'string', minLength: 8 }
};

const validation = securityService.validateInput(userData, schema);
if (!validation.isValid) {
  throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
}
```

### 2. **Rate Limiting**

```typescript
const rateLimit = securityService.checkRateLimit(userId, {
  windowMs: 60000,    // 1분
  maxRequests: 100    // 최대 100개 요청
});

if (!rateLimit.allowed) {
  throw new Error('Rate limit exceeded');
}
```

### 3. **XSS 방지**

```typescript
const sanitizedInput = securityService.sanitizeInput(userInput);
```

## 📈 분석 및 인사이트

### 1. **사용자 행동 분석**

- 페이지 뷰 추적
- 사용자 세션 분석
- 활동 패턴 분석
- 이탈 예측

### 2. **성능 분석**

- 응답 시간 분포
- 에러 패턴 분석
- 리소스 사용량 트렌드
- 병목 지점 식별

### 3. **보안 분석**

- 공격 패턴 분석
- 위반 유형별 통계
- IP 기반 위험도 평가
- 자동 대응 권장사항

## 🛠️ 개발 가이드

### 1. **새로운 기능 추가**

```typescript
// 1. Service 생성 (복잡한 비즈니스 로직)
export class NewFeatureService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly performanceService: PerformanceMonitoringService
  ) {}

  async complexBusinessLogic(data: any) {
    return await this.performanceService.measurePerformance(
      'new_feature_operation',
      async () => {
        // 비즈니스 로직 구현
        return await this.processData(data);
      }
    );
  }
}

// 2. Use Case 생성 (워크플로우 오케스트레이션)
export class NewFeatureUseCase {
  constructor(private readonly newFeatureService: NewFeatureService) {}
  
  async execute(request: any) {
    return await this.newFeatureService.complexBusinessLogic(request);
  }
}

// 3. Factory에 추가
static createNewFeatureUseCase(): NewFeatureUseCase {
  const newFeatureService = new NewFeatureService(
    container.getUserRepository(),
    container.getPerformanceMonitoringService()
  );
  return new NewFeatureUseCase(newFeatureService);
}
```

### 2. **테스트 작성**

```typescript
describe('NewFeatureUseCase', () => {
  let useCase: NewFeatureUseCase;
  let mockService: jest.Mocked<NewFeatureService>;

  beforeEach(() => {
    mockService = createMockNewFeatureService();
    useCase = new NewFeatureUseCase(mockService);
  });

  it('should process data correctly', async () => {
    const request = { data: 'test' };
    const expectedResult = { processed: true };

    mockService.complexBusinessLogic.mockResolvedValue(expectedResult);

    const result = await useCase.execute(request);

    expect(result).toEqual(expectedResult);
    expect(mockService.complexBusinessLogic).toHaveBeenCalledWith(request);
  });
});
```

## 📚 API 문서

### Use Case API

각 Use Case는 다음과 같은 패턴을 따릅니다:

```typescript
interface UseCaseRequest {
  // 요청 데이터
}

interface UseCaseResponse {
  // 응답 데이터
}

class UseCase {
  async execute(request: UseCaseRequest): Promise<UseCaseResponse> {
    // 구현
  }
}
```

### Service API

각 Service는 다음과 같은 패턴을 따릅니다:

```typescript
interface ServiceConfig {
  // 설정 옵션
}

class Service {
  constructor(config?: ServiceConfig) {}
  
  async methodName(params: any): Promise<any> {
    // 구현
  }
}
```

## 🚀 배포 및 운영

### 1. **프로덕션 준비**

- 모든 모니터링 기능 활성화
- 보안 설정 강화
- 캐시 최적화
- 에러 로깅 설정

### 2. **성능 모니터링**

- 실시간 시스템 건강 상태 확인
- 성능 메트릭 추적
- 자동 알림 설정
- 정기적인 최적화 권장사항 검토

### 3. **보안 모니터링**

- 보안 위반 실시간 감지
- IP 차단 자동화
- 정기적인 보안 리포트 생성
- 보안 설정 자동 업데이트

## 🤝 기여 가이드

1. **Fork** the repository
2. **Create** a feature branch
3. **Implement** your changes following Clean Architecture principles
4. **Add** tests for new functionality
5. **Update** documentation
6. **Submit** a pull request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해주세요.

---

**이 프로젝트는 Clean Architecture 원칙을 기반으로 구축되어 확장성, 유지보수성, 테스트 용이성을 보장합니다.**
