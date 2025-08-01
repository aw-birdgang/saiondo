# ReactWeb Components

이 문서는 ReactWeb 프로젝트의 컴포넌트 구조와 사용법을 설명합니다.

## 컴포넌트 구조

### Common Components (`/common`)
공통적으로 사용되는 기본 컴포넌트들

#### 폼 관련
- **Form**: 폼 컴포넌트
- **FormField**: 폼 필드 컴포넌트 (Input, Select 지원)
- **Input**: 입력 필드 컴포넌트
- **TextArea**: 텍스트 영역 컴포넌트
- **Button**: 버튼 컴포넌트
- **IconButton**: 아이콘 버튼 컴포넌트

#### 메시지 관련
- **MessageBubble**: 메시지 버블 컴포넌트
- **MessageContent**: 메시지 내용 컴포넌트 (텍스트, 이미지, 파일, 시스템 메시지 지원)
- **MessageTimestamp**: 메시지 타임스탬프 컴포넌트

#### 채널 관련
- **ChannelCard**: 채널 카드 컴포넌트
- **ChannelHeader**: 채널 헤더 컴포넌트
- **ChannelDescription**: 채널 설명 컴포넌트
- **ChannelMeta**: 채널 메타 정보 컴포넌트

#### 레이아웃 및 UI
- **Card**: 카드 컨테이너 컴포넌트
- **Header**: 페이지 헤더 컴포넌트
- **UserProfile**: 사용자 프로필 컴포넌트
- **UserAvatar**: 사용자 아바타 컴포넌트
- **HeartIcon**: 하트 아이콘 컴포넌트
- **EmptyState**: 빈 상태 표시 컴포넌트
- **StatusBadge**: 상태를 표시하는 배지 컴포넌트
- **LoadingSpinner**: 로딩 스피너 컴포넌트
- **ThemeToggle**: 테마 토글 컴포넌트
- **InfoCard**: 정보를 표시하는 카드 컴포넌트
- **TimeFormatter**: 시간 포맷터 컴포넌트
- **CategoryBadge**: 카테고리 배지 컴포넌트
- **ErrorDisplay**: 에러 표시 컴포넌트
- **SectionHeader**: 섹션 헤더 컴포넌트
- **ActionButton**: 액션 버튼 컴포넌트
- **ContentCard**: 콘텐츠 카드 컴포넌트
- **Divider**: 구분선 컴포넌트
- **Grid**: 반응형 그리드 레이아웃 컴포넌트
- **Flex**: Flexbox 레이아웃 컴포넌트
- **Stack**: 수직 스택 레이아웃 컴포넌트
- **Icon**: 아이콘 컴포넌트
- **Badge**: 범용 배지 컴포넌트
- **InteractiveCard**: 인터랙티브 카드 컴포넌트
- **CenteredContainer**: 중앙 정렬 컨테이너 컴포넌트
- **Text**: 텍스트 컴포넌트
- **Avatar**: 아바타 컴포넌트
- **Heading**: 제목 컴포넌트
- **Caption**: 캡션 텍스트 컴포넌트
- **StatusIndicator**: 상태 표시 컴포넌트

#### 캘린더 관련
- **CalendarDay**: 캘린더 날짜 컴포넌트
- **CalendarHeader**: 캘린더 요일 헤더 컴포넌트

#### 결제 관련
- **PriceDisplay**: 가격 표시 컴포넌트
- **FeatureList**: 기능 목록 컴포넌트
- **PopularBadge**: 인기 상품 배지 컴포넌트
- **PaymentMethodCard**: 결제 방법 카드 컴포넌트

#### 기타
- **ProgressBar**: 진행률 바 컴포넌트
- **KeywordTag**: 키워드 태그 컴포넌트
- **MenuIcon**: 메뉴 아이콘 컴포넌트
- **MenuItemContent**: 메뉴 아이템 내용 컴포넌트
- **InviteIcon**: 초대 아이콘 컴포넌트
- **InviteHeader**: 초대 헤더 컴포넌트
- **AssistantStats**: 어시스턴트 통계 컴포넌트
- **ChatAction**: 채팅 액션 컴포넌트
- **ArrowIcon**: 화살표 아이콘 컴포넌트
- **SearchInput**: 검색 입력 필드 컴포넌트
- **CategoryFilter**: 카테고리 필터 컴포넌트
- **LogoAnimation**: 로고 애니메이션 컴포넌트
- **LoadingDots**: 로딩 점들 컴포넌트
- **SplashProgressBar**: 스플래시 진행률 바 컴포넌트
- **SplashTagline**: 스플래시 태그라인 컴포넌트
- **CategoryIcon**: 카테고리 아이콘 컴포넌트
- **ExampleList**: 예시 목록 컴포넌트
- **TipList**: 팁 목록 컴포넌트
- **StepGuide**: 단계별 가이드 컴포넌트
- **ActionButtons**: 액션 버튼들 컴포넌트
- **AuthHeader**: 인증 페이지 헤더 컴포넌트
- **QuickLoginButton**: 빠른 로그인 버튼 컴포넌트
- **QuickActionButton**: 빠른 액션 버튼 컴포넌트
- **SystemStatItem**: 시스템 통계 아이템 컴포넌트
- **LoadingState**: 로딩 상태 컴포넌트
- **ChatContainer**: 채팅 컨테이너 컴포넌트
- **ChatMessagesContainer**: 채팅 메시지 컨테이너 컴포넌트
- **ChatInputContainer**: 채팅 입력 컨테이너 컴포넌트
- **ChannelStatItem**: 채널 통계 아이템 컴포넌트
- **AnalysisContainer**: 분석 컨테이너 컴포넌트
- **AnalysisHeaderContainer**: 분석 헤더 컨테이너 컴포넌트
- **AnalysisContentContainer**: 분석 내용 컨테이너 컴포넌트
- **RefreshButton**: 새로고침 버튼 컴포넌트
- **EmptyInvitationsState**: 빈 초대장 상태 컴포넌트
- **SubscriptionFooter**: 구독 푸터 컴포넌트
- **AssistantPageContainer**: 어시스턴트 페이지 컨테이너 컴포넌트
- **AssistantFiltersContainer**: 어시스턴트 필터 컨테이너 컴포넌트
- **AssistantContentContainer**: 어시스턴트 내용 컨테이너 컴포넌트
- **LoginPageContainer**: 로그인 페이지 컨테이너 컴포넌트
- **InvitationPageContainer**: 초대장 페이지 컨테이너 컴포넌트
- **InvitationGrid**: 초대장 그리드 컴포넌트
- **PaymentPageContainer**: 결제 페이지 컨테이너 컴포넌트
- **PaymentContentContainer**: 결제 내용 컨테이너 컴포넌트
- **PaymentMethodSection**: 결제 방법 섹션 컴포넌트
- **PaymentButtonContainer**: 결제 버튼 컨테이너 컴포넌트
- **ErrorStateContainer**: 에러 상태 컨테이너 컴포넌트
- **HeaderContainer**: 헤더 컨테이너 컴포넌트

### Specific Components (`/specific`)
특정 페이지나 기능에 특화된 컴포넌트들

#### 채팅 관련
- **ChatHeader**: 채팅 헤더 컴포넌트
- **ChatContent**: 채팅 컨텐츠 컴포넌트
- **ChatInput**: 채팅 입력 컴포넌트 (이모지, 파일 첨부 기능 포함)
- **ChatMessages**: 메시지 목록 컴포넌트
- **EmptyChannelState**: 빈 채널 상태 컴포넌트

#### 분석 관련
- **AnalysisChart**: 분석 차트 컴포넌트 (막대, 파이, 레이더 차트 지원)
- **CoupleProfile**: 커플 프로필 컴포넌트
- **MbtiMatch**: MBTI 매칭 컴포넌트
- **KeywordsSection**: 키워드 섹션 컴포넌트
- **AnalysisSection**: 분석 결과 섹션 컴포넌트
- **PersonasSection**: 페르소나 섹션 컴포넌트

#### 결제 관련
- **PaymentMethodSelector**: 결제 방법 선택 컴포넌트
- **ProductGrid**: 상품 그리드 컴포넌트

#### 캘린더 관련
- **EventForm**: 이벤트 추가/편집 폼 컴포넌트
- **CalendarHeader**: 캘린더 헤더 컴포넌트
- **CalendarGrid**: 캘린더 그리드 컴포넌트
- **EventList**: 이벤트 목록 컴포넌트

#### 홈 관련
- **HomeContent**: 홈 컨텐츠 컴포넌트
- **QuickActionsCard**: 빠른 액션 카드 컴포넌트
- **SystemStatusCard**: 시스템 상태 카드 컴포넌트
- **ChannelInfoCard**: 채널 정보 카드 컴포넌트

### Layout Components (`/layout`)
레이아웃 관련 컴포넌트들

- **Sidebar**: 사이드바 네비게이션 컴포넌트
- **MainLayout**: 메인 레이아웃 컴포넌트
- **PageHeader**: 페이지 헤더 컴포넌트
- **PageContainer**: 페이지 컨테이너 컴포넌트
- **PageWrapper**: 페이지 래퍼 컴포넌트

## 새로 추가된 컴포넌트들

### 1. FormField
폼 필드를 렌더링하는 컴포넌트 (Input, Select 지원)

```tsx
import { FormField } from '../common';

<FormField
  name="email"
  type="email"
  label="이메일"
  placeholder="이메일을 입력하세요"
  value={formData.email}
  error={errors.email}
  onChange={handleChange}
  required
/>
```

**Props:**
- `name`: 필드 이름
- `type`: 'text' | 'email' | 'password' | 'select'
- `label`: 라벨 텍스트
- `placeholder`: 플레이스홀더 텍스트
- `value`: 필드 값
- `error`: 에러 메시지
- `onChange`: 변경 핸들러
- `required`: 필수 여부
- `options`: Select 타입일 때 옵션 배열

### 2. MessageContent
메시지 타입별 내용을 렌더링하는 컴포넌트

```tsx
import { MessageContent } from '../common';

<MessageContent
  content="안녕하세요!"
  type="text"
/>
```

**Props:**
- `content`: 메시지 내용
- `type`: 'text' | 'image' | 'file' | 'system'
- `className`: 추가 CSS 클래스

### 3. MessageTimestamp
메시지 타임스탬프를 렌더링하는 컴포넌트

```tsx
import { MessageTimestamp } from '../common';

<MessageTimestamp
  timestamp={new Date()}
  isOwnMessage={true}
/>
```

**Props:**
- `timestamp`: 날짜 객체
- `isOwnMessage`: 자신의 메시지 여부
- `className`: 추가 CSS 클래스

### 4. ChannelHeader
채널 헤더 정보를 렌더링하는 컴포넌트

```tsx
import { ChannelHeader } from '../common';

<ChannelHeader
  name="커플 채널"
  unreadCount={5}
/>
```

**Props:**
- `name`: 채널 이름
- `unreadCount`: 읽지 않은 메시지 수
- `className`: 추가 CSS 클래스

### 5. IconButton
아이콘 버튼 컴포넌트

```tsx
import { IconButton } from '../common';

<IconButton
  icon={<svg>...</svg>}
  onClick={handleClick}
  variant="primary"
  size="md"
  title="버튼 설명"
/>
```

**Props:**
- `icon`: 아이콘 요소
- `onClick`: 클릭 핸들러
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: 비활성화 여부
- `loading`: 로딩 상태
- `title`: 툴팁 텍스트

### 6. TextArea
텍스트 영역 컴포넌트

```tsx
import { TextArea } from '../common';

<TextArea
  name="message"
  value={message}
  onChange={handleChange}
  placeholder="메시지를 입력하세요"
  rows={3}
  maxLength={1000}
/>
```

**Props:**
- `name`: 필드 이름
- `value`: 필드 값
- `onChange`: 변경 핸들러
- `placeholder`: 플레이스홀더
- `rows`: 행 수
- `maxLength`: 최대 길이
- `disabled`: 비활성화 여부
- `required`: 필수 여부

### 7. StatusBadge (개선됨)
상태를 시각적으로 표시하는 배지 컴포넌트

```tsx
import { StatusBadge } from '../common';

<StatusBadge 
  text="활성" 
  type="success"
  size="md" 
/>
```

**Props:**
- `text`: 표시할 텍스트
- `type`: 'success' | 'warning' | 'error' | 'info' | 'default'
- `size`: 'sm' | 'md' | 'lg'

### 8. UserAvatar
사용자 아바타를 표시하는 컴포넌트

```tsx
import { UserAvatar } from '../common';

<UserAvatar
  name="김철수"
  profileUrl="https://example.com/avatar.jpg"
  size="lg"
/>
```

**Props:**
- `name`: 사용자 이름
- `profileUrl`: 프로필 이미지 URL (선택사항)
- `size`: 'sm' | 'md' | 'lg' | 'xl'

### 9. CalendarDay
캘린더의 개별 날짜를 표시하는 컴포넌트

```tsx
import { CalendarDay } from '../common';

<CalendarDay
  day={new Date()}
  currentDate={new Date()}
  selectedDate={selectedDate}
  events={events}
  onDateClick={handleDateClick}
/>
```

**Props:**
- `day`: 표시할 날짜
- `currentDate`: 현재 월의 기준 날짜
- `selectedDate`: 선택된 날짜
- `events`: 해당 날짜의 이벤트 목록
- `onDateClick`: 날짜 클릭 핸들러

### 10. PriceDisplay
가격 정보를 표시하는 컴포넌트

```tsx
import { PriceDisplay } from '../common';

<PriceDisplay
  price="₩9,900"
  originalPrice="₩12,900"
  discount="23% 할인"
  size="lg"
/>
```

**Props:**
- `price`: 현재 가격
- `originalPrice`: 원래 가격 (선택사항)
- `discount`: 할인 정보 (선택사항)
- `size`: 'sm' | 'md' | 'lg'

### 11. KeywordTag
키워드 태그를 표시하는 컴포넌트

```tsx
import { KeywordTag } from '../common';

<KeywordTag
  keyword="신뢰"
  variant="primary"
  size="md"
  removable={true}
  onRemove={handleRemove}
/>
```

**Props:**
- `keyword`: 키워드 텍스트
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'error'
- `size`: 'sm' | 'md' | 'lg'
- `removable`: 삭제 가능 여부
- `onRemove`: 삭제 핸들러

### 12. MenuIcon
메뉴 아이콘을 표시하는 컴포넌트

```tsx
import { MenuIcon } from '../common';

<MenuIcon
  icon="👤"
  size="md"
/>
```

**Props:**
- `icon`: 아이콘 텍스트
- `size`: 'sm' | 'md' | 'lg'

### 13. SearchInput
검색 입력 필드를 표시하는 컴포넌트

```tsx
import { SearchInput } from '../common';

<SearchInput
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="검색..."
/>
```

**Props:**
- `value`: 입력 값
- `onChange`: 변경 핸들러
- `placeholder`: 플레이스홀더 텍스트

### 14. CategoryFilter
카테고리 필터를 표시하는 컴포넌트

```tsx
import { CategoryFilter } from '../common';

<CategoryFilter
  categories={categories}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
/>
```

**Props:**
- `categories`: 카테고리 목록
- `selectedCategory`: 선택된 카테고리 ID
- `onCategoryChange`: 카테고리 변경 핸들러

### 15. LogoAnimation
로고 애니메이션을 표시하는 컴포넌트

```tsx
import { LogoAnimation } from '../common';

<LogoAnimation
  appName="Saiondo"
  icon="💕"
  isActive={true}
/>
```

**Props:**
- `appName`: 앱 이름
- `icon`: 로고 아이콘
- `isActive`: 애니메이션 활성화 상태

### 16. LoadingDots
로딩 점들을 표시하는 컴포넌트

```tsx
import { LoadingDots } from '../common';

<LoadingDots />
```

### 17. SplashProgressBar
스플래시 진행률 바를 표시하는 컴포넌트

```tsx
import { SplashProgressBar } from '../common';

<SplashProgressBar
  progress={75}
  showPercentage={true}
/>
```

**Props:**
- `progress`: 진행률 (0-100)
- `showPercentage`: 퍼센트 표시 여부

### 18. CategoryIcon
카테고리 아이콘을 표시하는 컴포넌트

```tsx
import { CategoryIcon } from '../common';

<CategoryIcon
  icon="💕"
  color="bg-pink-100 text-pink-800"
  size="md"
/>
```

**Props:**
- `icon`: 아이콘 텍스트
- `color`: 색상 클래스
- `size`: 'sm' | 'md' | 'lg'

### 19. ExampleList
예시 목록을 표시하는 컴포넌트

```tsx
import { ExampleList } from '../common';

<ExampleList
  examples={['예시 1', '예시 2']}
  maxItems={2}
/>
```

**Props:**
- `examples`: 예시 목록
- `maxItems`: 최대 표시 개수

### 20. TipList
팁 목록을 표시하는 컴포넌트

```tsx
import { TipList } from '../common';

<TipList
  tips={['팁 1', '팁 2']}
  maxItems={2}
/>
```

**Props:**
- `tips`: 팁 목록
- `maxItems`: 최대 표시 개수

### 21. StepGuide
단계별 가이드를 표시하는 컴포넌트

```tsx
import { StepGuide } from '../common';

<StepGuide
  title="사용 방법"
  steps={[
    { number: 1, title: '단계 1', description: '설명', icon: '📋' }
  ]}
/>
```

**Props:**
- `title`: 가이드 제목
- `steps`: 단계 목록

### 22. ActionButtons
액션 버튼들을 표시하는 컴포넌트

```tsx
import { ActionButtons } from '../common';

<ActionButtons
  actions={[
    { label: '확인', onClick: handleConfirm, variant: 'primary' },
    { label: '취소', onClick: handleCancel, variant: 'secondary' }
  ]}
/>
```

**Props:**
- `actions`: 액션 버튼 목록

### 23. AuthHeader
인증 페이지 헤더를 표시하는 컴포넌트

```tsx
import { AuthHeader } from '../common';

<AuthHeader
  title="로그인"
  subtitle="또는"
  linkText="새 계정 만들기"
  linkTo="/register"
/>
```

**Props:**
- `title`: 헤더 제목
- `subtitle`: 부제목
- `linkText`: 링크 텍스트
- `linkTo`: 링크 경로

### 24. QuickLoginButton
빠른 로그인 버튼을 표시하는 컴포넌트

```tsx
import { QuickLoginButton } from '../common';

<QuickLoginButton
  email="user@example.com"
  label="사용자로 로그인"
  onClick={handleQuickLogin}
  loading={false}
/>
```

**Props:**
- `email`: 로그인할 이메일
- `label`: 버튼 라벨
- `onClick`: 클릭 핸들러
- `loading`: 로딩 상태

### 25. QuickActionButton
빠른 액션 버튼을 표시하는 컴포넌트

```tsx
import { QuickActionButton } from '../common';

<QuickActionButton
  label="채팅 시작"
  variant="primary"
  onClick={handleChat}
/>
```

**Props:**
- `label`: 버튼 라벨
- `variant`: 버튼 스타일
- `onClick`: 클릭 핸들러

### 26. SystemStatItem
시스템 통계 아이템을 표시하는 컴포넌트

```tsx
import { SystemStatItem } from '../common';

<SystemStatItem
  title="시스템 상태"
  value="정상"
  icon="🟢"
  description="모든 서비스가 정상적으로 작동 중입니다"
  variant="success"
/>
```

**Props:**
- `title`: 통계 제목
- `value`: 통계 값
- `icon`: 아이콘
- `description`: 설명
- `variant`: 스타일 변형

### 27. LoadingState
로딩 상태를 표시하는 컴포넌트

```tsx
import { LoadingState } from '../common';

<LoadingState
  message="데이터를 불러오는 중..."
  size="md"
/>
```

**Props:**
- `message`: 로딩 메시지
- `size`: 스피너 크기
- `className`: 추가 CSS 클래스

### 28. ChatContainer
채팅 컨테이너를 표시하는 컴포넌트

```tsx
import { ChatContainer } from '../common';

<ChatContainer>
  {/* 채팅 내용 */}
</ChatContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 29. ChatMessagesContainer
채팅 메시지 컨테이너를 표시하는 컴포넌트

```tsx
import { ChatMessagesContainer } from '../common';

<ChatMessagesContainer>
  {/* 메시지 목록 */}
</ChatMessagesContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 30. ChatInputContainer
채팅 입력 컨테이너를 표시하는 컴포넌트

```tsx
import { ChatInputContainer } from '../common';

<ChatInputContainer>
  {/* 입력 필드 */}
</ChatInputContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 31. ChannelStatItem
채널 통계 아이템을 표시하는 컴포넌트

```tsx
import { ChannelStatItem } from '../common';

<ChannelStatItem
  title="총 채널 수"
  value={5}
  icon="👥"
  description="참여 중인 모든 채널"
  variant="info"
/>
```

**Props:**
- `title`: 통계 제목
- `value`: 통계 값
- `icon`: 아이콘
- `description`: 설명
- `variant`: 스타일 변형

### 32. RefreshButton
새로고침 버튼을 표시하는 컴포넌트

```tsx
import { RefreshButton } from '../common';

<RefreshButton onClick={handleRefresh} />
```

**Props:**
- `onClick`: 클릭 핸들러
- `className`: 추가 CSS 클래스

### 33. EmptyInvitationsState
빈 초대장 상태를 표시하는 컴포넌트

```tsx
import { EmptyInvitationsState } from '../common';

<EmptyInvitationsState />
```

**Props:**
- `className`: 추가 CSS 클래스

### 34. SubscriptionFooter
구독 푸터를 표시하는 컴포넌트

```tsx
import { SubscriptionFooter } from '../common';

<SubscriptionFooter />
```

**Props:**
- `className`: 추가 CSS 클래스

### 35. AssistantPageContainer
어시스턴트 페이지 컨테이너를 표시하는 컴포넌트

```tsx
import { AssistantPageContainer } from '../common';

<AssistantPageContainer>
  {/* 어시스턴트 페이지 내용 */}
</AssistantPageContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 36. AssistantFiltersContainer
어시스턴트 필터 컨테이너를 표시하는 컴포넌트

```tsx
import { AssistantFiltersContainer } from '../common';

<AssistantFiltersContainer>
  {/* 필터 컴포넌트들 */}
</AssistantFiltersContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 37. AssistantContentContainer
어시스턴트 내용 컨테이너를 표시하는 컴포넌트

```tsx
import { AssistantContentContainer } from '../common';

<AssistantContentContainer>
  {/* 어시스턴트 목록 */}
</AssistantContentContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 38. LoginPageContainer
로그인 페이지 컨테이너를 표시하는 컴포넌트

```tsx
import { LoginPageContainer } from '../common';

<LoginPageContainer>
  {/* 로그인 폼 */}
</LoginPageContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 39. InvitationPageContainer
초대장 페이지 컨테이너를 표시하는 컴포넌트

```tsx
import { InvitationPageContainer } from '../common';

<InvitationPageContainer>
  {/* 초대장 목록 */}
</InvitationPageContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 40. InvitationGrid
초대장 그리드를 표시하는 컴포넌트

```tsx
import { InvitationGrid } from '../common';

<InvitationGrid>
  {/* 초대장 카드들 */}
</InvitationGrid>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 41. PaymentPageContainer
결제 페이지 컨테이너를 표시하는 컴포넌트

```tsx
import { PaymentPageContainer } from '../common';

<PaymentPageContainer>
  {/* 결제 페이지 내용 */}
</PaymentPageContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 42. PaymentContentContainer
결제 내용 컨테이너를 표시하는 컴포넌트

```tsx
import { PaymentContentContainer } from '../common';

<PaymentContentContainer>
  {/* 결제 상품 목록 */}
</PaymentContentContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 43. PaymentMethodSection
결제 방법 섹션을 표시하는 컴포넌트

```tsx
import { PaymentMethodSection } from '../common';

<PaymentMethodSection>
  {/* 결제 방법 선택 */}
</PaymentMethodSection>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 44. PaymentButtonContainer
결제 버튼 컨테이너를 표시하는 컴포넌트

```tsx
import { PaymentButtonContainer } from '../common';

<PaymentButtonContainer>
  {/* 결제 버튼 */}
</PaymentButtonContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 45. ErrorStateContainer
에러 상태 컨테이너를 표시하는 컴포넌트

```tsx
import { ErrorStateContainer } from '../common';

<ErrorStateContainer>
  {/* 에러 메시지 */}
</ErrorStateContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 46. HeaderContainer
헤더 컨테이너를 표시하는 컴포넌트

```tsx
import { HeaderContainer } from '../common';

<HeaderContainer>
  {/* 헤더 컴포넌트 */}
</HeaderContainer>
```

**Props:**
- `children`: 자식 컴포넌트
- `className`: 추가 CSS 클래스

### 2. InfoCard
정보를 카드 형태로 표시하는 컴포넌트

```tsx
import { InfoCard } from '../common';

<InfoCard
  title="시스템 상태"
  value="정상"
  icon="🟢"
  description="모든 서비스가 정상적으로 작동 중입니다"
  variant="success"
  trend={{ value: 5, isPositive: true }}
/>
```

**Props:**
- `title`: 카드 제목
- `value`: 표시할 값
- `icon`: 아이콘 (이모지)
- `description`: 설명 텍스트
- `variant`: 'default' | 'success' | 'warning' | 'error' | 'info'
- `trend`: 트렌드 정보 (선택사항)
- `onClick`: 클릭 핸들러 (선택사항)

### 3. MessageBubble
채팅 메시지를 표시하는 버블 컴포넌트

```tsx
import { MessageBubble } from '../specific';

<MessageBubble
  message={{
    id: '1',
    content: '안녕하세요!',
    type: 'text',
    senderId: 'user1',
    timestamp: '2024-01-01T12:00:00Z',
    senderName: '김철수',
    senderAvatar: '/avatar.jpg'
  }}
  currentUserId="user1"
  isLastMessage={true}
/>
```

**Props:**
- `message`: 메시지 객체
- `currentUserId`: 현재 사용자 ID
- `isLastMessage`: 마지막 메시지 여부
- `className`: 추가 CSS 클래스

### 4. AnalysisChart
분석 결과를 차트로 표시하는 컴포넌트

```tsx
import { AnalysisChart } from '../specific';

<AnalysisChart
  title="관계 호환성 분석"
  data={[
    { label: '소통', value: 85, color: '#3B82F6' },
    { label: '신뢰', value: 90, color: '#10B981' }
  ]}
  type="bar"
  maxValue={100}
/>
```

**Props:**
- `title`: 차트 제목
- `data`: 차트 데이터 배열
- `type`: 'bar' | 'pie' | 'line' | 'radar'
- `maxValue`: 최대값 (선택사항)
- `className`: 추가 CSS 클래스

### 5. PaymentMethodSelector
결제 방법을 선택하는 컴포넌트

```tsx
import { PaymentMethodSelector } from '../specific';

<PaymentMethodSelector
  methods={[
    {
      id: 'card',
      name: '신용카드',
      icon: '💳',
      description: 'Visa, MasterCard, American Express',
      isAvailable: true
    }
  ]}
  selectedMethod="card"
  onMethodSelect={(methodId) => console.log(methodId)}
/>
```

**Props:**
- `methods`: 결제 방법 배열
- `selectedMethod`: 선택된 결제 방법 ID
- `onMethodSelect`: 결제 방법 선택 핸들러
- `className`: 추가 CSS 클래스

### 6. EventForm
이벤트를 추가/편집하는 모달 폼 컴포넌트

```tsx
import { EventForm } from '../specific';

<EventForm
  event={existingEvent}
  selectedDate={new Date()}
  onSubmit={(event) => console.log(event)}
  onCancel={() => setIsOpen(false)}
  isOpen={true}
/>
```

**Props:**
- `event`: 편집할 이벤트 (새 이벤트인 경우 undefined)
- `selectedDate`: 선택된 날짜
- `onSubmit`: 폼 제출 핸들러
- `onCancel`: 취소 핸들러
- `isOpen`: 모달 열림 상태
- `className`: 추가 CSS 클래스

### 7. Sidebar
사이드바 네비게이션 컴포넌트

```tsx
import { Sidebar } from '../layout';

<Sidebar
  isOpen={true}
  onClose={() => setIsOpen(false)}
/>
```

**Props:**
- `isOpen`: 사이드바 열림 상태
- `onClose`: 닫기 핸들러
- `className`: 추가 CSS 클래스

### 8. AuthGuard
인증이 필요한 페이지를 보호하는 컴포넌트

```tsx
import { AuthGuard } from '../specific';

<AuthGuard requireAuth={true} redirectTo="/login">
  <ProtectedComponent />
</AuthGuard>
```

**Props:**
- `children`: 보호할 컴포넌트
- `redirectTo`: 리다이렉트할 경로
- `requireAuth`: 인증 필요 여부
- `fallback`: 로딩 중 표시할 컴포넌트

### 9. CategoryDetailCard
카테고리 상세 정보를 표시하는 카드 컴포넌트

```tsx
import { CategoryDetailCard } from '../specific';

<CategoryDetailCard
  category={categoryData}
  onClose={() => setSelectedCategory(null)}
/>
```

**Props:**
- `category`: 카테고리 데이터
- `onClose`: 닫기 핸들러
- `className`: 추가 CSS 클래스

### 10. UsageGuide
사용법을 단계별로 설명하는 가이드 컴포넌트

```tsx
import { UsageGuide } from '../specific';

<UsageGuide
  title="사용 방법"
  steps={[
    { number: 1, title: "첫 번째", description: "설명", icon: "📋" },
    { number: 2, title: "두 번째", description: "설명", icon: "🤖" }
  ]}
/>
```

**Props:**
- `title`: 가이드 제목
- `description`: 가이드 설명
- `steps`: 단계별 정보 배열
- `className`: 추가 CSS 클래스

### 11. SplashAnimation
스플래시 화면의 애니메이션을 담당하는 컴포넌트

```tsx
import { SplashAnimation } from '../specific';

<SplashAnimation
  appName="Saiondo"
  loadingMessage="Loading..."
  onAnimationComplete={() => console.log('Animation complete')}
/>
```

**Props:**
- `appName`: 앱 이름
- `loadingMessage`: 로딩 메시지
- `onAnimationComplete`: 애니메이션 완료 핸들러
- `duration`: 애니메이션 지속 시간
- `className`: 추가 CSS 클래스

### 12. ChannelStats
채널 통계를 표시하는 컴포넌트

```tsx
import { ChannelStats } from '../specific';

<ChannelStats
  stats={{
    totalChannels: 5,
    activeChannels: 3,
    totalMessages: 150,
    unreadMessages: 5,
    averageResponseTime: '2분',
    memberCount: 8
  }}
/>
```

**Props:**
- `stats`: 통계 데이터
- `className`: 추가 CSS 클래스

### 13. Modal
모달 컴포넌트

```tsx
import { Modal } from '../common';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="모달 제목"
  size="md"
>
  <p>모달 내용</p>
</Modal>
```

**Props:**
- `isOpen`: 모달 열림 상태
- `onClose`: 닫기 핸들러
- `title`: 모달 제목
- `children`: 모달 내용
- `size`: 모달 크기 ('sm' | 'md' | 'lg' | 'xl' | 'full')
- `showCloseButton`: 닫기 버튼 표시 여부
- `closeOnOverlayClick`: 오버레이 클릭 시 닫기 여부
- `className`: 추가 CSS 클래스

### 14. Tooltip
툴팁 컴포넌트

```tsx
import { Tooltip } from '../common';

<Tooltip content="도움말 텍스트" position="top">
  <button>버튼</button>
</Tooltip>
```

**Props:**
- `content`: 툴팁 내용
- `children`: 툴팁을 표시할 요소
- `position`: 툴팁 위치 ('top' | 'bottom' | 'left' | 'right')
- `delay`: 표시 지연 시간
- `className`: 추가 CSS 클래스

### 15. InvitationResponseCard
초대 응답을 처리하는 카드 컴포넌트

```tsx
import { InvitationResponseCard } from '../specific';

<InvitationResponseCard
  invitation={invitationData}
  onAccept={(invitationId) => handleAccept(invitationId)}
  onReject={(invitationId) => handleReject(invitationId)}
/>
```

**Props:**
- `invitation`: 초대 데이터
- `onAccept`: 수락 핸들러
- `onReject`: 거절 핸들러
- `className`: 추가 CSS 클래스

### 16. CategoryCodeDetailModal
카테고리 코드 상세 정보를 모달로 표시하는 컴포넌트

```tsx
import { CategoryCodeDetailModal } from '../specific';

<CategoryCodeDetailModal
  code={selectedCode}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>
```

**Props:**
- `code`: 카테고리 코드 데이터
- `isOpen`: 모달 열림 상태
- `onClose`: 닫기 핸들러

### 17. HomeDashboard
홈 대시보드를 구성하는 컴포넌트

```tsx
import { HomeDashboard } from '../specific';

<HomeDashboard
  stats={{
    totalChats: 12,
    activeChannels: 3,
    unreadMessages: 5,
    lastActivity: '2시간 전'
  }}
/>
```

**Props:**
- `stats`: 홈 통계 데이터
- `className`: 추가 CSS 클래스

### 18. Breadcrumb
브레드크럼 네비게이션 컴포넌트

```tsx
import { Breadcrumb } from '../common';

<Breadcrumb
  items={[
    { label: 'home', path: '/', icon: '🏠' },
    { label: 'profile', path: '/profile', icon: '👤' },
    { label: 'settings' }
  ]}
/>
```

**Props:**
- `items`: 브레드크럼 아이템 배열
- `className`: 추가 CSS 클래스

### 19. Tabs
탭 컴포넌트

```tsx
import { Tabs } from '../common';

<Tabs
  tabs={[
    { id: 'tab1', label: '첫 번째 탭', icon: '📋' },
    { id: 'tab2', label: '두 번째 탭', icon: '⚙️' }
  ]}
  activeTab="tab1"
  onTabChange={(tabId) => setActiveTab(tabId)}
  variant="pills"
/>
```

**Props:**
- `tabs`: 탭 배열
- `activeTab`: 활성 탭 ID
- `onTabChange`: 탭 변경 핸들러
- `variant`: 탭 스타일 ('default' | 'pills' | 'underline')
- `className`: 추가 CSS 클래스

## 사용 예시

### 홈 페이지에서 InfoCard 사용
```tsx
import { InfoCard } from '../common';

const HomePage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <InfoCard
        title="총 채널 수"
        value="5"
        icon="👥"
        description="참여 중인 채널"
        variant="info"
      />
      <InfoCard
        title="시스템 상태"
        value="정상"
        icon="🟢"
        description="모든 서비스 정상 작동"
        variant="success"
      />
    </div>
  );
};
```

### 분석 페이지에서 차트 사용
```tsx
import { AnalysisChart } from '../specific';

const AnalysisPage = () => {
  const compatibilityData = [
    { label: '소통', value: 85, color: '#3B82F6' },
    { label: '신뢰', value: 90, color: '#10B981' },
    { label: '성장', value: 75, color: '#F59E0B' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AnalysisChart
        title="관계 호환성 분석"
        data={compatibilityData}
        type="bar"
        maxValue={100}
      />
      <AnalysisChart
        title="MBTI 호환성"
        data={mbtiData}
        type="radar"
        maxValue={100}
      />
    </div>
  );
};
```

## 새로 추가된 컴포넌트들 (4차 리팩토링)

### 20. PageWrapper
페이지 전체를 감싸는 래퍼 컴포넌트

```tsx
import { PageWrapper } from '../layout';

<PageWrapper background="gradient">
  {/* 페이지 내용 */}
</PageWrapper>
```

**Props:**
- `background`: 'default' | 'gradient' | 'dark' | 'light' | 'blue' | 'purple'
- `className`: 추가 CSS 클래스

### 21. PageContainer
페이지 컨텐츠를 감싸는 컨테이너 컴포넌트

```tsx
import { PageContainer } from '../layout';

<PageContainer maxWidth="4xl" padding="md">
  {/* 컨텐츠 */}
</PageContainer>
```

**Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full'
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `className`: 추가 CSS 클래스

### 22. ErrorDisplay
에러 상태를 표시하는 컴포넌트

```tsx
import { ErrorDisplay } from '../common';

<ErrorDisplay
  icon="❌"
  title="오류 발생"
  message="문제가 발생했습니다."
  action={{
    label: "다시 시도",
    onClick: handleRetry
  }}
/>
```

**Props:**
- `icon`: 표시할 아이콘
- `title`: 에러 제목
- `message`: 에러 메시지
- `action`: 액션 버튼 설정 (선택사항)
- `className`: 추가 CSS 클래스

### 23. SectionHeader
섹션 헤더를 표시하는 컴포넌트

```tsx
import { SectionHeader } from '../common';

<SectionHeader
  title="섹션 제목"
  subtitle="부제목"
  description="설명"
  centered={true}
/>
```

**Props:**
- `title`: 섹션 제목
- `subtitle`: 부제목 (선택사항)
- `description`: 설명 (선택사항)
- `action`: 액션 요소 (선택사항)
- `centered`: 중앙 정렬 여부
- `className`: 추가 CSS 클래스

### 24. ActionButton
액션 버튼 컴포넌트

```tsx
import { ActionButton } from '../common';

<ActionButton
  onClick={handleClick}
  variant="primary"
  size="md"
  loading={false}
  disabled={false}
  fullWidth={false}
>
  버튼 텍스트
</ActionButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: 로딩 상태
- `disabled`: 비활성화 상태
- `fullWidth`: 전체 너비 여부
- `className`: 추가 CSS 클래스

### 25. ContentCard
콘텐츠를 감싸는 카드 컴포넌트

```tsx
import { ContentCard } from '../common';

<ContentCard
  variant="elevated"
  padding="lg"
  className="custom-class"
>
  콘텐츠
</ContentCard>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'filled'
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `className`: 추가 CSS 클래스

### 26. Divider
구분선 컴포넌트

```tsx
import { Divider } from '../common';

<Divider
  orientation="horizontal"
  variant="solid"
  color="default"
  spacing="md"
/>
```

**Props:**
- `orientation`: 'horizontal' | 'vertical'
- `variant`: 'solid' | 'dashed' | 'dotted'
- `color`: 'default' | 'light' | 'dark'
- `spacing`: 'none' | 'sm' | 'md' | 'lg'
- `className`: 추가 CSS 클래스

### 27. Grid
반응형 그리드 레이아웃 컴포넌트

```tsx
import { Grid } from '../common';

<Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="md">
  <div>아이템 1</div>
  <div>아이템 2</div>
  <div>아이템 3</div>
</Grid>
```

**Props:**
- `cols`: 반응형 컬럼 설정 (sm, md, lg, xl)
- `gap`: 간격 크기 ('none' | 'sm' | 'md' | 'lg' | 'xl')
- `className`: 추가 CSS 클래스

### 28. Flex
Flexbox 레이아웃 컴포넌트

```tsx
import { Flex } from '../common';

<Flex direction="row" align="center" justify="between" gap="md">
  <div>왼쪽</div>
  <div>오른쪽</div>
</Flex>
```

**Props:**
- `direction`: 방향 ('row' | 'col' | 'row-reverse' | 'col-reverse')
- `align`: 정렬 ('start' | 'end' | 'center' | 'baseline' | 'stretch')
- `justify`: 배치 ('start' | 'end' | 'center' | 'between' | 'around' | 'evenly')
- `wrap`: 줄바꿈 ('nowrap' | 'wrap' | 'wrap-reverse')
- `gap`: 간격 ('none' | 'sm' | 'md' | 'lg' | 'xl')
- `className`: 추가 CSS 클래스

### 29. Stack
수직 스택 레이아웃 컴포넌트

```tsx
import { Stack } from '../common';

<Stack spacing="md" align="center">
  <div>아이템 1</div>
  <div>아이템 2</div>
  <div>아이템 3</div>
</Stack>
```

**Props:**
- `spacing`: 간격 ('none' | 'sm' | 'md' | 'lg' | 'xl')
- `align`: 정렬 ('start' | 'center' | 'end' | 'stretch')
- `className`: 추가 CSS 클래스

### 30. Icon
아이콘 컴포넌트

```tsx
import { Icon } from '../common';

<Icon
  icon="💬"
  size="lg"
  color="primary"
  background="primary"
  rounded={true}
/>
```

**Props:**
- `icon`: 아이콘 텍스트
- `size`: 크기 ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')
- `color`: 색상 ('primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'white' | 'gray')
- `background`: 배경 ('none' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray')
- `rounded`: 둥근 모양 여부
- `className`: 추가 CSS 클래스

### 31. Badge
범용 배지 컴포넌트

```tsx
import { Badge } from '../common';

<Badge variant="success" size="md" rounded={true}>
  성공
</Badge>
```

**Props:**
- `variant`: 스타일 ('primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline')
- `size`: 크기 ('sm' | 'md' | 'lg')
- `rounded`: 둥근 모양 여부
- `className`: 추가 CSS 클래스

### 32. InteractiveCard
인터랙티브 카드 컴포넌트

```tsx
import { InteractiveCard } from '../common';

<InteractiveCard
  onClick={handleClick}
  variant="elevated"
  hover="both"
  padding="lg"
>
  카드 내용
</InteractiveCard>
```

**Props:**
- `onClick`: 클릭 핸들러 (선택사항)
- `variant`: 스타일 ('default' | 'elevated' | 'outlined' | 'filled')
- `hover`: 호버 효과 ('none' | 'shadow' | 'scale' | 'both')
- `padding`: 패딩 크기 ('none' | 'sm' | 'md' | 'lg' | 'xl')
- `className`: 추가 CSS 클래스

### 33. CenteredContainer
중앙 정렬 컨테이너 컴포넌트

```tsx
import { CenteredContainer } from '../common';

<CenteredContainer maxWidth="2xl" padding="lg">
  컨텐츠
</CenteredContainer>
```

**Props:**
- `maxWidth`: 최대 너비 ('sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full')
- `padding`: 패딩 크기 ('none' | 'sm' | 'md' | 'lg' | 'xl')
- `className`: 추가 CSS 클래스

### 34. Text
텍스트 컴포넌트

```tsx
import { Text } from '../common';

<Text
  variant="h2"
  size="xl"
  weight="bold"
  color="primary"
  align="center"
  truncate={false}
>
  텍스트 내용
</Text>
```

**Props:**
- `variant`: 텍스트 타입 ('h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline')
- `size`: 크기 ('xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl')
- `weight`: 굵기 ('light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold')
- `color`: 색상 ('primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'white' | 'black')
- `align`: 정렬 ('left' | 'center' | 'right' | 'justify')
- `truncate`: 말줄임표 여부
- `className`: 추가 CSS 클래스

### 35. Avatar
아바타 컴포넌트

```tsx
import { Avatar } from '../common';

<Avatar
  src="/path/to/image.jpg"
  alt="사용자 이름"
  fallback="사용자"
  size="lg"
  shape="circle"
  variant="gradient"
  color="primary"
/>
```

**Props:**
- `src`: 이미지 경로 (선택사항)
- `alt`: 이미지 대체 텍스트
- `fallback`: 폴백 텍스트
- `size`: 크기 ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')
- `shape`: 모양 ('circle' | 'square')
- `variant`: 스타일 ('default' | 'gradient' | 'solid')
- `color`: 색상 ('primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info')
- `className`: 추가 CSS 클래스

### 36. Heading
제목 컴포넌트

```tsx
import { Heading } from '../common';

<Heading
  level={2}
  size="xl"
  weight="bold"
  color="primary"
  align="center"
>
  제목 텍스트
</Heading>
```

**Props:**
- `level`: 제목 레벨 (1 | 2 | 3 | 4 | 5 | 6)
- `size`: 크기 ('xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl')
- `weight`: 굵기 ('light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold')
- `color`: 색상 ('primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'white' | 'black')
- `align`: 정렬 ('left' | 'center' | 'right' | 'justify')
- `className`: 추가 CSS 클래스

### 37. Caption
캡션 텍스트 컴포넌트

```tsx
import { Caption } from '../common';

<Caption
  size="sm"
  color="muted"
  align="center"
>
  캡션 텍스트
</Caption>
```

**Props:**
- `size`: 크기 ('xs' | 'sm')
- `color`: 색상 ('primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'muted')
- `align`: 정렬 ('left' | 'center' | 'right' | 'justify')
- `className`: 추가 CSS 클래스

### 38. StatusIndicator
상태 표시 컴포넌트

```tsx
import { StatusIndicator } from '../common';

<StatusIndicator
  status="online"
  size="md"
  showLabel={true}
/>
```

**Props:**
- `status`: 상태 ('online' | 'offline' | 'away' | 'busy' | 'active' | 'inactive')
- `size`: 크기 ('xs' | 'sm' | 'md' | 'lg')
- `showLabel`: 라벨 표시 여부
- `className`: 추가 CSS 클래스

## 컴포넌트 개발 가이드라인

1. **일관성**: 모든 컴포넌트는 동일한 디자인 시스템을 따릅니다
2. **재사용성**: 가능한 한 재사용 가능하도록 설계합니다
3. **접근성**: 적절한 ARIA 속성과 키보드 네비게이션을 지원합니다
4. **반응형**: 모바일부터 데스크톱까지 모든 화면 크기를 지원합니다
5. **다크모드**: 다크모드를 지원합니다
6. **타입 안전성**: TypeScript를 사용하여 타입 안전성을 보장합니다

## 스타일 가이드

- **색상**: Tailwind CSS의 기본 색상 팔레트 사용
- **간격**: 4px 단위로 일관된 간격 사용
- **타이포그래피**: 시스템 폰트 스택 사용
- **그림자**: 일관된 그림자 시스템 사용
- **애니메이션**: 부드러운 전환 효과 사용 