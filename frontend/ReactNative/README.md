# Saiondo React Native App

React Native 앱을 클린 아키텍처 패턴으로 구현한 프로젝트입니다.

## 🏗️ 아키텍처 구조

```
src/
├── core/                    # 핵심 유틸리티 및 공통 기능
│   ├── constants/          # 상수 정의
│   ├── errors/            # 에러 처리
│   └── utils/             # 유틸리티 함수
├── data/                   # 데이터 레이어
│   ├── datasources/       # 데이터 소스 (API, 로컬 DB)
│   └── repositories/      # 리포지토리 구현체
├── domain/                 # 도메인 레이어
│   ├── entities/          # 도메인 엔티티
│   ├── repositories/      # 리포지토리 인터페이스
│   └── usecases/          # 비즈니스 로직 (유스케이스)
├── presentation/           # 프레젠테이션 레이어
│   ├── navigation/        # 네비게이션 설정
│   ├── providers/         # 상태 관리 프로바이더
│   └── screens/           # 화면 컴포넌트
├── di/                     # 의존성 주입
└── test/                   # 테스트 파일
```

## 🎯 클린 아키텍처 원칙

### 1. 도메인 레이어 (Domain Layer)
- **엔티티 (Entities)**: 비즈니스 규칙을 포함한 핵심 객체
- **리포지토리 인터페이스 (Repository Interfaces)**: 데이터 접근 계약
- **유스케이스 (Use Cases)**: 비즈니스 로직 구현

### 2. 데이터 레이어 (Data Layer)
- **데이터소스 (Data Sources)**: API, 로컬 DB 등 실제 데이터 소스
- **리포지토리 구현체 (Repository Implementations)**: 도메인 인터페이스 구현

### 3. 프레젠테이션 레이어 (Presentation Layer)
- **스크린 (Screens)**: UI 컴포넌트
- **프로바이더 (Providers)**: 상태 관리
- **네비게이션 (Navigation)**: 화면 전환 로직

## 🚀 시작하기

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm start
```

### 테스트 실행
```bash
npm test
```

### 린트 검사
```bash
npm run lint
```

## 📦 주요 의존성

### 상태 관리
- **Zustand**: 경량 상태 관리 라이브러리
- **React Query**: 서버 상태 관리

### 네비게이션
- **React Navigation**: 화면 전환 및 네비게이션

### 네트워킹
- **Axios**: HTTP 클라이언트

### 폼 관리
- **React Hook Form**: 폼 상태 관리

### 테스팅
- **Jest**: 테스트 프레임워크
- **React Native Testing Library**: 컴포넌트 테스팅

## 🔧 개발 가이드라인

### 1. 새로운 기능 추가
1. 도메인 엔티티 정의
2. 리포지토리 인터페이스 작성
3. 유스케이스 구현
4. 데이터소스 및 리포지토리 구현
5. UI 컴포넌트 생성

### 2. 테스트 작성
- 각 레이어별 단위 테스트 작성
- 통합 테스트로 전체 플로우 검증
- 70% 이상의 코드 커버리지 유지

### 3. 에러 처리
- `AppError` 클래스 사용
- 적절한 에러 타입 분류
- 사용자 친화적인 에러 메시지

### 4. 로깅
- `Logger` 유틸리티 사용
- 개발/프로덕션 환경별 로그 레벨 설정

## 📱 화면 구조

- **LoginScreen**: 로그인 화면
- **HomeScreen**: 메인 홈 화면

## 🔄 상태 관리

- **UserProvider**: 사용자 상태 관리
- Context API와 useReducer 패턴 사용

## 🧪 테스트 구조

```
test/
├── unit/           # 단위 테스트
├── integration/    # 통합 테스트
└── setup.ts        # 테스트 설정
```

## 📝 코드 스타일

- TypeScript 사용
- ESLint + Prettier 설정
- 함수형 컴포넌트 및 Hooks 사용
- 명확한 타입 정의

## 🔐 보안

- 환경 변수 사용
- 토큰 기반 인증
- 안전한 데이터 저장

## 📈 성능 최적화

- React.memo 사용
- 불필요한 리렌더링 방지
- 이미지 최적화
- 코드 스플리팅

## 🚀 배포

- Expo EAS Build 사용
- 환경별 설정 분리
- 자동화된 CI/CD 파이프라인 