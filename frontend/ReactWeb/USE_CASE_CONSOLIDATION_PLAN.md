# Use Case 통합 계획 (21개 → 5개)

## 📊 **현재 Use Case 분석**

### 1. **User 관련 Use Cases** (6개)
- `GetCurrentUserUseCase.ts` - 현재 사용자 조회
- `UpdateUserUseCase.ts` - 사용자 정보 업데이트
- `AuthenticateUserUseCase.ts` - 사용자 인증
- `RegisterUserUseCase.ts` - 사용자 등록
- `LogoutUserUseCase.ts` - 사용자 로그아웃
- `UserUseCases.ts` - 사용자 관련 통합 Use Cases

### 2. **Channel 관련 Use Cases** (4개)
- `CreateChannelUseCase.ts` - 채널 생성
- `InviteToChannelUseCase.ts` - 채널 초대
- `LeaveChannelUseCase.ts` - 채널 나가기
- `ChannelUseCases.ts` - 채널 관련 통합 Use Cases

### 3. **Message 관련 Use Cases** (3개)
- `SendMessageUseCase.ts` - 메시지 전송
- `SearchMessagesUseCase.ts` - 메시지 검색
- `MessageUseCases.ts` - 메시지 관련 통합 Use Cases

### 4. **File 관련 Use Cases** (3개)
- `UploadFileUseCase.ts` - 파일 업로드
- `FileDownloadUseCase.ts` - 파일 다운로드
- `FileUseCases.ts` - 파일 관련 통합 Use Cases

### 5. **System 관련 Use Cases** (5개)
- `AnalyticsUseCase.ts` - 분석
- `PaymentUseCase.ts` - 결제
- `SearchUseCase.ts` - 검색
- `SystemManagementUseCase.ts` - 시스템 관리
- `APMMonitoringUseCase.ts` - APM 모니터링

## 🎯 **통합 후 구조 (5개)**

### 1. **UserUseCase.ts** - 사용자 관련 모든 기능
```typescript
export class UserUseCase {
  // 인증 관련
  async authenticate(credentials: AuthCredentials): Promise<User>
  async register(userData: RegisterUserData): Promise<User>
  async logout(): Promise<void>
  
  // 사용자 정보 관련
  async getCurrentUser(): Promise<User>
  async updateUser(userData: UpdateUserData): Promise<User>
  async getUserProfile(userId: string): Promise<UserProfile>
  
  // 권한 관련
  async checkUserPermission(userId: string, permission: string): Promise<boolean>
  async getUserActivityLog(userId: string): Promise<ActivityLog[]>
}
```

### 2. **ChannelUseCase.ts** - 채널 관련 모든 기능
```typescript
export class ChannelUseCase {
  // 채널 관리
  async createChannel(channelData: CreateChannelData): Promise<Channel>
  async updateChannel(channelId: string, channelData: UpdateChannelData): Promise<Channel>
  async deleteChannel(channelId: string): Promise<void>
  
  // 채널 멤버 관리
  async inviteToChannel(channelId: string, userIds: string[]): Promise<void>
  async leaveChannel(channelId: string): Promise<void>
  async removeFromChannel(channelId: string, userId: string): Promise<void>
  
  // 채널 정보 조회
  async getChannel(channelId: string): Promise<Channel>
  async getChannelsByUser(userId: string): Promise<Channel[]>
  async searchChannels(query: string): Promise<Channel[]>
}
```

### 3. **MessageUseCase.ts** - 메시지 관련 모든 기능
```typescript
export class MessageUseCase {
  // 메시지 전송
  async sendMessage(messageData: SendMessageData): Promise<Message>
  async sendFileMessage(fileData: SendFileMessageData): Promise<Message>
  
  // 메시지 조회
  async getMessages(channelId: string, options: GetMessagesOptions): Promise<Message[]>
  async getMessage(messageId: string): Promise<Message>
  async searchMessages(query: string, options: SearchOptions): Promise<Message[]>
  
  // 메시지 관리
  async updateMessage(messageId: string, content: string): Promise<Message>
  async deleteMessage(messageId: string): Promise<void>
  async reactToMessage(messageId: string, reaction: string): Promise<void>
  
  // 실시간 채팅
  async connectToRealTimeChat(channelId: string): Promise<void>
  async disconnectFromRealTimeChat(channelId: string): Promise<void>
}
```

### 4. **FileUseCase.ts** - 파일 관련 모든 기능
```typescript
export class FileUseCase {
  // 파일 업로드
  async uploadFile(file: File, options: UploadOptions): Promise<FileInfo>
  async uploadMultipleFiles(files: File[], options: UploadOptions): Promise<FileInfo[]>
  
  // 파일 다운로드
  async downloadFile(fileId: string): Promise<Blob>
  async getFileInfo(fileId: string): Promise<FileInfo>
  
  // 파일 관리
  async deleteFile(fileId: string): Promise<void>
  async updateFileInfo(fileId: string, fileInfo: UpdateFileInfo): Promise<FileInfo>
  
  // 파일 검색
  async searchFiles(query: string, options: SearchOptions): Promise<FileInfo[]>
  async getFilesByUser(userId: string): Promise<FileInfo[]>
}
```

### 5. **SystemUseCase.ts** - 시스템 관련 모든 기능
```typescript
export class SystemUseCase {
  // 분석 및 모니터링
  async getAnalytics(options: AnalyticsOptions): Promise<AnalyticsData>
  async startAPMMonitoring(): Promise<void>
  async stopAPMMonitoring(): Promise<void>
  async getSystemMetrics(): Promise<SystemMetrics>
  
  // 캐시 관리
  async getFromCache(key: string): Promise<any>
  async setToCache(key: string, value: any, ttl?: number): Promise<void>
  async deleteFromCache(key: string): Promise<void>
  async clearCache(): Promise<void>
  
  // 결제 관리
  async processPayment(paymentData: PaymentData): Promise<PaymentResult>
  async getPaymentHistory(userId: string): Promise<PaymentHistory[]>
  
  // 검색 기능
  async globalSearch(query: string, options: GlobalSearchOptions): Promise<SearchResult>
  
  // 시스템 관리
  async getSystemStatus(): Promise<SystemStatus>
  async performSystemMaintenance(): Promise<void>
}
```

## 🔧 **구현 단계**

### Phase 1: 기존 Use Case 분석 (1-2일)
1. 각 Use Case의 책임과 의존성 분석
2. 중복 로직 식별
3. 통합 가능한 Use Case 그룹핑

### Phase 2: 통합 Use Case 설계 (2-3일)
1. 각 통합 Use Case의 인터페이스 설계
2. 메서드 시그니처 정의
3. 의존성 주입 구조 설계

### Phase 3: 기존 로직 마이그레이션 (3-5일)
1. 개별 Use Case 로직을 통합 Use Case로 이동
2. 중복 로직 제거 및 통합
3. 에러 처리 및 로깅 통합

### Phase 4: Factory 패턴 업데이트 (1-2일)
1. UseCaseFactory 단순화
2. 새로운 통합 Use Case 등록
3. 기존 Use Case 제거

### Phase 5: 테스트 및 검증 (2-3일)
1. 단위 테스트 업데이트
2. 통합 테스트 수행
3. 성능 테스트 및 최적화

## 📈 **예상 효과**

### 코드 복잡성 감소
- 파일 수: 21개 → 5개 (76% 감소)
- 코드 라인: 약 30% 감소
- 중복 로직: 80% 제거

### 유지보수성 향상
- 관련 기능 통합으로 이해도 향상
- 일관된 에러 처리 및 로깅
- 단일 책임 원칙 강화

### 테스트 가능성 향상
- 통합된 Use Case로 테스트 시나리오 단순화
- Mock 객체 생성 및 관리 용이
- 테스트 커버리지 향상

## 🚀 **다음 단계**

1. **Repository 정리**: 8개 → 4개로 통합
2. **DI Container 단순화**: 이중 구조 → 단일 구조
3. **Service Layer 정리**: 불필요한 Service 제거

이러한 통합을 통해 더욱 견고하고 확장 가능한 Use Case 구조를 구축할 수 있습니다. 