# Repository 정리 계획 (8개 → 4개)

## 📊 **현재 Repository 분석**

### Domain Layer (Repository Interfaces)
```
domain/repositories/
├── IUserRepository.ts      # 사용자 관련 인터페이스
├── IChannelRepository.ts   # 채널 관련 인터페이스
├── IMessageRepository.ts   # 메시지 관련 인터페이스
└── IProfileRepository.ts   # 프로필 관련 인터페이스
```

### Infrastructure Layer (Repository Implementations)
```
infrastructure/repositories/
├── UserRepositoryImpl.ts     # 사용자 Repository 구현
├── ChannelRepositoryImpl.ts  # 채널 Repository 구현
├── MessageRepositoryImpl.ts  # 메시지 Repository 구현
├── ProfileRepository.ts      # 프로필 Repository 구현
├── SearchRepository.ts       # 검색 Repository 구현
├── PaymentRepository.ts      # 결제 Repository 구현
├── InviteRepository.ts       # 초대 Repository 구현
└── CategoryRepository.ts     # 카테고리 Repository 구현
```

## 🎯 **통합 후 구조 (4개)**

### 1. **IUserRepository.ts** - 사용자 관련 모든 기능
```typescript
export interface IUserRepository {
  // 기본 CRUD
  findById(id: string): Promise<User | null>
  create(userData: CreateUserData): Promise<User>
  update(id: string, userData: UpdateUserData): Promise<User>
  delete(id: string): Promise<void>
  
  // 인증 관련
  findByEmail(email: string): Promise<User | null>
  authenticate(credentials: AuthCredentials): Promise<User>
  
  // 프로필 관련 (기존 IProfileRepository 통합)
  getUserProfile(userId: string): Promise<UserProfile>
  updateUserProfile(userId: string, profileData: UpdateProfileData): Promise<UserProfile>
  
  // 권한 관련
  checkUserPermission(userId: string, permission: string): Promise<boolean>
  getUserPermissions(userId: string): Promise<Permission[]>
  
  // 활동 로그
  getUserActivityLog(userId: string): Promise<ActivityLog[]>
  logUserActivity(userId: string, activity: ActivityData): Promise<void>
}
```

### 2. **IChannelRepository.ts** - 채널 관련 모든 기능
```typescript
export interface IChannelRepository {
  // 기본 CRUD
  findById(id: string): Promise<Channel | null>
  create(channelData: CreateChannelData): Promise<Channel>
  update(id: string, channelData: UpdateChannelData): Promise<Channel>
  delete(id: string): Promise<void>
  
  // 채널 멤버 관리
  addMember(channelId: string, userId: string): Promise<void>
  removeMember(channelId: string, userId: string): Promise<void>
  getChannelMembers(channelId: string): Promise<User[]>
  
  // 초대 관련 (기존 InviteRepository 통합)
  inviteToChannel(channelId: string, userIds: string[]): Promise<void>
  getChannelInvites(channelId: string): Promise<Invite[]>
  acceptInvite(inviteId: string): Promise<void>
  declineInvite(inviteId: string): Promise<void>
  
  // 카테고리 관련 (기존 CategoryRepository 통합)
  getChannelsByCategory(categoryId: string): Promise<Channel[]>
  assignCategory(channelId: string, categoryId: string): Promise<void>
  
  // 검색 및 조회
  searchChannels(query: string): Promise<Channel[]>
  getChannelsByUser(userId: string): Promise<Channel[]>
}
```

### 3. **IMessageRepository.ts** - 메시지 관련 모든 기능
```typescript
export interface IMessageRepository {
  // 기본 CRUD
  findById(id: string): Promise<Message | null>
  create(messageData: CreateMessageData): Promise<Message>
  update(id: string, messageData: UpdateMessageData): Promise<Message>
  delete(id: string): Promise<void>
  
  // 메시지 조회
  getMessages(channelId: string, options: GetMessagesOptions): Promise<Message[]>
  getMessageHistory(channelId: string, limit: number): Promise<Message[]>
  
  // 검색 관련 (기존 SearchRepository 통합)
  searchMessages(query: string, options: SearchOptions): Promise<Message[]>
  searchMessagesByUser(userId: string, query: string): Promise<Message[]>
  searchMessagesByChannel(channelId: string, query: string): Promise<Message[]>
  
  // 파일 메시지
  getFileMessages(channelId: string): Promise<Message[]>
  getFileMessageInfo(messageId: string): Promise<FileMessageInfo>
  
  // 메시지 반응
  addReaction(messageId: string, userId: string, reaction: string): Promise<void>
  removeReaction(messageId: string, userId: string, reaction: string): Promise<void>
  getMessageReactions(messageId: string): Promise<Reaction[]>
}
```

### 4. **IFileRepository.ts** - 파일 관련 모든 기능 (새로 생성)
```typescript
export interface IFileRepository {
  // 파일 업로드/다운로드
  uploadFile(file: File, options: UploadOptions): Promise<FileInfo>
  downloadFile(fileId: string): Promise<Blob>
  getFileInfo(fileId: string): Promise<FileInfo>
  
  // 파일 관리
  updateFileInfo(fileId: string, fileInfo: UpdateFileInfo): Promise<FileInfo>
  deleteFile(fileId: string): Promise<void>
  
  // 파일 검색
  searchFiles(query: string, options: SearchOptions): Promise<FileInfo[]>
  getFilesByUser(userId: string): Promise<FileInfo[]>
  getFilesByChannel(channelId: string): Promise<FileInfo[]>
  
  // 결제 관련 (기존 PaymentRepository 통합)
  processFilePayment(fileId: string, paymentData: PaymentData): Promise<PaymentResult>
  getFilePaymentHistory(fileId: string): Promise<PaymentHistory[]>
  
  // 파일 권한
  checkFilePermission(fileId: string, userId: string): Promise<boolean>
  setFilePermission(fileId: string, userId: string, permission: FilePermission): Promise<void>
}
```

## 🔧 **구현 단계**

### Phase 1: Repository Interface 통합 (2-3일)
1. 기존 Repository Interface 분석
2. 중복 메서드 식별 및 통합
3. 새로운 통합 Interface 설계
4. 기존 Interface 제거

### Phase 2: Repository Implementation 통합 (3-5일)
1. 기존 Implementation 분석
2. 중복 로직 식별 및 통합
3. 새로운 통합 Implementation 구현
4. 의존성 주입 업데이트

### Phase 3: Use Case 업데이트 (2-3일)
1. Use Case에서 Repository 사용 부분 업데이트
2. 새로운 Interface에 맞게 메서드 호출 수정
3. 에러 처리 및 타입 안전성 확보

### Phase 4: 테스트 및 검증 (2-3일)
1. Repository 단위 테스트 업데이트
2. 통합 테스트 수행
3. 성능 테스트 및 최적화

## 📈 **예상 효과**

### 코드 복잡성 감소
- Repository Interface: 4개 → 4개 (유지, 기능 통합)
- Repository Implementation: 8개 → 4개 (50% 감소)
- 중복 메서드: 70% 제거

### 유지보수성 향상
- 관련 기능 통합으로 이해도 향상
- 일관된 API 설계
- 단일 책임 원칙 강화

### 성능 최적화
- 중복 쿼리 제거
- 캐시 전략 통합
- 데이터베이스 연결 최적화

## 🚀 **다음 단계**

1. **DI Container 단순화**: 이중 구조 → 단일 구조
2. **Service Layer 정리**: 불필요한 Service 제거
3. **Use Case 통합**: 21개 → 5개로 통합

이러한 통합을 통해 더욱 견고하고 확장 가능한 Repository 구조를 구축할 수 있습니다. 