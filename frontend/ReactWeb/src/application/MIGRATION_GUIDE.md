# 🔄 Service Layer 마이그레이션 가이드

## 📋 **개요**

기존 서비스들을 새로운 Service Layer 구조로 마이그레이션하는 단계별 가이드입니다.

## 🎯 **마이그레이션 목표**

1. **코드 중복 제거**: 공통 로직을 Base Service로 통합
2. **책임 분리**: Base Service (도메인 로직) vs UseCase Service (UseCase 특화)
3. **성능 향상**: 캐싱 및 성능 모니터링 추가
4. **유지보수성**: 명확한 계층 구조로 코드 관리 용이

## 📊 **현재 상태**

### **✅ 완료된 서비스들**
- ✅ `AnalyticsService` → `AnalyticsUseCaseService`
- ✅ `ChannelService` → `ChannelUseCaseService`

### **🔄 마이그레이션 대상 서비스들**
- 🔄 `UserService` → `UserUseCaseService`
- 🔄 `MessageService` → `MessageUseCaseService`
- 🔄 `FileService` → `FileUseCaseService`
- 🔄 `NotificationService` → `NotificationUseCaseService`
- 🔄 `SearchService` → `SearchUseCaseService`
- 🔄 `PaymentService` → `PaymentUseCaseService`

## 🚀 **마이그레이션 단계**

### **Step 1: Base Service 리팩토링**

#### **1.1 UserService 리팩토링**

```typescript
// 기존: application/services/UserService.ts
export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly config: UserServiceConfig = {}
  ) {
    // 직접 의존성 초기화
    this.performanceService = new PerformanceMonitoringService(...);
    this.errorService = new ErrorHandlingService(...);
    this.securityService = new SecurityService(...);
  }
  
  async getCurrentUser(userId?: string): Promise<UserProfile> {
    // 직접 성능 측정, 에러 처리, 검증 로직 구현
  }
}

// 새로운: application/services/user/UserService.ts
export class UserService extends BaseService<IUserRepository> {
  protected repository: IUserRepository;

  constructor(
    userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    logger?: ILogger
  ) {
    super(logger);
    this.repository = userRepository;
  }

  async getCurrentUser(userId?: string): Promise<UserProfile> {
    return await this.measurePerformance(
      'get_current_user',
      async () => {
        // 핵심 비즈니스 로직만 구현
        let user;
        if (userId) {
          const userIdObj = UserId.create(userId);
          user = await this.repository.findById(userIdObj.getValue());
        } else {
          user = await this.repository.getCurrentUser();
        }

        if (!user) {
          throw DomainErrorFactory.createUserNotFound(userId || 'current user');
        }

        return this.mapToUserProfile(user);
      },
      { userId: userId || 'current' }
    );
  }
}
```

#### **1.2 MessageService 리팩토링**

```typescript
// 새로운: application/services/message/MessageService.ts
export class MessageService extends BaseService<IMessageRepository> {
  protected repository: IMessageRepository;

  constructor(
    messageRepository: IMessageRepository,
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    logger?: ILogger
  ) {
    super(logger);
    this.repository = messageRepository;
  }

  async sendMessage(messageData: SendMessageData): Promise<MessageEntity> {
    return await this.measurePerformance(
      'send_message',
      async () => {
        // 입력 검증
        this.validateInput(messageData, messageValidationSchema);

        // 비즈니스 규칙 검증
        const businessRules = [
          {
            name: 'user_can_send_to_channel',
            validate: async () => await this.canUserSendToChannel(messageData.userId, messageData.channelId),
            message: 'User cannot send message to this channel'
          }
        ];
        
        const validationResult = this.validateBusinessRules(messageData, businessRules);
        if (!validationResult.isValid) {
          throw new Error(validationResult.violations[0].message);
        }

        // 메시지 생성 및 저장
        const message = await this.repository.createMessage(messageData);
        return message;
      },
      { userId: messageData.userId, channelId: messageData.channelId }
    );
  }
}
```

### **Step 2: UseCase Service 생성**

#### **2.1 UserUseCaseService 생성**

```typescript
// 새로운: application/usecases/services/user/UserUseCaseService.ts
export class UserUseCaseService extends BaseCacheService {
  constructor(
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
    cache?: ICache,
    logger?: ILogger
  ) {
    super(cache, logger);
  }

  async getCurrentUser(request: GetCurrentUserRequest): Promise<GetCurrentUserResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('user', 'current', request.userId || 'current');
      const cached = await this.getCached<GetCurrentUserResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const userProfile = await this.userService.getCurrentUser(request.userId);

      // 응답 구성
      const response: GetCurrentUserResponse = {
        user: userProfile,
        success: true,
        cached: false,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('user_profile'));

      return response;
    } catch (error) {
      return {
        user: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        fetchedAt: new Date()
      };
    }
  }

  async updateUserProfile(request: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
    try {
      // 권한 검증
      await this.checkUserPermissions(request.userId, 'update_profile');

      // Base Service 호출
      const updatedProfile = await this.userService.updateUserProfile(
        request.userId,
        request.updates
      );

      // 관련 캐시 무효화
      this.invalidateUserCache(request.userId);

      return {
        user: updatedProfile,
        success: true,
        updatedAt: new Date()
      };
    } catch (error) {
      return {
        user: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date()
      };
    }
  }

  private async checkUserPermissions(userId: string, operation: string): Promise<boolean> {
    // 권한 검증 로직
    return true; // 실제 구현에서는 권한 검증
  }

  private invalidateUserCache(userId: string): void {
    this.invalidateCachePattern(`user:${userId}:*`);
  }
}
```

#### **2.2 MessageUseCaseService 생성**

```typescript
// 새로운: application/usecases/services/message/MessageUseCaseService.ts
export class MessageUseCaseService extends BaseCacheService {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
    cache?: ICache,
    logger?: ILogger
  ) {
    super(cache, logger);
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      // 입력 검증
      this.validateMessageRequest(request);

      // Base Service 호출
      const message = await this.messageService.sendMessage({
        userId: request.userId,
        channelId: request.channelId,
        content: request.content,
        type: request.type || 'text',
        attachments: request.attachments
      });

      // 채널 캐시 무효화
      this.invalidateChannelCache(request.channelId);

      return {
        message: this.mapToMessageDto(message),
        success: true,
        sentAt: new Date()
      };
    } catch (error) {
      return {
        message: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        sentAt: new Date()
      };
    }
  }

  async getChannelMessages(request: GetChannelMessagesRequest): Promise<GetChannelMessagesResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('channel', request.channelId, 'messages', request.page, request.limit);
      const cached = await this.getCached<GetChannelMessagesResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const messages = await this.messageService.getChannelMessages(
        request.channelId,
        request.page,
        request.limit
      );

      const response: GetChannelMessagesResponse = {
        messages: messages.map(msg => this.mapToMessageDto(msg)),
        success: true,
        cached: false,
        page: request.page,
        limit: request.limit,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('channel_messages'));

      return response;
    } catch (error) {
      return {
        messages: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        page: request.page,
        limit: request.limit,
        fetchedAt: new Date()
      };
    }
  }

  private validateMessageRequest(request: SendMessageRequest): void {
    if (!request.userId) {
      throw new Error('User ID is required');
    }
    if (!request.channelId) {
      throw new Error('Channel ID is required');
    }
    if (!request.content || request.content.trim().length === 0) {
      throw new Error('Message content is required');
    }
    if (request.content.length > 2000) {
      throw new Error('Message content must be at most 2000 characters');
    }
  }

  private invalidateChannelCache(channelId: string): void {
    this.invalidateCachePattern(`channel:${channelId}:*`);
  }

  private mapToMessageDto(message: any): any {
    // Message Entity를 DTO로 변환
    return {
      id: message.id,
      content: message.content,
      userId: message.userId,
      channelId: message.channelId,
      type: message.type,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    };
  }
}
```

### **Step 3: DTO 확장**

#### **3.1 UserDto 확장**

```typescript
// application/dto/UserDto.ts
export interface GetCurrentUserRequest {
  userId?: string;
}

export interface GetCurrentUserResponse {
  user: UserProfile | null;
  success: boolean;
  error?: string;
  cached: boolean;
  fetchedAt: Date;
}

export interface UpdateUserProfileRequest {
  userId: string;
  updates: Partial<UserProfile>;
}

export interface UpdateUserProfileResponse {
  user: UserProfile | null;
  success: boolean;
  error?: string;
  updatedAt: Date;
}

export interface SearchUsersRequest {
  query: string;
  limit?: number;
  filters?: {
    status?: UserProfile['status'];
    isActive?: boolean;
  };
}

export interface SearchUsersResponse {
  users: UserProfile[];
  success: boolean;
  error?: string;
  total: number;
  query: string;
  fetchedAt: Date;
}
```

#### **3.2 MessageDto 확장**

```typescript
// application/dto/MessageDto.ts
export interface SendMessageRequest {
  userId: string;
  channelId: string;
  content: string;
  type?: 'text' | 'image' | 'file' | 'system';
  attachments?: Array<{
    type: string;
    url: string;
    name: string;
    size: number;
  }>;
}

export interface SendMessageResponse {
  message: any | null; // Message DTO
  success: boolean;
  error?: string;
  sentAt: Date;
}

export interface GetChannelMessagesRequest {
  channelId: string;
  page?: number;
  limit?: number;
}

export interface GetChannelMessagesResponse {
  messages: any[]; // Message DTO array
  success: boolean;
  error?: string;
  cached: boolean;
  page: number;
  limit: number;
  total?: number;
  hasMore?: boolean;
  fetchedAt: Date;
}
```

### **Step 4: UseCase 업데이트**

#### **4.1 UserUseCase 업데이트**

```typescript
// application/usecases/UserUseCase.ts
export class UserUseCase implements IUserUseCase {
  constructor(private userUseCaseService: UserUseCaseService) {}

  async getCurrentUser(userId?: string): Promise<UserProfile> {
    const request: GetCurrentUserRequest = { userId };
    const response = await this.userUseCaseService.getCurrentUser(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get current user');
    }
    
    return response.user!;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const request: UpdateUserProfileRequest = { userId, updates };
    const response = await this.userUseCaseService.updateUserProfile(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to update user profile');
    }
    
    return response.user!;
  }
}
```

#### **4.2 MessageUseCase 업데이트**

```typescript
// application/usecases/MessageUseCase.ts
export class MessageUseCase implements IMessageUseCase {
  constructor(private messageUseCaseService: MessageUseCaseService) {}

  async sendMessage(userId: string, channelId: string, content: string, type?: string): Promise<any> {
    const request: SendMessageRequest = {
      userId,
      channelId,
      content,
      type: type as any
    };
    
    const response = await this.messageUseCaseService.sendMessage(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to send message');
    }
    
    return response.message;
  }

  async getChannelMessages(channelId: string, page: number = 1, limit: number = 20): Promise<any[]> {
    const request: GetChannelMessagesRequest = {
      channelId,
      page,
      limit
    };
    
    const response = await this.messageUseCaseService.getChannelMessages(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get channel messages');
    }
    
    return response.messages;
  }
}
```

### **Step 5: DI Container 업데이트**

```typescript
// di/container.ts
private initializeNewBaseServices(): void {
  // User Service
  this.services.set(DI_TOKENS.USER_SERVICE, new UserService(
    this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY),
    this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY),
    this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY),
    this.get<ConsoleLogger>(DI_TOKENS.LOGGER)
  ));

  // Message Service
  this.services.set(DI_TOKENS.MESSAGE_SERVICE, new MessageService(
    this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY),
    this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY),
    this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY),
    this.get<ConsoleLogger>(DI_TOKENS.LOGGER)
  ));
}

private initializeUseCaseServices(): void {
  // User UseCase Service
  this.services.set(DI_TOKENS.USER_USE_CASE_SERVICE, new UserUseCaseService(
    this.get<UserService>(DI_TOKENS.USER_SERVICE),
    this.get<ChannelService>(DI_TOKENS.CHANNEL_SERVICE),
    this.get<MemoryCache>(DI_TOKENS.CACHE),
    this.get<ConsoleLogger>(DI_TOKENS.LOGGER)
  ));

  // Message UseCase Service
  this.services.set(DI_TOKENS.MESSAGE_USE_CASE_SERVICE, new MessageUseCaseService(
    this.get<MessageService>(DI_TOKENS.MESSAGE_SERVICE),
    this.get<UserService>(DI_TOKENS.USER_SERVICE),
    this.get<ChannelService>(DI_TOKENS.CHANNEL_SERVICE),
    this.get<MemoryCache>(DI_TOKENS.CACHE),
    this.get<ConsoleLogger>(DI_TOKENS.LOGGER)
  ));
}
```

## 🧪 **테스트 전략**

### **1. 단위 테스트**
- Base Service 기능 테스트
- UseCase Service 비즈니스 로직 테스트
- 캐싱 및 성능 측정 테스트

### **2. 통합 테스트**
- UseCase → UseCase Service → Base Service → Repository 흐름 테스트
- 캐싱 동작 테스트
- 에러 처리 테스트

### **3. 성능 테스트**
- 캐싱 효과 측정
- 성능 모니터링 로그 검증

## 📈 **마이그레이션 체크리스트**

### **UserService 마이그레이션**
- [ ] Base Service로 리팩토링
- [ ] UserUseCaseService 생성
- [ ] DTO 확장
- [ ] UserUseCase 업데이트
- [ ] DI Container 설정
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성

### **MessageService 마이그레이션**
- [ ] Base Service로 리팩토링
- [ ] MessageUseCaseService 생성
- [ ] DTO 확장
- [ ] MessageUseCase 업데이트
- [ ] DI Container 설정
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성

### **FileService 마이그레이션**
- [ ] Base Service로 리팩토링
- [ ] FileUseCaseService 생성
- [ ] DTO 확장
- [ ] FileUseCase 업데이트
- [ ] DI Container 설정
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성

## 🎯 **예상 효과**

### **1. 코드 품질 향상**
- 중복 코드 제거로 유지보수성 향상
- 명확한 책임 분리로 가독성 향상
- 타입 안전성 강화

### **2. 성능 향상**
- 지능적인 캐싱으로 응답 시간 단축
- 성능 모니터링으로 병목 지점 파악
- 자동 캐시 무효화로 데이터 일관성 보장

### **3. 개발 생산성 향상**
- 재사용 가능한 Base Service
- 표준화된 에러 처리
- 일관된 로깅 및 모니터링

## 🚀 **다음 단계**

1. **UserService 마이그레이션**: 첫 번째 대상으로 선택
2. **MessageService 마이그레이션**: 두 번째 대상으로 선택
3. **FileService 마이그레이션**: 세 번째 대상으로 선택
4. **나머지 서비스들**: 점진적으로 마이그레이션
5. **성능 최적화**: 캐싱 전략 및 모니터링 개선
6. **문서화**: API 문서 및 개발자 가이드 업데이트 