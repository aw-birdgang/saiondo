# ReactWeb 프로젝트 - PlantUML 다이어그램

이 디렉토리에는 ReactWeb 프로젝트의 아키텍처와 구조를 시각화한 PlantUML 다이어그램들이 포함되어 있습니다.

## 📊 다이어그램 목록

### 상세 다이어그램 (완전한 버전)

#### 1. `reactweb-architecture-complete.puml`
**완전한 클린 아키텍처 구조 다이어그램**

- **목적**: 프로젝트의 전체 아키텍처와 계층 구조를 상세히 보여줍니다
- **내용**:
  - 4계층 클린 아키텍처 (Domain, Application, Infrastructure, Presentation)
  - 의존성 주입 시스템
  - Zustand 상태 관리
  - React Context 구조
  - 외부 라이브러리 의존성
- **사용 시기**: 프로젝트 전체 구조 이해, 아키텍처 리뷰, 신규 개발자 온보딩

#### 2. `reactweb-sequence-flow.puml`
**주요 기능들의 시퀀스 플로우 다이어그램**

- **목적**: 핵심 기능들의 실행 흐름을 시간 순서대로 상세히 보여줍니다
- **내용**:
  - 사용자 인증 플로우
  - 실시간 채팅 메시지 전송
  - 채널 생성 프로세스
  - 파일 업로드 처리
  - 검색 기능 실행
  - 실시간 알림 처리
  - 테마 변경
  - 에러 처리
  - 앱 초기화
- **사용 시기**: 기능 개발 시 참고, 디버깅, 성능 최적화

#### 3. `reactweb-component-state-flow.puml`
**컴포넌트 구조 및 상태 관리 흐름 다이어그램**

- **목적**: React 컴포넌트와 상태 관리 시스템의 관계를 상세히 보여줍니다
- **내용**:
  - 메인 앱 구조 (App, AppProviders, AppContent)
  - React Context 구조
  - Zustand Store 구조
  - 컴포넌트 계층 구조
  - 커스텀 훅
  - 상태 관리 흐름
- **사용 시기**: 컴포넌트 개발, 상태 관리 최적화, 리팩토링

#### 4. `reactweb-project-structure.puml`
**전체 프로젝트 파일 구조 다이어그램**

- **목적**: 실제 디렉토리와 파일 구조를 상세히 시각화합니다
- **내용**:
  - src/ 디렉토리 구조
  - 각 계층별 파일 구성
  - 설정 파일들
  - 문서 파일들
  - 스크립트 파일들
- **사용 시기**: 프로젝트 탐색, 파일 위치 파악, 구조 이해

### 단순화된 다이어그램 (간결한 버전)

#### 1. `reactweb-architecture-simple.puml`
**단순화된 클린 아키텍처 구조 다이어그램**

- **목적**: 핵심 아키텍처 구조만 간결하게 보여줍니다
- **내용**:
  - 4계층 구조의 핵심 요소만
  - 주요 의존성 관계
  - 간단한 설명 노트
- **사용 시기**: 빠른 구조 파악, 프레젠테이션, 개요 설명

#### 2. `reactweb-sequence-simple.puml`
**단순화된 시퀀스 플로우 다이어그램**

- **목적**: 핵심 플로우만 간결하게 보여줍니다
- **내용**:
  - 사용자 인증, 실시간 채팅, 채널 생성의 핵심 단계만
  - 간소화된 참여자
  - 핵심 플로우 요약
- **사용 시기**: 빠른 플로우 이해, 간단한 설명

#### 3. `reactweb-component-simple.puml`
**단순화된 컴포넌트 구조 다이어그램**

- **목적**: 핵심 컴포넌트와 상태 관리 구조만 간결하게 보여줍니다
- **내용**:
  - 주요 컴포넌트와 Store만
  - 핵심 관계만 표시
  - 간단한 설명
- **사용 시기**: 컴포넌트 구조 빠른 파악

#### 4. `reactweb-structure-simple.puml`
**단순화된 프로젝트 파일 구조 다이어그램**

- **목적**: 핵심 디렉토리와 파일만 간결하게 보여줍니다
- **내용**:
  - 주요 디렉토리 구조만
  - 핵심 파일들만 표시
  - 간단한 설명
- **사용 시기**: 프로젝트 구조 빠른 파악

## 🛠️ 사용 방법

### PlantUML 뷰어에서 보기
1. PlantUML 확장 프로그램 설치 (VS Code, IntelliJ 등)
2. `.puml` 파일 열기
3. 자동으로 다이어그램이 렌더링됩니다

### 온라인에서 보기
1. [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/) 접속
2. `.puml` 파일 내용을 복사하여 붙여넣기
3. 다이어그램 확인

### 이미지로 내보내기
```bash
# PlantUML JAR 파일 사용
java -jar plantuml.jar reactweb-architecture-complete.puml
java -jar plantuml.jar reactweb-architecture-simple.puml
java -jar plantuml.jar reactweb-sequence-flow.puml
java -jar plantuml.jar reactweb-sequence-simple.puml
java -jar plantuml.jar reactweb-component-state-flow.puml
java -jar plantuml.jar reactweb-component-simple.puml
java -jar plantuml.jar reactweb-project-structure.puml
java -jar plantuml.jar reactweb-structure-simple.puml
```

## 🏗️ 아키텍처 개요

### 클린 아키텍처 4계층

1. **Domain Layer** (가장 안쪽)
   - 비즈니스 엔티티 (User, Channel, Message)
   - 값 객체 (Email, UserId, ChannelId, MessageId)
   - 리포지토리 인터페이스
   - 도메인 서비스
   - 도메인 에러

2. **Application Layer**
   - 유스케이스 (UserUseCases, ChannelUseCases, MessageUseCases)
   - 컨트롤러 (UserController, ChannelController, MessageController)
   - 애플리케이션 서비스 (AuthService, NotificationService)
   - DTO

3. **Infrastructure Layer**
   - API 클라이언트 (ApiClient, WebSocketClient)
   - 리포지토리 구현체 (UserRepositoryImpl, ChannelRepositoryImpl)
   - 외부 서비스 (Firebase, Payment Gateway)
   - 캐시/스토리지 (Redis, LocalStorage)

4. **Presentation Layer**
   - React 컴포넌트 (Pages, Components)
   - 커스텀 훅 (useAuth, useUser, useChannel)
   - 라우팅 (AppRoutes, RouteGuards)
   - 상태 관리 (Zustand Stores, React Context)

### 주요 기술 스택

- **프레임워크**: React 19.1.0
- **상태 관리**: Zustand 5.0.7
- **라우팅**: React Router DOM 7.7.1
- **HTTP 클라이언트**: Axios 1.11.0
- **실시간 통신**: Socket.io-client 4.8.1
- **폼 관리**: React Hook Form 7.51.0
- **스타일링**: Tailwind CSS 3.4.0
- **빌드 도구**: Vite 7.0.4
- **언어**: TypeScript 5.8.3

## 🔄 데이터 플로우

### 상태 관리 흐름
1. 사용자 액션 → 컴포넌트
2. 컴포넌트 → 커스텀 훅
3. 커스텀 훅 → Store
4. Store → Context → 컴포넌트
5. UI 업데이트

### 의존성 주입 흐름
1. Container에서 서비스 등록
2. Factory 패턴으로 인스턴스 생성
3. Registry를 통한 UseCase 관리
4. Context를 통한 컴포넌트 주입

## 📝 다이어그램 선택 가이드

### 상세 다이어그램 사용 시기
- **신규 개발자 온보딩**: 완전한 구조 이해 필요
- **아키텍처 리뷰**: 세부사항 검토 필요
- **복잡한 기능 개발**: 상세한 의존성 관계 파악 필요
- **문서화**: 완전한 참조 자료 필요

### 단순화된 다이어그램 사용 시기
- **빠른 구조 파악**: 핵심만 이해하고 싶을 때
- **프레젠테이션**: 간결한 설명 필요
- **개요 설명**: 세부사항 없이 전체 그림만 필요
- **초기 학습**: 복잡함을 피하고 기본 개념 이해

## 📝 다이어그램 업데이트

프로젝트 구조가 변경될 때마다 해당하는 다이어그램을 업데이트해야 합니다:

1. **새로운 컴포넌트 추가**: 컴포넌트 관련 다이어그램 업데이트
2. **새로운 기능 추가**: 시퀀스 다이어그램 업데이트
3. **아키텍처 변경**: 아키텍처 다이어그램 업데이트
4. **파일 구조 변경**: 프로젝트 구조 다이어그램 업데이트

## 🎯 활용 방안

### 개발팀
- 신규 개발자 온보딩 자료
- 코드 리뷰 시 참고 자료
- 아키텍처 의사결정 문서

### 프로젝트 관리
- 프로젝트 구조 설명
- 기술 스택 소개
- 개발 일정 계획

### 유지보수
- 코드 구조 이해
- 리팩토링 계획
- 성능 최적화

---

**참고**: 
- 상세 다이어그램은 완전한 참조용
- 단순화된 다이어그램은 빠른 이해용
- 프로젝트 상태에 따라 지속적으로 업데이트 필요 