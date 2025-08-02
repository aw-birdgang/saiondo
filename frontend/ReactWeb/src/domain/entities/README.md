# Domain Entities Structure

## Overview
이 디렉토리는 도메인 엔티티들을 포함하며, 각 엔티티는 다음과 같은 구조를 따릅니다:

## File Structure Pattern

### 1. Data Transfer Objects (DTOs)
```typescript
// 데이터 전송용 인터페이스
export interface User {
  id: string;
  email: string;
  // ... 기타 속성들
}
```

### 2. Domain Entity Class
```typescript
// 비즈니스 로직이 포함된 도메인 엔티티
export class UserEntity {
  private constructor(...) {
    this.validate();
  }

  // Factory methods
  static create(data): UserEntity { ... }
  static fromData(data): UserEntity { ... }

  // Business methods
  updateProfile(): UserEntity { ... }

  // Getters
  get id(): string { ... }

  // Data transfer
  toJSON(): User { ... }
}
```

## Usage Guidelines

### 1. When to use Interface vs Class

**Use Interface when:**
- 데이터 전송 객체 (DTO)
- API 요청/응답 타입
- 컴포넌트 props 타입
- 순수한 데이터 구조

**Use Class when:**
- 비즈니스 로직이 필요한 도메인 엔티티
- 불변성(immutability)이 필요한 객체
- 검증 로직이 포함된 객체
- 메서드가 필요한 객체

### 2. Entity Creation Pattern

```typescript
// 새로운 엔티티 생성
const user = UserEntity.create({
  email: 'user@example.com',
  username: 'username'
});

// 기존 데이터로부터 엔티티 생성
const userEntity = UserEntity.fromData(userData);

// 비즈니스 메서드 사용
const updatedUser = userEntity.updateProfile('New Name', 'avatar.jpg');
```

### 3. Data Transfer

```typescript
// 엔티티를 DTO로 변환
const userDto = userEntity.toJSON();

// API 호출 시 사용
await userRepository.save(userDto);
```

## Benefits of This Structure

1. **Separation of Concerns**: 데이터 전송과 비즈니스 로직 분리
2. **Type Safety**: TypeScript의 강력한 타입 체크 활용
3. **Immutability**: 불변 객체로 부작용 방지
4. **Validation**: 엔티티 생성 시 자동 검증
5. **Testability**: 각 부분을 독립적으로 테스트 가능

## Naming Conventions

- **Interface**: `User`, `Channel`, `Message` (DTO용)
- **Class**: `UserEntity`, `ChannelEntity`, `MessageEntity` (도메인 엔티티용)
- **File**: `User.ts`, `Channel.ts`, `Message.ts` (둘 다 포함) 