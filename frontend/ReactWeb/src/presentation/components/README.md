# Components Structure

## Overview
이 디렉토리는 ReactWeb 애플리케이션의 모든 UI 컴포넌트를 포함합니다. 컴포넌트는 기능별로 분류되어 있어 유지보수성과 확장성을 높였습니다.

## Structure

### 📁 Common Components (`/common`)
재사용 가능한 범용 UI 컴포넌트들
- `Button`, `Card`, `Modal`, `Input` 등
- 여러 페이지에서 공통으로 사용되는 컴포넌트
- UI 라이브러리 역할

### 📁 Layout Components (`/layout`)
레이아웃 관련 컴포넌트들
- `MainLayout`, `PageHeader`, `Sidebar` 등
- 페이지 구조를 정의하는 컴포넌트

### 📁 Feature Components
특정 기능에 특화된 컴포넌트들

#### `/auth` - 인증 관련
- `LoginForm`, `RegisterForm`, `AuthGuard` 등

#### `/home` - 홈 페이지
- `HomeDashboard`, `QuickActionsSection` 등

#### `/chat` - 채팅 기능
- `ChatMessages`, `ChatInput`, `AIChatWidget` 등

#### `/channel` - 채널 관리
- `ChannelList`, `ChannelStats` 등

#### `/analysis` - 분석 기능
- `AnalysisChart`, `CoupleProfile` 등

#### `/calendar` - 캘린더 기능
- `CalendarGrid`, `EventForm` 등

#### `/category` - 카테고리 관리
- `CategoryCard`, `CategoryCodeModal` 등

#### `/invite` - 초대 기능
- `InviteForm`, `InvitationCard` 등

#### `/mypage` - 마이페이지
- `MenuCard`, `MyPageContent` 등

#### `/payment` - 결제 기능
- `PaymentModal`, `ProductCard` 등

#### `/assistant` - AI 어시스턴트
- `AssistantGrid`, `AiAdviceCard` 등

#### `/splash` - 스플래시 화면
- `SplashAnimation`, `SplashContainer` 등

#### `/profile` - 프로필 관리
- `ProfileHeader`, `ProfileInfo` 등

#### `/search` - 검색 기능
- `SearchResults`, `SearchFilters` 등

#### `/settings` - 설정
- `SettingsContainer`, `ToggleSetting` 등

### 📁 Loading Components (`/loading`)
로딩 관련 컴포넌트들
- `LazyLoader`, `ErrorBoundary` 등

## Usage

### Import Examples
```typescript
// Common components
import { Button, Card, Modal } from '@/presentation/components/common';

// Feature components
import { LoginForm, AuthGuard } from '@/presentation/components/auth';
import { HomeDashboard } from '@/presentation/components/home';
import { ChatMessages } from '@/presentation/components/chat';

// Layout components
import { PageHeader } from '@/presentation/components/layout';
```

### Adding New Components
1. 해당 기능 폴더에 컴포넌트 파일 생성
2. 폴더의 `index.ts`에 export 추가
3. 메인 `index.ts`에서 해당 폴더 export 확인

## Migration Notes
- 기존 `specific/` 폴더 구조에서 기능별 구조로 변경
- 모든 import 경로가 자동으로 업데이트됨
- 중복된 컴포넌트들이 통합됨

## Benefits
- **명확한 책임 분리**: 각 폴더가 특정 기능을 담당
- **향상된 유지보수성**: 관련 컴포넌트들이 함께 그룹화
- **확장성**: 새로운 기능 추가 시 해당 폴더만 생성
- **팀 협업**: 다른 개발자가 쉽게 컴포넌트를 찾을 수 있음 