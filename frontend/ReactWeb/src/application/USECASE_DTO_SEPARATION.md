# 🏗️ Use Case와 DTO 분리 구조

## 📋 **개요**

클린 아키텍처의 **Application Layer**에서 **Use Case**와 **DTO**를 분리하여 관리합니다.

## 🎯 **분리 이유**

### **1. 단일 책임 원칙 (SRP)**
- **Use Case**: 비즈니스 워크플로우 조정
- **DTO**: Request/Response 데이터 구조 정의

### **2. 재사용성**
- **DTO**: 여러 Use Case에서 공유 가능
- **Use Case**: 순수한 비즈니스 로직에 집중

### **3. API 문서화**
- **DTO**: API 스펙의 일부로 활용
- **Request/Response**: 명확한 계약 정의

### **4. 테스트 용이성**
- 각각 독립적으로 테스트 가능
- Mock 객체 생성 용이

## 📁 **구조**

```
application/
├── usecases/           # Use Case 구현체
│   ├── UploadFileUseCase.ts
│   ├── UserActivityLogUseCase.ts
│   ├── UserPermissionUseCase.ts
│   └── UseCaseFactory.ts
├── dto/               # Use Case Request/Response DTOs
│   ├── UploadFileDto.ts
│   ├── UserActivityDto.ts
│   ├── UserPermissionDto.ts
│   └── index.ts
└── types/             # Use Case 공통 타입
    ├── ActivityTypes.ts
    ├── PermissionTypes.ts
    └── FileTypes.ts
```

## 🔧 **사용법**

### **1. Use Case 사용**
```typescript
import { UploadFileUseCase } from '../application/usecases/UploadFileUseCase';
import type { FileUploadRequest, FileUploadResponse } from '../application/dto/UploadFileDto';

const uploadUseCase = new UploadFileUseCase(messageRepo, channelRepo);

const request: FileUploadRequest = {
  file: fileInput.files[0],
  channelId: 'channel-1',
  senderId: 'user-1',
  description: 'Important document'
};

const response: FileUploadResponse = await uploadUseCase.execute(request);
```

### **2. DTO 재사용**
```typescript
import type { 
  FileUploadRequest, 
  FileUploadResponse,
  ActivityLogRequest,
  CheckPermissionRequest 
} from '../application/dto';

// 여러 Use Case에서 동일한 DTO 사용 가능
const fileRequest: FileUploadRequest = { /* ... */ };
const activityRequest: ActivityLogRequest = { /* ... */ };
const permissionRequest: CheckPermissionRequest = { /* ... */ };
```

### **3. API 통합**
```typescript
// API Controller에서 DTO 직접 사용
export class FileController {
  async uploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
    const useCase = new UploadFileUseCase(messageRepo, channelRepo);
    return await useCase.execute(request);
  }
}
```

## 📊 **분리 전후 비교**

### **분리 전 (한 파일에 혼재)**
```typescript
// UploadFileUseCase.ts
export interface FileUploadRequest { /* DTO */ }
export interface FileUploadResponse { /* DTO */ }
export class UploadFileUseCase { /* Use Case */ }
```

**문제점:**
- 책임이 혼재
- DTO 재사용 어려움
- API 문서화 복잡
- 테스트 어려움

### **분리 후 (명확한 분리)**
```typescript
// UploadFileDto.ts
export interface FileUploadRequest { /* DTO */ }
export interface FileUploadResponse { /* DTO */ }

// UploadFileUseCase.ts
import type { FileUploadRequest, FileUploadResponse } from '../dto/UploadFileDto';
export class UploadFileUseCase { /* Use Case */ }
```

**장점:**
- 명확한 책임 분리
- 높은 재사용성
- 쉬운 API 문서화
- 독립적인 테스트

## 🎯 **클린 아키텍처 원칙 준수**

### **1. 의존성 방향**
```
Presentation → Application → Domain ← Infrastructure
```

- ✅ **Use Case**: Application Layer의 비즈니스 로직
- ✅ **DTO**: Application Layer의 데이터 계약
- ✅ **Domain**: 순수한 도메인 로직

### **2. 레이어별 사용**
- **Application Layer**: Use Case + DTO
- **Presentation Layer**: DTO (Request/Response)
- **Infrastructure Layer**: DTO (API 통신)

### **3. Use Case 패턴**
```typescript
// 표준 Use Case 구조
export class SomeUseCase {
  constructor(
    private readonly repository: IRepository
  ) {}

  async execute(request: RequestDto): Promise<ResponseDto> {
    // 1. 입력 검증
    // 2. 비즈니스 로직 실행
    // 3. 결과 반환
  }
}
```

## 🧪 **테스트 전략**

### **1. Use Case 테스트**
```typescript
describe('UploadFileUseCase', () => {
  it('should upload file successfully', async () => {
    const useCase = new UploadFileUseCase(mockMessageRepo, mockChannelRepo);
    const request: FileUploadRequest = { /* ... */ };
    
    const response = await useCase.execute(request);
    
    expect(response.fileUrl).toBeDefined();
    expect(response.message).toBeDefined();
  });
});
```

### **2. DTO 테스트**
```typescript
describe('FileUploadDto', () => {
  it('should validate required fields', () => {
    const request: FileUploadRequest = {
      file: new File([''], 'test.txt'),
      channelId: 'channel-1',
      senderId: 'user-1'
    };
    
    expect(request.file).toBeDefined();
    expect(request.channelId).toBeDefined();
    expect(request.senderId).toBeDefined();
  });
});
```

## 📋 **DTO 분류**

### **1. Request DTOs**
- `FileUploadRequest`
- `ActivityLogRequest`
- `CheckPermissionRequest`
- `AssignRoleRequest`

### **2. Response DTOs**
- `FileUploadResponse`
- `ActivityLogResponse`
- `CheckPermissionResponse`
- `AssignRoleResponse`

### **3. Domain DTOs**
- `ActivityLog`
- `Permission`
- `Role`
- `UserRole`

## 🔄 **변환 패턴**

### **1. Use Case 내부 변환**
```typescript
export class UploadFileUseCase {
  async execute(request: FileUploadRequest): Promise<FileUploadResponse> {
    // Request DTO → Domain Entity
    const messageEntity = MessageEntity.create({
      content: request.description,
      channelId: request.channelId,
      senderId: request.senderId,
      type: 'file'
    });

    // Domain Entity → Response DTO
    const savedMessage = await this.messageRepository.save(messageEntity);
    
    return {
      message: savedMessage.toJSON(),
      fileUrl: fileUrl,
      fileSize: fileSize,
      fileName: fileName
    };
  }
}
```

### **2. API Controller 변환**
```typescript
export class FileController {
  async uploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
    const useCase = new UploadFileUseCase(messageRepo, channelRepo);
    return await useCase.execute(request);
  }
}
```

## 🎉 **결론**

Use Case와 DTO의 분리는 클린 아키텍처의 Application Layer를 더욱 견고하게 만드는 중요한 단계입니다. 이를 통해:

- ✅ **명확한 책임 분리**
- ✅ **높은 재사용성**
- ✅ **쉬운 API 문서화**
- ✅ **독립적인 테스트**
- ✅ **유지보수성 향상**

이 구조를 통해 비즈니스 로직과 데이터 계약이 명확하게 분리되어, 더 견고하고 확장 가능한 애플리케이션을 구축할 수 있습니다. 🚀 