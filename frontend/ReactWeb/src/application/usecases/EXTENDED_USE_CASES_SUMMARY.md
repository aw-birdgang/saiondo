# Extended Use Cases Development Summary

## 🎯 완성된 추가 Use Cases

### 📁 **파일 관리 Use Cases**
- `UploadFileUseCase` - 파일 업로드 및 메시지 생성
  - 파일 크기 및 타입 검증
  - 클라우드 스토리지 업로드 (모의 구현)
  - 메타데이터 관리

### 🔔 **알림 관리 Use Cases**
- `NotificationUseCase` - 다중 채널 알림 시스템
  - 이메일, 푸시, 인앱 알림 지원
  - 사용자별 알림 설정 관리
  - 벌크 알림 전송

### 🔐 **권한 관리 Use Cases**
- `UserPermissionUseCase` - 역할 기반 접근 제어 (RBAC)
  - 권한 검증 및 역할 할당
  - 채널 및 메시지 관리 권한
  - 컨텍스트 기반 권한 검사

### ⚡ **성능 최적화 Use Cases**
- `CacheUseCase` - 인메모리 캐싱 시스템
  - TTL 기반 캐시 만료
  - 배치 작업 지원
  - 캐시 통계 및 워밍업

## 🏗️ Use Case Factory 확장

### 새로운 Factory 메서드들

```typescript
// 개별 Use Case 생성
const uploadUseCase = UseCaseFactory.createUploadFileUseCase();
const notificationUseCase = UseCaseFactory.createNotificationUseCase();
const permissionUseCase = UseCaseFactory.createUserPermissionUseCase();
const cacheUseCase = UseCaseFactory.createCacheUseCase();

// 그룹별 Use Case 생성
const allUseCases = UseCaseFactory.createAllUseCases();
```

### 도메인별 Use Case 그룹

```typescript
const useCases = UseCaseFactory.createAllUseCases();

// 인증 관련
useCases.auth.authenticate.execute({ email, password });
useCases.auth.register.execute(userData);

// 채널 관련
useCases.channel.create.execute(channelData);
useCases.channel.invite.execute(inviteData);

// 메시지 관련
useCases.message.send.execute(messageData);
useCases.message.uploadFile.execute(fileData);
useCases.message.search.execute(searchData);

// 알림 관련
useCases.notification.notification.sendNotification(notificationData);

// 권한 관련
useCases.permission.permission.checkPermission(permissionData);

// 캐싱 관련
useCases.cache.cache.getUserWithCache(userId);
```

## 📋 상세 기능 설명

### 🔧 UploadFileUseCase

```typescript
const uploadUseCase = UseCaseFactory.createUploadFileUseCase();

const result = await uploadUseCase.execute({
  file: fileInput.files[0],
  channelId: 'channel-id',
  senderId: 'user-id',
  description: 'Check out this file!'
});

// 결과
// {
//   message: { id, content, type: 'file', metadata: {...} },
//   fileUrl: 'https://storage.example.com/files/...',
//   fileSize: 1024000,
//   fileName: 'document.pdf'
// }
```

**주요 기능:**
- 파일 크기 제한 (10MB)
- 지원 파일 타입 검증
- 채널 멤버십 확인
- 메타데이터 자동 생성

### 🔔 NotificationUseCase

```typescript
const notificationUseCase = UseCaseFactory.createNotificationUseCase();

// 단일 알림 전송
await notificationUseCase.sendNotification({
  userId: 'user-id',
  type: 'message',
  title: 'New Message',
  body: 'You have a new message in General Chat',
  channelId: 'channel-id',
  data: { messageId: 'msg-id' }
});

// 알림 설정 업데이트
await notificationUseCase.updateNotificationPreferences('user-id', {
  email: false,
  push: true,
  mentions: true
});

// 벌크 알림 전송
await notificationUseCase.sendBulkNotifications(
  ['user1', 'user2', 'user3'],
  {
    type: 'system',
    title: 'System Maintenance',
    body: 'Scheduled maintenance in 30 minutes'
  }
);
```

**주요 기능:**
- 다중 채널 알림 (이메일, 푸시, 인앱)
- 사용자별 알림 설정
- 알림 타입별 필터링
- 벌크 알림 전송

### 🔐 UserPermissionUseCase

```typescript
const permissionUseCase = UseCaseFactory.createUserPermissionUseCase();

// 권한 검증
const hasPermission = await permissionUseCase.checkPermission({
  userId: 'user-id',
  resource: 'message',
  action: 'delete',
  context: { messageId: 'msg-id', channelId: 'channel-id' }
});

// 역할 할당
await permissionUseCase.assignRole({
  userId: 'user-id',
  roleId: 'admin',
  assignedBy: 'admin-user-id'
});

// 채널 관리 권한 확인
const canManage = await permissionUseCase.canManageChannel('user-id', 'channel-id');

// 메시지 삭제 권한 확인
const canDelete = await permissionUseCase.canDeleteMessage('user-id', 'msg-id', 'channel-id');
```

**주요 기능:**
- 역할 기반 접근 제어 (RBAC)
- 리소스별 권한 검증
- 컨텍스트 기반 권한 검사
- 채널 및 메시지 관리 권한

### ⚡ CacheUseCase

```typescript
const cacheUseCase = UseCaseFactory.createCacheUseCase({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 1000
});

// 캐시된 사용자 조회
const user = await cacheUseCase.getUserWithCache('user-id');

// 캐시된 채널 조회
const channel = await cacheUseCase.getChannelWithCache('channel-id');

// 캐시된 메시지 조회
const messages = await cacheUseCase.getMessagesWithCache('channel-id', 50, 0);

// 배치 사용자 조회
const users = await cacheUseCase.batchGetUsers(['user1', 'user2', 'user3']);

// 캐시 무효화
await cacheUseCase.invalidateUserCache('user-id');
await cacheUseCase.invalidateChannelCache('channel-id');

// 캐시 통계
const stats = await cacheUseCase.getCacheStats();
// { hits: 150, misses: 25, size: 175, maxSize: 1000 }

// 캐시 워밍업
await cacheUseCase.warmupCache(['user1', 'user2'], ['channel1', 'channel2']);
```

**주요 기능:**
- TTL 기반 캐시 만료
- LRU 캐시 교체 정책
- 배치 작업 지원
- 캐시 통계 및 모니터링
- 캐시 워밍업

## 🎯 성능 최적화

### 1. **캐싱 전략**
- 자주 조회되는 데이터 캐싱
- 배치 작업으로 API 호출 최소화
- 캐시 워밍업으로 초기 로딩 시간 단축

### 2. **비동기 처리**
- 모든 Use Case가 비동기 처리
- 병렬 작업으로 성능 향상
- 에러 처리 및 복구

### 3. **배치 작업**
- 여러 사용자 데이터 동시 조회
- 벌크 알림 전송
- 캐시 무효화 최적화

## 🔧 사용 예제

### React Hook에서 사용

```typescript
// hooks/useFileUpload.ts
import { UseCaseFactory } from '../domain/usecases/UseCaseFactory';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, channelId: string, description?: string) => {
    setUploading(true);
    setError(null);
    
    try {
      const uploadUseCase = UseCaseFactory.createUploadFileUseCase();
      const result = await uploadUseCase.execute({
        file,
        channelId,
        senderId: getCurrentUserId(),
        description
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
};
```

### 컴포넌트에서 사용

```typescript
// components/FileUpload.tsx
import React, { useRef } from 'react';
import { useFileUpload } from '../hooks/useFileUpload';

export const FileUpload: React.FC<{ channelId: string }> = ({ channelId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading, error } = useFileUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadFile(file, channelId, 'Shared file');
      // 성공 처리
    } catch (err) {
      // 에러는 이미 hook에서 처리됨
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {uploading && <span>Uploading...</span>}
      {error && <span className="error">{error}</span>}
    </div>
  );
};
```

## 🧪 테스트 전략

### Use Case 단위 테스트

```typescript
// __tests__/UploadFileUseCase.test.ts
import { UploadFileUseCase } from '../domain/usecases/UploadFileUseCase';
import { MessageRepositoryMock, ChannelRepositoryMock } from '../__mocks__';

describe('UploadFileUseCase', () => {
  let useCase: UploadFileUseCase;
  let mockMessageRepo: MessageRepositoryMock;
  let mockChannelRepo: ChannelRepositoryMock;

  beforeEach(() => {
    mockMessageRepo = new MessageRepositoryMock();
    mockChannelRepo = new ChannelRepositoryMock();
    useCase = new UploadFileUseCase(mockMessageRepo, mockChannelRepo);
  });

  it('should upload valid file successfully', async () => {
    // Arrange
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    mockChannelRepo.isMember.mockResolvedValue(true);

    // Act
    const result = await useCase.execute({
      file,
      channelId: 'channel-id',
      senderId: 'user-id'
    });

    // Assert
    expect(result.message).toBeDefined();
    expect(result.fileUrl).toBeDefined();
    expect(result.fileSize).toBe(file.size);
  });

  it('should reject oversized file', async () => {
    // Arrange
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.txt');

    // Act & Assert
    await expect(
      useCase.execute({
        file: largeFile,
        channelId: 'channel-id',
        senderId: 'user-id'
      })
    ).rejects.toThrow('File size must be less than 10MB');
  });
});
```

## 🚀 다음 단계

### 1. **추가 Use Case 개발**
- 실시간 채팅 Use Case
- 파일 다운로드 Use Case
- 사용자 활동 로그 Use Case

### 2. **성능 최적화**
- Redis 캐싱 통합
- 데이터베이스 쿼리 최적화
- 메모리 사용량 모니터링

### 3. **모니터링 및 로깅**
- Use Case 실행 시간 측정
- 에러 로깅 및 알림
- 성능 메트릭 수집

### 4. **보안 강화**
- 파일 업로드 보안 검증
- 권한 검증 강화
- 입력 데이터 검증

---

**확장된 Use Case 개발이 완료되었습니다!** 🎉

이제 프로젝트는 파일 관리, 알림 시스템, 권한 관리, 성능 최적화를 포함한 완전한 기능을 갖추게 되었습니다. 