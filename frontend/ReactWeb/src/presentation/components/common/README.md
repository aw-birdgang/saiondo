# ReactWeb 컴포넌트 구조 가이드

## 📁 디렉토리 구조

```
components/
├── common/           # 공통으로 사용되는 컴포넌트들
├── specific/         # 특정 페이지에서만 사용되는 컴포넌트들
│   ├── assistant/    # AI 어시스턴트 관련 컴포넌트
│   ├── payment/      # 결제 관련 컴포넌트
│   ├── calendar/     # 캘린더 관련 컴포넌트
│   ├── splash/       # 스플래시 화면 관련 컴포넌트
│   └── test/         # 테스트/상태 관련 컴포넌트
└── layout/           # 레이아웃 관련 컴포넌트
```

## 🟢 Common Components (공통 컴포넌트)

여러 페이지에서 공통으로 사용되는 컴포넌트들입니다.

### 1. Header
페이지 상단의 헤더 컴포넌트입니다.

**Props:**
- `title: string` - 헤더 제목
- `showBackButton?: boolean` - 뒤로가기 버튼 표시 여부
- `backRoute?: string` - 뒤로가기 경로
- `showUserInfo?: boolean` - 사용자 정보 표시 여부
- `showLogout?: boolean` - 로그아웃 버튼 표시 여부
- `showThemeToggle?: boolean` - 테마 토글 버튼 표시 여부
- `className?: string` - 추가 CSS 클래스
- `children?: React.ReactNode` - 헤더 내부에 표시할 추가 내용

### 2. Button
다양한 스타일과 크기의 버튼 컴포넌트입니다.

**Props:**
- `children: React.ReactNode` - 버튼 내용
- `variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'` - 버튼 스타일
- `size?: 'sm' | 'md' | 'lg'` - 버튼 크기
- `disabled?: boolean` - 비활성화 여부
- `loading?: boolean` - 로딩 상태
- `fullWidth?: boolean` - 전체 너비 사용 여부
- `onClick?: () => void` - 클릭 핸들러
- `type?: 'button' | 'submit' | 'reset'` - 버튼 타입
- `className?: string` - 추가 CSS 클래스
- `icon?: React.ReactNode` - 아이콘

### 3. Input
입력 필드 컴포넌트입니다.

**Props:**
- `id: string` - 입력 필드 ID
- `name: string` - 입력 필드 이름
- `type?: string` - 입력 타입
- `value: string` - 입력 값
- `onChange: (e: React.ChangeEvent<HTMLInputElement>) => void` - 값 변경 핸들러
- `placeholder?: string` - 플레이스홀더
- `label?: string` - 라벨
- `error?: string` - 에러 메시지
- `disabled?: boolean` - 비활성화 여부
- `required?: boolean` - 필수 입력 여부
- `autoComplete?: string` - 자동완성 설정
- `className?: string` - 추가 CSS 클래스
- `onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void` - 키보드 이벤트 핸들러

### 4. Card
카드 형태의 컨테이너 컴포넌트입니다.

**Props:**
- `children: React.ReactNode` - 카드 내용
- `title?: string` - 카드 제목
- `subtitle?: string` - 카드 부제목
- `className?: string` - 추가 CSS 클래스
- `onClick?: () => void` - 클릭 핸들러
- `hoverable?: boolean` - 호버 효과 여부
- `padding?: 'sm' | 'md' | 'lg'` - 패딩 크기

### 5. UserProfile
사용자 프로필 정보를 표시하는 컴포넌트입니다.

**Props:**
- `showEditButton?: boolean` - 편집 버튼 표시 여부
- `showMemberSince?: boolean` - 가입일 표시 여부
- `size?: 'sm' | 'md' | 'lg'` - 프로필 크기
- `className?: string` - 추가 CSS 클래스

### 6. Form
동적으로 필드를 생성하는 폼 컴포넌트입니다.

**Props:**
- `fields: FormField[]` - 폼 필드 설정 배열
- `values: Record<string, string>` - 폼 값들
- `errors: Record<string, string>` - 에러 메시지들
- `onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void` - 값 변경 핸들러
- `onSubmit: () => void` - 제출 핸들러
- `submitText?: string` - 제출 버튼 텍스트
- `loading?: boolean` - 로딩 상태
- `className?: string` - 추가 CSS 클래스

### 7. MessageBubble
채팅 메시지 버블 컴포넌트입니다.

**Props:**
- `content: string` - 메시지 내용
- `timestamp: string` - 타임스탬프
- `isOwnMessage?: boolean` - 자신의 메시지 여부
- `senderName?: string` - 발신자 이름
- `className?: string` - 추가 CSS 클래스

### 8. ChannelCard
채널 정보를 표시하는 카드 컴포넌트입니다.

**Props:**
- `channel: Channel` - 채널 정보 객체
- `onClick?: () => void` - 클릭 핸들러
- `className?: string` - 추가 CSS 클래스

### 9. ThemeToggle
테마 토글 버튼 컴포넌트입니다.

### 10. EmptyState
빈 상태를 표시하는 컴포넌트입니다.

### 11. LoadingSpinner
로딩 스피너 컴포넌트입니다.

## 🟡 Specific Components (특정 컴포넌트)

특정 페이지에서만 사용되는 컴포넌트들입니다.

### Assistant Components (`specific/assistant/`)
- **AssistantCard** - AI 어시스턴트 카드
- **SearchBar** - 검색 기능
- **CategoryFilter** - 카테고리 필터

### Payment Components (`specific/payment/`)
- **ProductCard** - 상품/서비스 카드

### Calendar Components (`specific/calendar/`)
- **Calendar** - 캘린더 컴포넌트
- **EventCard** - 이벤트 카드

### Splash Components (`specific/splash/`)
- **SplashScreen** - 스플래시 화면

### Test Components (`specific/test/`)
- **ErrorState** - 에러 상태 표시
- **LoadingState** - 로딩 상태 표시

## 📊 컴포넌트 사용 통계

### Common Components (11개)
- **Header** - 8개 페이지에서 사용
- **Button** - 10개 페이지에서 사용
- **Input** - 4개 페이지에서 사용
- **Card** - 6개 페이지에서 사용
- **UserProfile** - 2개 페이지에서 사용
- **Form** - 2개 페이지에서 사용
- **MessageBubble** - 1개 페이지에서 사용
- **ChannelCard** - 1개 페이지에서 사용
- **ThemeToggle** - Header에서 사용
- **EmptyState** - 4개 페이지에서 사용
- **LoadingSpinner** - 6개 컴포넌트에서 사용

### Specific Components (9개)
- **AssistantCard** - AssistantPage에서만 사용
- **SearchBar** - AssistantPage에서만 사용
- **CategoryFilter** - AssistantPage에서만 사용
- **ProductCard** - PaymentPage에서만 사용
- **Calendar** - CalendarPage에서만 사용
- **EventCard** - CalendarPage에서만 사용
- **SplashScreen** - SplashPage에서만 사용
- **ErrorState** - AssistantPage에서만 사용
- **LoadingState** - AssistantPage에서만 사용

## 🗑️ 제거된 컴포넌트들

### 사용되지 않던 컴포넌트들
- **SocketTest** - 테스트용 컴포넌트 (사용되지 않음)
- **FirebaseTest** - 테스트용 컴포넌트 (사용되지 않음)
- **ErrorBoundary** - 에러 경계 컴포넌트 (사용되지 않음)

## 📈 개선 효과

### 1. 구조적 개선
- **명확한 분리**: 공통 컴포넌트와 특정 컴포넌트의 명확한 구분
- **유지보수성 향상**: 각 컴포넌트의 용도가 명확해짐
- **확장성 개선**: 새로운 특정 컴포넌트 추가 시 적절한 위치에 배치

### 2. 성능 최적화
- **번들 크기 감소**: 사용되지 않는 컴포넌트 제거
- **로딩 속도 향상**: 필요한 컴포넌트만 import

### 3. 개발 효율성
- **코드 탐색 개선**: 관련 컴포넌트들이 논리적으로 그룹화
- **재사용성 향상**: 공통 컴포넌트의 명확한 식별
- **일관성 유지**: 공통 컴포넌트를 통한 UI 일관성 보장

## 🚀 사용 가이드

### Import 방법

```typescript
// 공통 컴포넌트 import
import { Header, Button, Input } from '../../components/common';

// 특정 컴포넌트 import
import { AssistantCard, SearchBar } from '../../components/specific/assistant';
import { ProductCard } from '../../components/specific/payment';
import { Calendar, EventCard } from '../../components/specific/calendar';
import { SplashScreen } from '../../components/specific/splash';

// 모든 컴포넌트 한번에 import
import { Header, Button, AssistantCard, ProductCard } from '../../components';
```

### 새로운 컴포넌트 추가 시

1. **공통 컴포넌트**: 여러 페이지에서 사용될 예정이면 `common/`에 추가
2. **특정 컴포넌트**: 특정 페이지에서만 사용될 예정이면 `specific/[페이지명]/`에 추가
3. **레이아웃 컴포넌트**: 레이아웃 관련이면 `layout/`에 추가

이제 컴포넌트 구조가 더욱 체계적이고 유지보수하기 쉬워졌습니다! 