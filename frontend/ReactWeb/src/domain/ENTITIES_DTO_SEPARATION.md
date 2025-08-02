# 🏗️ Entity와 DTO 분리 구조

## 📋 **개요**

클린 아키텍처와 도메인 주도 설계(DDD) 원칙에 따라 **Entity**와 **DTO**를 분리하여 관리합니다.

## 🎯 **분리 이유**

### **1. 단일 책임 원칙 (SRP)**
- **Entity**: 비즈니스 로직과 도메인 규칙 담당
- **DTO**: 데이터 전송과 API 통신 담당

### **2. 의존성 분리**
- **Entity**: 순수한 도메인 로직, 외부 의존성 없음
- **DTO**: API 스펙에 의존, 외부 시스템과의 계약

### **3. 재사용성**
- **DTO**: 여러 레이어에서 재사용 가능
- **Entity**: 도메인 로직에만 집중

### **4. 테스트 용이성**
- 각각 독립적으로 테스트 가능
- Mock 객체 생성 용이

## 📁 **구조**

```
domain/
├── entities/           # Domain Entities (비즈니스 로직)
│   ├── ChannelEntity.ts
│   ├── MessageEntity.ts
│   └── UserEntity.ts
├── dto/               # Data Transfer Objects
│   ├── ChannelDto.ts
│   ├── MessageDto.ts
│   ├── UserDto.ts
│   └── index.ts
└── types/             # 공통 타입 정의
    ├── ChannelTypes.ts
    ├── MessageTypes.ts
    └── UserTypes.ts
```

## 🔧 **사용법**

### **1. Entity 사용**
```typescript
import { ChannelEntity } from '../domain/entities/Channel';

// Entity 생성
const channelEntity = ChannelEntity.create({
  name: 'General',
  type: 'public',
  ownerId: 'user-1',
  members: ['user-1', 'user-2']
});

// 비즈니스 로직 실행
const updatedChannel = channelEntity.addMember('user-3');
const canJoin = channelEntity.canJoin('user-4');
```

### **2. DTO 사용**
```typescript
import type { Channel, CreateChannelRequest } from '../domain/dto/ChannelDto';

// API 요청
const createRequest: CreateChannelRequest = {
  name: 'General',
  type: 'public',
  ownerId: 'user-1',
  members: ['user-1', 'user-2']
};

// API 응답
const channelResponse: Channel = {
  id: 'channel-1',
  name: 'General',
  type: 'public',
  ownerId: 'user-1',
  members: ['user-1', 'user-2'],
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### **3. Entity ↔ DTO 변환**
```typescript
// DTO → Entity
const channelEntity = ChannelEntity.fromData(channelDto);

// Entity → DTO
const channelDto = channelEntity.toJSON();
```

## 📊 **분리 전후 비교**

### **분리 전 (한 파일에 혼재)**
```typescript
// Channel.ts
export interface Channel { /* DTO */ }
export class ChannelEntity { /* Entity */ }
export interface CreateChannelRequest { /* DTO */ }
export interface UpdateChannelRequest { /* DTO */ }
```

**문제점:**
- 책임이 혼재
- 의존성 복잡
- 재사용성 낮음
- 테스트 어려움

### **분리 후 (명확한 분리)**
```typescript
// ChannelDto.ts
export interface Channel { /* DTO */ }
export interface CreateChannelRequest { /* DTO */ }
export interface UpdateChannelRequest { /* DTO */ }

// ChannelEntity.ts
import type { Channel } from '../dto/ChannelDto';
export class ChannelEntity { /* Entity */ }
```

**장점:**
- 명확한 책임 분리
- 단순한 의존성
- 높은 재사용성
- 쉬운 테스트

## 🎯 **클린 아키텍처 원칙 준수**

### **1. 의존성 방향**
```
Presentation → Application → Domain ← Infrastructure
```

- ✅ **Entity**: Domain Layer 내부에서만 사용
- ✅ **DTO**: 모든 레이어에서 사용 가능
- ✅ **Infrastructure**: DTO를 통해 외부 시스템과 통신

### **2. 레이어별 사용**
- **Domain Layer**: Entity + DTO
- **Application Layer**: DTO + Entity (변환)
- **Infrastructure Layer**: DTO
- **Presentation Layer**: DTO

### **3. 변환 패턴**
```typescript
// Repository에서 변환
class ChannelRepositoryImpl {
  async findById(id: string): Promise<Channel> {
    const response = await this.apiClient.get(`/channels/${id}`);
    return response.data; // DTO 반환
  }

  async save(channel: Channel): Promise<Channel> {
    const entity = ChannelEntity.fromData(channel);
    const validatedEntity = entity.validate();
    const dto = validatedEntity.toJSON();
    
    const response = await this.apiClient.post('/channels', dto);
    return response.data; // DTO 반환
  }
}
```

## 🧪 **테스트 전략**

### **1. Entity 테스트**
```typescript
describe('ChannelEntity', () => {
  it('should add member correctly', () => {
    const channel = ChannelEntity.create({ /* ... */ });
    const updatedChannel = channel.addMember('user-3');
    
    expect(updatedChannel.members).toContain('user-3');
  });
});
```

### **2. DTO 테스트**
```typescript
describe('ChannelDto', () => {
  it('should validate required fields', () => {
    const channel: Channel = {
      id: 'channel-1',
      name: 'General',
      type: 'public',
      ownerId: 'user-1',
      members: ['user-1'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    expect(channel.name).toBeDefined();
    expect(channel.type).toBeDefined();
  });
});
```

## 🎉 **결론**

Entity와 DTO의 분리는 클린 아키텍처의 핵심 원칙을 구현하는 중요한 단계입니다. 이를 통해:

- ✅ **명확한 책임 분리**
- ✅ **높은 재사용성**
- ✅ **쉬운 테스트**
- ✅ **유지보수성 향상**
- ✅ **확장성 개선**

이 구조를 통해 도메인 로직과 데이터 전송 로직이 명확하게 분리되어, 더 견고하고 유지보수하기 쉬운 코드를 작성할 수 있습니다. 🚀 