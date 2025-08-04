# Controller DI 패턴 통합 가이드

## 개요

이 문서는 Controller에서 UseCase DI 패턴을 사용하는 방법을 설명합니다.

## 문제점

기존 Controller에서 발생했던 문제들:

1. **생성자에서 UseCase 초기화 실패**: UseCase 레지스트리가 초기화되지 않은 상태에서 UseCase 생성 시도
2. **타입 안전성 문제**: UseCase 타입과 IUseCase 인터페이스 간의 불일치
3. **의존성 주입 문제**: Controller 생성 시점에 UseCase가 준비되지 않음

## 해결 방법

### 1. 지연 초기화 (Lazy Initialization)

Controller에서 UseCase를 필요할 때 초기화하도록 변경:

```typescript
export class ChannelController extends BaseController {
  private createChannelUseCase: IUseCase | null = null;
  private useCasesInitialized = false;

  constructor() {
    super('ChannelController');
  }

  private async initializeUseCases(): Promise<void> {
    if (this.useCasesInitialized) {
      return;
    }

    try {
      this.createChannelUseCase = UseCaseFactory.createCreateChannelUseCase();
      this.useCasesInitialized = true;
    } catch (error) {
      console.error('Failed to initialize UseCases:', error);
      throw new Error('UseCase 초기화에 실패했습니다.');
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.useCasesInitialized) {
      await this.initializeUseCases();
    }
  }
}
```

### 2. 안전한 UseCase 사용

모든 메서드에서 초기화 확인 및 null 체크:

```typescript
async createChannel(channelData: any): Promise<any> {
  return this.executeWithTracking(
    'createChannel',
    { name: channelData.name, ownerId: channelData.ownerId },
    async () => {
      await this.ensureInitialized();

      if (!this.createChannelUseCase) {
        throw new Error('UseCase가 초기화되지 않았습니다.');
      }

      const result = await this.createChannelUseCase.execute(channelData);
      return result.channel;
    }
  );
}
```

### 3. ControllerFactory 개선

ControllerFactory에서 UseCase 레지스트리 초기화:

```typescript
export class ControllerFactory {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // UseCase 레지스트리 초기화
      await UseCaseFactory.initialize();
      this.isInitialized = true;
    } catch (error) {
      throw error;
    }
  }

  async createController(type: string): Promise<IController> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Controller 생성 로직...
  }
}
```

## 사용 방법

### 1. Controller 생성

```typescript
// 비동기로 Controller 생성
const controllerFactory = ControllerFactory.getInstance();
const userController = await controllerFactory.createController('user');
```

### 2. Controller 사용

```typescript
// Controller 메서드 호출 (내부에서 자동으로 UseCase 초기화)
const user = await userController.getCurrentUser();
```

### 3. 애플리케이션 초기화

```typescript
// main.tsx에서 초기화
async function initializeApp() {
  try {
    await UseCaseFactory.initialize();
    await ControllerFactory.getInstance().initialize();
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
}
```

## 장점

1. **안전한 초기화**: UseCase 레지스트리가 준비된 후 Controller 생성
2. **지연 로딩**: 필요할 때만 UseCase 초기화
3. **에러 처리**: 초기화 실패 시 명확한 에러 메시지
4. **타입 안전성**: IUseCase 인터페이스 사용으로 일관성 보장

## 주의사항

1. **비동기 처리**: Controller 생성이 비동기로 변경됨
2. **초기화 순서**: UseCase 레지스트리 → ControllerFactory → Controller 순서로 초기화
3. **에러 핸들링**: 초기화 실패 시 적절한 에러 처리 필요
4. **성능**: 지연 초기화로 인한 첫 호출 시 약간의 지연 발생 가능

## 마이그레이션 체크리스트

- [ ] Controller 생성자를 비동기 초기화로 변경
- [ ] UseCase 타입을 IUseCase로 변경
- [ ] 모든 메서드에 ensureInitialized() 호출 추가
- [ ] null 체크 로직 추가
- [ ] ControllerFactory 초기화 로직 추가
- [ ] main.tsx에서 ControllerFactory 초기화 추가
- [ ] 에러 처리 로직 개선 