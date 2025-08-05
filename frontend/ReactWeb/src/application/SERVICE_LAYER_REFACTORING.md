# 🔄 Service Layer 리팩토링 가이드

## 📋 **현재 상황 분석**

### **중복되는 서비스들**
```
application/services/           application/usecases/services/
├── AnalyticsService.ts        ├── AnalyticsService.ts
├── ChannelService.ts          ├── ChannelService.ts
├── UserService.ts             ├── UserService.ts
├── MessageService.ts          ├── SearchService.ts
├── FileService.ts             ├── CategoryService.ts
├── AuthService.ts             ├── PaymentService.ts
└── ...                        └── InviteService.ts
```

## 🎯 **리팩토링 목표**

### **1. 역할 분리**
- **Base Services**: 도메인 로직과 인프라스트럭처 추상화
- **UseCase Services**: 특정 UseCase에 최적화된 서비스

### **2. 중복 제거**
- 공통 로직은 Base Service로 이동
- UseCase별 특화 로직만 UseCase Service에 유지

### **3. 의존성 명확화**
- UseCase Service → Base Service → Repository
- 명확한 계층 구조 확립

## 🏗️ **새로운 구조**

```
application/
├── services/                    # Base Services (도메인 로직)
│   ├── base/                   # 기본 서비스 추상화
│   │   ├── BaseService.ts
│   │   ├── BaseCacheService.ts
│   │   └── BaseValidationService.ts
│   ├── analytics/
│   │   ├── AnalyticsService.ts     # 핵심 분석 로직
│   │   └── AnalyticsRepository.ts
│   ├── channel/
│   │   ├── ChannelService.ts       # 핵심 채널 로직
│   │   └── ChannelRepository.ts
│   ├── user/
│   │   ├── UserService.ts          # 핵심 사용자 로직
│   │   └── UserRepository.ts
│   └── shared/                 # 공통 기능
│       ├── PerformanceMonitoringService.ts
│       ├── ErrorHandlingService.ts
│       ├── SecurityService.ts
│       └── CacheService.ts
├── usecases/
│   ├── services/               # UseCase 전용 서비스
│   │   ├── analytics/
│   │   │   └── AnalyticsUseCaseService.ts    # UseCase 특화
│   │   ├── channel/
│   │   │   └── ChannelUseCaseService.ts      # UseCase 특화
│   │   ├── user/
│   │   │   └── UserUseCaseService.ts         # UseCase 특화
│   │   └── specialized/        # 특화 서비스
│   │       ├── SearchService.ts
│   │       ├── CategoryService.ts
│   │       ├── PaymentService.ts
│   │       └── InviteService.ts
│   └── ...
└── dto/                        # Request/Response DTOs
    ├── analytics/
    ├── channel/
    └── user/
```

## 🔧 **리팩토링 단계**

### **Phase 1: Base Service 추상화**

#### **1.1 BaseService 추상 클래스 생성**
```typescript
// application/services/base/BaseService.ts
export abstract class BaseService<T> {
  protected abstract repository: T;
  
  protected async measurePerformance<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      console.log(`${operation} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`${operation} failed after ${duration}ms:`, error);
      throw error;
    }
  }
  
  protected validateInput<T>(data: T, schema: any): boolean {
    // 공통 입력 검증 로직
  }
}
```

#### **1.2 BaseCacheService 생성**
```typescript
// application/services/base/BaseCacheService.ts
export abstract class BaseCacheService {
  protected cache: ICache;
  
  constructor(cache?: ICache) {
    this.cache = cache || new MemoryCache();
  }
  
  protected async getCached<T>(key: string, ttl: number): Promise<T | null> {
    return this.cache.get<T>(key);
  }
  
  protected async setCached<T>(key: string, data: T, ttl: number): Promise<void> {
    this.cache.set(key, data, ttl);
  }
  
  protected invalidateCache(pattern: string): void {
    this.cache.delete(pattern);
  }
}
```

### **Phase 2: Base Service 리팩토링**

#### **2.1 AnalyticsService 리팩토링**
```typescript
// application/services/analytics/AnalyticsService.ts
export class AnalyticsService extends BaseService<IAnalyticsRepository> {
  constructor(
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly performanceService: PerformanceMonitoringService
  ) {
    super();
  }
  
  // 핵심 분석 로직만 유지
  async trackEvent(userId: string, eventType: string, properties?: Record<string, any>): Promise<void> {
    return this.measurePerformance('track_event', async () => {
      // 기본 이벤트 추적 로직
      await this.analyticsRepository.trackEvent(userId, eventType, properties);
    });
  }
  
  async generateAnalyticsReport(timeRange: { start: Date; end: Date }): Promise<AnalyticsReport> {
    return this.measurePerformance('generate_report', async () => {
      // 기본 리포트 생성 로직
      return await this.analyticsRepository.generateAnalyticsReport(timeRange);
    });
  }
  
  // UseCase Service에서 사용할 수 있는 기본 메서드들
  async getBasicUserBehavior(userId: string, timeRange: { start: Date; end: Date }): Promise<UserBehavior> {
    return await this.analyticsRepository.analyzeUserBehavior(userId, timeRange);
  }
}
```

#### **2.2 ChannelService 리팩토링**
```typescript
// application/services/channel/ChannelService.ts
export class ChannelService extends BaseService<IChannelRepository> {
  constructor(
    private readonly channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository,
    private readonly securityService: SecurityService
  ) {
    super();
  }
  
  // 핵심 채널 로직만 유지
  async createChannel(channelData: ChannelData): Promise<Channel> {
    return this.measurePerformance('create_channel', async () => {
      // 기본 채널 생성 로직
      return await this.channelRepository.createChannel(channelData);
    });
  }
  
  async getChannel(channelId: string): Promise<Channel> {
    return this.measurePerformance('get_channel', async () => {
      return await this.channelRepository.getChannel(channelId);
    });
  }
  
  // UseCase Service에서 사용할 수 있는 기본 메서드들
  async addMemberToChannel(channelId: string, userId: string): Promise<boolean> {
    return await this.channelRepository.addMember(channelId, userId);
  }
}
```

### **Phase 3: UseCase Service 리팩토링**

#### **3.1 AnalyticsUseCaseService 생성**
```typescript
// application/usecases/services/analytics/AnalyticsUseCaseService.ts
export class AnalyticsUseCaseService extends BaseCacheService {
  constructor(
    private readonly analyticsService: AnalyticsService,
    cache?: ICache
  ) {
    super(cache);
  }
  
  // UseCase 특화 로직
  async trackEvent(request: TrackEventRequest): Promise<TrackEventResponse> {
    try {
      // 입력 검증
      this.validateEventRequest(request);
      
      // 캐싱 로직
      const cacheKey = `event:${request.userId}:${request.eventType}`;
      
      // Base Service 사용
      await this.analyticsService.trackEvent(
        request.userId,
        request.eventType,
        request.properties,
        request.sessionId
      );
      
      return { success: true, eventId: this.generateEventId() };
    } catch (error) {
      throw new Error(`Failed to track event: ${error.message}`);
    }
  }
  
  async generateAnalyticsReport(request: AnalyticsReportRequest): Promise<AnalyticsReportResponse> {
    try {
      // 캐시 확인
      const cacheKey = `report:${request.timeRange.start}:${request.timeRange.end}`;
      const cached = await this.getCached<AnalyticsReportResponse>(cacheKey, ANALYTICS_CACHE_TTL.REPORT);
      if (cached) return cached;
      
      // Base Service 사용
      const report = await this.analyticsService.generateAnalyticsReport(request.timeRange);
      
      const response: AnalyticsReportResponse = {
        report,
        generatedAt: new Date(),
        cacheKey
      };
      
      // 캐시 저장
      await this.setCached(cacheKey, response, ANALYTICS_CACHE_TTL.REPORT);
      
      return response;
    } catch (error) {
      throw new Error(`Failed to generate report: ${error.message}`);
    }
  }
  
  private validateEventRequest(request: TrackEventRequest): void {
    if (!request.userId) throw new Error('User ID is required');
    if (!request.eventType) throw new Error('Event type is required');
  }
}
```

#### **3.2 ChannelUseCaseService 생성**
```typescript
// application/usecases/services/channel/ChannelUseCaseService.ts
export class ChannelUseCaseService extends BaseCacheService {
  constructor(
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
    cache?: ICache
  ) {
    super(cache);
  }
  
  // UseCase 특화 로직
  async createChannel(request: CreateChannelRequest): Promise<CreateChannelResponse> {
    try {
      // 권한 검증
      const hasPermission = await this.checkChannelPermissions(request.ownerId, 'create_channel');
      if (!hasPermission) {
        throw new Error('Insufficient permissions to create channel');
      }
      
      // Base Service 사용
      const channel = await this.channelService.createChannel({
        name: request.name,
        description: request.description,
        type: request.type,
        ownerId: request.ownerId,
        members: request.members
      });
      
      // 캐시 무효화
      this.invalidateChannelCache(request.ownerId);
      
      return {
        channel: this.mapToChannelProfile(channel),
        success: true
      };
    } catch (error) {
      throw new Error(`Failed to create channel: ${error.message}`);
    }
  }
  
  async getChannel(request: GetChannelRequest): Promise<GetChannelResponse> {
    try {
      // 캐시 확인
      const cacheKey = `channel:${request.id}`;
      const cached = await this.getCached<GetChannelResponse>(cacheKey, CHANNEL_CACHE_TTL.INFO);
      if (cached) return cached;
      
      // Base Service 사용
      const channel = await this.channelService.getChannel(request.id);
      
      const response: GetChannelResponse = {
        channel: this.mapToChannelProfile(channel),
        success: true
      };
      
      // 캐시 저장
      await this.setCached(cacheKey, response, CHANNEL_CACHE_TTL.INFO);
      
      return response;
    } catch (error) {
      throw new Error(`Failed to get channel: ${error.message}`);
    }
  }
  
  private async checkChannelPermissions(userId: string, operation: string): Promise<boolean> {
    // 권한 검증 로직
    return true; // 임시 구현
  }
  
  private mapToChannelProfile(channel: any): ChannelProfile {
    // 매핑 로직
    return {
      id: channel.id,
      name: channel.name,
      description: channel.description,
      type: channel.type,
      ownerId: channel.ownerId,
      members: channel.members,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt
    };
  }
}
```

### **Phase 4: UseCase 업데이트**

#### **4.1 UseCase에서 새로운 서비스 사용**
```typescript
// application/usecases/AnalyticsUseCase.ts
export class AnalyticsUseCase {
  constructor(
    private readonly analyticsUseCaseService: AnalyticsUseCaseService
  ) {}
  
  async execute(request: AnalyticsRequest): Promise<AnalyticsResponse> {
    return await this.analyticsUseCaseService.trackEvent(request);
  }
}

// application/usecases/CreateChannelUseCase.ts
export class CreateChannelUseCase {
  constructor(
    private readonly channelUseCaseService: ChannelUseCaseService
  ) {}
  
  async execute(request: CreateChannelRequest): Promise<CreateChannelResponse> {
    return await this.channelUseCaseService.createChannel(request);
  }
}
```

### **Phase 5: DI Container 업데이트**

#### **5.1 의존성 주입 설정**
```typescript
// application/di/container.ts
export class Container {
  // Base Services
  private analyticsService: AnalyticsService;
  private channelService: ChannelService;
  private userService: UserService;
  
  // UseCase Services
  private analyticsUseCaseService: AnalyticsUseCaseService;
  private channelUseCaseService: ChannelUseCaseService;
  private userUseCaseService: UserUseCaseService;
  
  constructor() {
    // Base Services 초기화
    this.analyticsService = new AnalyticsService(
      this.analyticsRepository,
      this.performanceService
    );
    
    this.channelService = new ChannelService(
      this.channelRepository,
      this.userRepository,
      this.securityService
    );
    
    // UseCase Services 초기화
    this.analyticsUseCaseService = new AnalyticsUseCaseService(
      this.analyticsService,
      this.cache
    );
    
    this.channelUseCaseService = new ChannelUseCaseService(
      this.channelService,
      this.userService,
      this.cache
    );
  }
  
  // Getter 메서드들
  getAnalyticsService(): AnalyticsService {
    return this.analyticsService;
  }
  
  getAnalyticsUseCaseService(): AnalyticsUseCaseService {
    return this.analyticsUseCaseService;
  }
  
  getChannelService(): ChannelService {
    return this.channelService;
  }
  
  getChannelUseCaseService(): ChannelUseCaseService {
    return this.channelUseCaseService;
  }
}
```

## 📊 **리팩토링 효과**

### **1. 코드 중복 제거**
- 공통 로직은 Base Service로 통합
- UseCase별 특화 로직만 분리

### **2. 책임 분리**
- **Base Service**: 도메인 로직과 인프라스트럭처 추상화
- **UseCase Service**: UseCase별 특화된 비즈니스 로직

### **3. 재사용성 향상**
- Base Service를 여러 UseCase에서 재사용
- 공통 기능의 중복 구현 방지

### **4. 테스트 용이성**
- 각 레이어별 독립적 테스트 가능
- Mock 객체 생성 용이

### **5. 유지보수성**
- 명확한 계층 구조
- 변경 영향 범위 최소화

## 🚀 **마이그레이션 계획**

### **Week 1: Base Service 추상화**
- BaseService, BaseCacheService 추상 클래스 생성
- 공통 유틸리티 메서드 구현

### **Week 2: Base Service 리팩토링**
- AnalyticsService, ChannelService, UserService 리팩토링
- 핵심 로직과 공통 기능 분리

### **Week 3: UseCase Service 생성**
- AnalyticsUseCaseService, ChannelUseCaseService 생성
- UseCase별 특화 로직 구현

### **Week 4: 통합 및 테스트**
- DI Container 업데이트
- UseCase 업데이트
- 통합 테스트 및 검증

## ⚠️ **주의사항**

### **1. 점진적 마이그레이션**
- 기존 코드를 한 번에 변경하지 말고 단계적으로 진행
- 각 단계마다 테스트 수행

### **2. 하위 호환성 유지**
- 기존 API 인터페이스 유지
- 내부 구현만 변경

### **3. 성능 모니터링**
- 리팩토링 전후 성능 비교
- 캐싱 효과 검증

### **4. 문서화**
- 새로운 구조에 대한 문서 작성
- 개발자 가이드 업데이트 