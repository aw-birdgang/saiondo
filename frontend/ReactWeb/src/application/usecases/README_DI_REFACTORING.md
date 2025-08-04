# UseCase DI 패턴 리팩토링 가이드

## 개요

이 문서는 ReactWeb 프로젝트의 UseCase를 Dependency Injection 패턴으로 리팩토링한 내용을 설명합니다.

## 주요 변경사항

### 1. UseCase 인터페이스 정의

모든 UseCase가 구현해야 할 기본 인터페이스를 정의했습니다:

```typescript
export interface IUseCase<TRequest = any, TResponse = any> {
  execute(request?: TRequest): Promise<TResponse>;
}
```

### 2. DI Container 개선

- UseCase 등록 및 의존성 주입 기능 추가
- 토큰 기반 서비스 관리
- 팩토리 패턴 지원

### 3. UseCase 레지스트리

- 모든 UseCase를 중앙에서 관리
- Lazy loading 지원
- 메타데이터 관리

## 사용 방법

### 1. UseCase 생성

```typescript
// 기존 방식
const userService = new UserService(userRepository, channelRepository, messageRepository);
const useCase = new GetCurrentUserUseCase(userService);

// 새로운 DI 방식
const useCase = UseCaseFactory.createGetCurrentUserUseCase();
```

### 2. UseCase 실행

```typescript
// 모든 UseCase는 execute 메서드를 통해 실행
const result = await useCase.execute(request);
```

### 3. 그룹별 UseCase 생성

```typescript
// 인증 관련 UseCase들
const authUseCases = UseCaseFactory.createAuthUseCases();
const user = await authUseCases.getCurrentUser.execute();

// 채널 관련 UseCase들
const channelUseCases = UseCaseFactory.createChannelUseCases();
const channel = await channelUseCases.create.execute(channelData);

// 메시지 관련 UseCase들
const messageUseCases = UseCaseFactory.createMessageUseCases();
const message = await messageUseCases.send.execute(messageData);
```

## 파일 구조

```
src/
├── di/
│   ├── container.ts              # DI Container
│   └── UseCaseRegistry.ts        # UseCase 레지스트리
├── application/
│   ├── usecases/
│   │   ├── interfaces/
│   │   │   └── IUseCase.ts       # UseCase 인터페이스
│   │   ├── UseCaseFactory.ts     # UseCase 팩토리
│   │   └── ...                   # 개별 UseCase들
│   └── services/
│       └── ...                   # 서비스들
```

## 장점

1. **의존성 분리**: UseCase와 서비스 간의 결합도 감소
2. **테스트 용이성**: Mock 객체 주입이 쉬워짐
3. **확장성**: 새로운 UseCase 추가가 용이
4. **일관성**: 모든 UseCase가 동일한 인터페이스 구현
5. **중앙 관리**: DI Container를 통한 중앙 집중식 의존성 관리

## 마이그레이션 가이드

### 기존 코드에서 새로운 방식으로 변경

```typescript
// Before
class UserComponent {
  private userService = new UserService(userRepository);
  private useCase = new GetCurrentUserUseCase(this.userService);
  
  async getUser() {
    return await this.useCase.execute();
  }
}

// After
class UserComponent {
  private useCase = UseCaseFactory.createGetCurrentUserUseCase();
  
  async getUser() {
    return await this.useCase.execute();
  }
}
```

### 새로운 UseCase 추가

1. UseCase 클래스 생성 및 IUseCase 인터페이스 구현
2. UseCaseRegistry에 등록
3. DI_TOKENS에 토큰 추가
4. UseCaseFactory에 생성 메서드 추가

## 초기화

애플리케이션 시작 시 UseCase 레지스트리가 자동으로 초기화됩니다:

```typescript
// main.tsx에서 자동 초기화
await UseCaseFactory.initialize();
```

## 주의사항

1. 모든 UseCase는 `execute` 메서드를 구현해야 합니다
2. 의존성은 DI Container를 통해 주입받아야 합니다
3. UseCase 생성은 UseCaseFactory를 통해서만 해야 합니다
4. 서비스 등록은 DI Container에서 관리됩니다 