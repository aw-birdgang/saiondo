# 🏗️ 통합된 Dependency Injection (DI) 시스템

이 문서는 ReactWeb 프로젝트의 통합된 Dependency Injection 시스템에 대한 설명입니다.

## 📋 **개요**

DI 시스템은 클린 아키텍처 패턴을 구현하기 위해 모든 의존성을 중앙에서 관리하는 통합된 컨테이너입니다. 기존의 `src/di/`와 `src/app/di/` 두 개의 컨테이너를 하나로 통합하여 일관성과 유지보수성을 향상시켰습니다.

## 🏗️ **아키텍처 구조**

### **통합된 DI 컨테이너 구조**

```
src/di/
├── container.ts              # 메인 DI 컨테이너 (통합)
├── tokens.ts                 # 모든 DI 토큰 정의
├── config.ts                 # 앱 설정 관리
├── useDI.ts                  # React hooks
├── i18n.ts                   # 국제화 설정
├── languageUtils.ts          # 언어 유틸리티
├── translations/             # 번역 파일들
│   ├── en.json              # 영어 번역
│   └── ko.json              # 한국어 번역
├── index.ts                  # 모듈 export
└── README.md                 # 이 문서
```

### **클린 아키텍처 레이어별 DI 관리**

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  (React Components, Hooks, Stores)                         │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│  (Use Cases, Services)                                     │
├─────────────────────────────────────────────────────────────┤
│                     Domain Layer                            │
│  (Entities, Repository Interfaces)                         │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                       │
│  (API Client, Repository Implementations)                  │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 **주요 기능**

### **1. 통합된 의존성 관리**
- 모든 레이어의 의존성을 단일 컨테이너에서 관리
- 토큰 기반 서비스 등록 및 조회
- 팩토리 패턴 지원
- 타입 안전성 보장

### **2. 클린 아키텍처 지원**
- Repository 인터페이스와 구현체 분리
- UseCase 등록 및 의존성 주입
- Service 레이어 관리
- Infrastructure 레이어 관리

### **3. React 앱 특화 기능**
- i18n (국제화) 설정
- WebSocket, 파일 업로드, 결제 등 인프라 서비스
- React hooks와 연동
- Zustand 스토어 통합

### **4. 설정 관리**
- API 설정
- WebSocket 설정
- i18n 설정
- 환경별 설정 관리

## 📦 **등록된 서비스들**

### **Infrastructure Layer**
- `API_CLIENT`: HTTP API 클라이언트
- `WEBSOCKET_CLIENT`: WebSocket 클라이언트

### **Repository Layer**
- `USER_REPOSITORY`: 사용자 데이터 접근
- `CHANNEL_REPOSITORY`: 채널 데이터 접근
- `MESSAGE_REPOSITORY`: 메시지 데이터 접근
- `PROFILE_REPOSITORY`: 프로필 데이터 접근
- `PAYMENT_REPOSITORY`: 결제 데이터 접근
- `SEARCH_REPOSITORY`: 검색 데이터 접근
- `INVITE_REPOSITORY`: 초대 데이터 접근
- `CATEGORY_REPOSITORY`: 카테고리 데이터 접근

### **Service Layer**
- `AUTH_SERVICE`: 인증 서비스
- `USER_SERVICE`: 사용자 서비스
- `CHANNEL_SERVICE`: 채널 서비스
- `MESSAGE_SERVICE`: 메시지 서비스
- `FILE_SERVICE`: 파일 서비스
- `NOTIFICATION_SERVICE`: 알림 서비스
- `PAYMENT_SERVICE`: 결제 서비스
- `SEARCH_SERVICE`: 검색 서비스
- `INVITE_SERVICE`: 초대 서비스
- `CATEGORY_SERVICE`: 카테고리 서비스

### **Use Case Layer**
- `USER_USE_CASES`: 사용자 Use Case 그룹
- `CHANNEL_USE_CASES`: 채널 Use Case 그룹
- `MESSAGE_USE_CASES`: 메시지 Use Case 그룹
- `PAYMENT_USE_CASE`: 결제 Use Case
- `SEARCH_USE_CASE`: 검색 Use Case
- `INVITE_USE_CASE`: 초대 Use Case
- `CATEGORY_USE_CASE`: 카테고리 Use Case
- `USE_CASE_FACTORY`: Use Case 팩토리

### **Configuration**
- `API_CONFIG`: API 설정
- `WEBSOCKET_CONFIG`: WebSocket 설정
- `I18N_CONFIG`: 국제화 설정

### **Stores (Zustand)**
- `AUTH_STORE`: 인증 스토어
- `THEME_STORE`: 테마 스토어
- `USER_STORE`: 사용자 스토어
- `CHANNEL_STORE`: 채널 스토어
- `MESSAGE_STORE`: 메시지 스토어
- `UI_STORE`: UI 스토어

## 🚀 **사용법**

### **1. 기본 DI 컨테이너 사용**

```typescript
import { container } from '../di/container';
import { DI_TOKENS } from '../di/tokens';

// 서비스 가져오기
const userService = container.getUserService();
const apiClient = container.getApiClient();

// 토큰으로 직접 가져오기
const channelService = container.get(DI_TOKENS.CHANNEL_SERVICE);
```

### **2. React Hooks 사용**

```typescript
import { useUseCases, useServices, useRepositories } from '../di/useDI';

const MyComponent = () => {
  // Use Cases
  const { user, channel, message } = useUseCases();
  
  // Services
  const { auth, user: userService } = useServices();
  
  // Repositories
  const { user: userRepo, channel: channelRepo } = useRepositories();
  
  // 사용...
};
```

### **3. 개별 DI Hook 사용**

```typescript
import { useDI } from '../di/useDI';
import { DI_TOKENS } from '../di/tokens';

const MyComponent = () => {
  const userService = useDI(DI_TOKENS.USER_SERVICE);
  const apiClient = useDI(DI_TOKENS.API_CLIENT);
  
  // 사용...
};
```

### **4. i18n 사용**

```typescript
import { useTranslation } from 'react-i18next';
import { setLanguage, getCurrentLanguage } from '../di/languageUtils';

const MyComponent = () => {
  const { t } = useTranslation();
  
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>Current language: {getCurrentLanguage()}</p>
    </div>
  );
};
```

### **5. 설정 관리**

```typescript
import { container } from '../di/container';

// 설정 가져오기
const config = container.getConfig();

// 설정 업데이트
container.updateConfig({
  api: {
    baseURL: 'https://new-api.example.com',
    timeout: 15000,
  },
});
```

## 🔄 **마이그레이션 가이드**

### **기존 app/di 사용 코드 변경**

**Before:**
```typescript
import { container } from '../../app/di/container';
import { DI_TOKENS } from '../../app/di/tokens';
import { useUseCases } from '../../app/di';
```

**After:**
```typescript
import { container } from '../../di/container';
import { DI_TOKENS } from '../../di/tokens';
import { useUseCases } from '../../di/useDI';
```

### **i18n 관련 import 변경**

**Before:**
```typescript
import './app/di/i18n';
import { initializeLanguage } from './app/di/languageUtils';
```

**After:**
```typescript
import './di/i18n';
import { initializeLanguage } from './di/languageUtils';
```

## 🧪 **테스트**

### **DI 컨테이너 테스트**

```typescript
import { container } from '../di/container';
import { DI_TOKENS } from '../di/tokens';

describe('DI Container', () => {
  it('should resolve services correctly', () => {
    const userService = container.getUserService();
    expect(userService).toBeDefined();
  });
  
  it('should handle missing services', () => {
    expect(() => {
      container.get('NON_EXISTENT_SERVICE' as any);
    }).toThrow();
  });
});
```

### **Mock 서비스 등록**

```typescript
import { container } from '../di/container';

// 테스트용 Mock 서비스 등록
container.register(DI_TOKENS.USER_SERVICE, () => new MockUserService(), true);
```

## 📊 **성능 최적화**

### **1. Lazy Loading**
- UseCase와 Service는 필요할 때만 생성
- 메모리 사용량 최적화

### **2. Singleton 패턴**
- 대부분의 서비스는 싱글톤으로 관리
- 인스턴스 재사용으로 성능 향상

### **3. React Hooks 최적화**
- `useMemo`를 사용한 의존성 캐싱
- 불필요한 재렌더링 방지

## 🔧 **확장 가이드**

### **새로운 서비스 추가**

1. **Repository 추가**
```typescript
// 1. Domain Interface 정의
export interface INewRepository {
  // 메서드 정의
}

// 2. Infrastructure Implementation
export class NewRepositoryImpl implements INewRepository {
  // 구현
}

// 3. DI Container에 등록
container.register(DI_TOKENS.NEW_REPOSITORY, () => new NewRepositoryImpl(), true);
```

2. **Service 추가**
```typescript
// 1. Service 클래스 생성
export class NewService {
  constructor(private newRepository: INewRepository) {}
  // 비즈니스 로직
}

// 2. DI Container에 등록
container.register(DI_TOKENS.NEW_SERVICE, () => {
  const repo = container.get(DI_TOKENS.NEW_REPOSITORY);
  return new NewService(repo);
}, true);
```

3. **Use Case 추가**
```typescript
// 1. Use Case 클래스 생성
export class NewUseCase {
  constructor(private newService: NewService) {}
  // 애플리케이션 로직
}

// 2. DI Container에 등록
container.register(DI_TOKENS.NEW_USE_CASE, () => {
  const service = container.get(DI_TOKENS.NEW_SERVICE);
  return new NewUseCase(service);
}, true);
```

## 🎯 **장점**

1. **일관성**: 모든 의존성을 단일 컨테이너에서 관리
2. **유지보수성**: 중앙화된 의존성 관리로 변경 사항 추적 용이
3. **테스트 용이성**: Mock 객체 주입이 쉬워짐
4. **확장성**: 새로운 서비스 추가가 용이
5. **타입 안전성**: TypeScript를 통한 타입 안전성 보장
6. **클린 아키텍처 준수**: 레이어별 의존성 분리
7. **성능 최적화**: Lazy loading과 Singleton 패턴

## 🚀 **결론**

통합된 DI 시스템은 클린 아키텍처의 원칙을 준수하면서도 React 앱의 특성을 고려한 실용적인 의존성 관리 솔루션을 제공합니다. 기존의 두 개 컨테이너를 하나로 통합함으로써 개발자 경험을 향상시키고 코드의 일관성을 보장합니다.
