# Specific Components

이 디렉토리에는 페이지별로 특화된 컴포넌트들이 포함되어 있습니다. 각 컴포넌트는 특정 페이지의 기능을 담당하며, 재사용 가능하도록 설계되었습니다.

## Auth Page Components

### RegisterForm
회원가입 폼을 담당하는 컴포넌트입니다.

**Props:**
- `onSubmit: (data: RegisterFormData) => Promise<void>` - 폼 제출 콜백
- `loading: boolean` - 로딩 상태
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { RegisterForm } from '../../components/specific';

<RegisterForm
  onSubmit={handleSubmit}
  loading={loading}
/>
```

### LoginForm
로그인 폼을 담당하는 컴포넌트입니다.

**Props:**
- `onSubmit: (data: LoginFormData) => Promise<void>` - 폼 제출 콜백
- `loading: boolean` - 로딩 상태
- `registerRoute: string` - 회원가입 라우트
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { LoginForm } from '../../components/specific';

<LoginForm
  onSubmit={handleSubmit}
  loading={loading}
  registerRoute="/register"
/>
```

## Category Code Page Components

### CategoryCodeCard
카테고리 코드 카드를 표시하는 컴포넌트입니다.

**Props:**
- `code: CategoryCode` - 카테고리 코드 객체
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CategoryCodeCard } from '../../components/specific';

<CategoryCodeCard code={codeData} />
```

### CategoryCodeGrid
카테고리 코드 그리드를 표시하는 컴포넌트입니다.

**Props:**
- `codes: CategoryCode[]` - 카테고리 코드 배열
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CategoryCodeGrid } from '../../components/specific';

<CategoryCodeGrid codes={codesData} />
```

### CategoryCodeSearch
카테고리 코드 검색을 담당하는 컴포넌트입니다.

**Props:**
- `searchTerm: string` - 검색어
- `onSearchChange: (term: string) => void` - 검색어 변경 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CategoryCodeSearch } from '../../components/specific';

<CategoryCodeSearch
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
/>
```

### CategoryCodeErrorState
카테고리 코드 에러 상태를 담당하는 컴포넌트입니다.

**Props:**
- `error: string` - 에러 메시지
- `onRetry: () => void` - 재시도 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CategoryCodeErrorState } from '../../components/specific';

<CategoryCodeErrorState
  error={error}
  onRetry={handleRetry}
/>
```

### CategoryCodeHeader
카테고리 코드 헤더를 담당하는 컴포넌트입니다.

**Props:**
- `codesCount: number` - 코드 개수
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CategoryCodeHeader } from '../../components/specific';

<CategoryCodeHeader codesCount={10} />
```

### CategoryCodeSearchBar
카테고리 코드 검색바를 담당하는 컴포넌트입니다.

**Props:**
- `searchTerm: string` - 검색어
- `onSearchChange: (term: string) => void` - 검색어 변경 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CategoryCodeSearchBar } from '../../components/specific';

<CategoryCodeSearchBar
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
/>
```

### CategoryCodeList
카테고리 코드 목록을 담당하는 컴포넌트입니다.

**Props:**
- `codes: CategoryCode[]` - 코드 배열
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CategoryCodeList } from '../../components/specific';

<CategoryCodeList codes={codes} />
```

## Chat Page Components

### ChatContainer
채팅 컨테이너를 담당하는 컴포넌트입니다.

**Props:**
- `children: React.ReactNode` - 자식 컴포넌트
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { ChatContainer } from '../../components/specific';

<ChatContainer>
  <ChatHeader />
  <ChatContent />
</ChatContainer>
```

### ChatContent
채팅 내용 영역을 담당하는 컴포넌트입니다.

**Props:**
- `messages: Message[]` - 메시지 배열
- `loading: boolean` - 로딩 상태
- `currentUserId: string` - 현재 사용자 ID
- `onSendMessage: () => void` - 메시지 전송 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { ChatContent } from '../../components/specific';

<ChatContent
  messages={messages}
  loading={loading}
  currentUserId={userId}
  onSendMessage={handleSendMessage}
/>
```

## Channel Page Components

### ChannelList
채널 목록을 표시하는 컴포넌트입니다.

**Props:**
- `channels: Channel[]` - 채널 배열
- `onChannelClick: (channelId: string) => void` - 채널 클릭 콜백
- `onCreateChannel: () => void` - 채널 생성 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { ChannelList } from '../../components/specific';

<ChannelList
  channels={channels}
  onChannelClick={handleChannelClick}
  onCreateChannel={handleCreateChannel}
/>
```

## Home Page Components

### HomeContent
홈 콘텐츠를 담당하는 컴포넌트입니다.

**Props:**
- `loading: boolean` - 로딩 상태
- `channels: ChannelInfo` - 채널 정보
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { HomeContent } from '../../components/specific';

<HomeContent
  loading={loading}
  channels={channels}
/>
```

### AiAdviceCard
AI 조언 카드를 담당하는 컴포넌트입니다.

**Props:**
- `onStartChat: () => void` - 채팅 시작 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { AiAdviceCard } from '../../components/specific';

<AiAdviceCard onStartChat={handleStartChat} />
```

### QuickActionButton
빠른 액션 버튼을 담당하는 컴포넌트입니다.

**Props:**
- `icon: string` - 아이콘
- `label: string` - 라벨
- `onClick: () => void` - 클릭 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { QuickActionButton } from '../../components/specific';

<QuickActionButton
  icon="📊"
  label="분석"
  onClick={handleAnalysis}
/>
```

### QuickActionsGrid
빠른 액션 그리드를 담당하는 컴포넌트입니다.

**Props:**
- `actions: QuickAction[]` - 액션 배열
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { QuickActionsGrid } from '../../components/specific';

<QuickActionsGrid actions={quickActions} />
```

### WelcomeMessage
환영 메시지를 담당하는 컴포넌트입니다.

**Props:**
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { WelcomeMessage } from '../../components/specific';

<WelcomeMessage />
```

## Splash Page Components

### SplashContainer
스플래시 컨테이너를 담당하는 컴포넌트입니다.

**Props:**
- `appName: string` - 앱 이름
- `loadingMessage: string` - 로딩 메시지
- `onAnimationComplete?: () => void` - 애니메이션 완료 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { SplashContainer } from '../../components/specific';

<SplashContainer
  appName="Saiondo"
  loadingMessage="Loading..."
  onAnimationComplete={() => {}}
/>
```

## Common Components

### PageHeader
페이지 헤더를 담당하는 공통 컴포넌트입니다.

**Props:**
- `title: string` - 제목
- `subtitle?: string` - 부제목
- `showBackButton?: boolean` - 뒤로가기 버튼 표시 여부
- `backRoute?: string` - 뒤로가기 라우트
- `onBackClick?: () => void` - 뒤로가기 클릭 콜백
- `rightContent?: React.ReactNode` - 우측 콘텐츠
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { PageHeader } from '../../components/specific';

<PageHeader
  title="페이지 제목"
  subtitle="부제목"
  showBackButton
  backRoute="/home"
/>
```

### PageContainer
페이지 컨테이너를 담당하는 공통 컴포넌트입니다.

**Props:**
- `children: React.ReactNode` - 자식 컴포넌트
- `maxWidth?: string` - 최대 너비
- `padding?: string` - 패딩
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { PageContainer } from '../../components/specific';

<PageContainer maxWidth="max-w-4xl" padding="px-4 py-6">
  <div>콘텐츠</div>
</PageContainer>
```

### PageLayout
페이지 레이아웃을 담당하는 공통 컴포넌트입니다.

**Props:**
- `children: React.ReactNode` - 자식 컴포넌트
- `background?: string` - 배경 스타일
- `maxWidth?: string` - 최대 너비
- `padding?: string` - 패딩
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { PageLayout } from '../../components/specific';

<PageLayout background="bg-gray-50" maxWidth="max-w-4xl">
  <div>콘텐츠</div>
</PageLayout>
```

### AuthRequired
인증이 필요한 페이지에서 사용할 공통 컴포넌트입니다.

**Props:**
- `loginRoute: string` - 로그인 라우트
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { AuthRequired } from '../../components/specific';

<AuthRequired loginRoute="/login" />
```

### AuthLayout
인증 페이지 레이아웃을 담당하는 공통 컴포넌트입니다.

**Props:**
- `children: React.ReactNode` - 자식 컴포넌트
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { AuthLayout } from '../../components/specific';

<AuthLayout>
  <LoginForm />
</AuthLayout>
```

### CenteredContainer
중앙 정렬 컨테이너를 담당하는 공통 컴포넌트입니다.

**Props:**
- `children: React.ReactNode` - 자식 컴포넌트
- `maxWidth?: string` - 최대 너비
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CenteredContainer } from '../../components/specific';

<CenteredContainer maxWidth="max-w-7xl">
  <div>콘텐츠</div>
</CenteredContainer>
```

### PageBackground
페이지 배경을 담당하는 공통 컴포넌트입니다.

**Props:**
- `children: React.ReactNode` - 자식 컴포넌트
- `background?: string` - 배경 스타일
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { PageBackground } from '../../components/specific';

<PageBackground background="bg-gray-50">
  <div>콘텐츠</div>
</PageBackground>
```

### QuickActionsCard
빠른 액션 버튼들을 포함하는 카드 컴포넌트입니다.

**Props:**
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { QuickActionsCard } from '../../components/specific';

<QuickActionsCard />
```

### SystemStatusCard
시스템 상태 정보를 표시하는 카드 컴포넌트입니다.

**Props:**
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { SystemStatusCard } from '../../components/specific';

<SystemStatusCard />
```

### ChannelInfoCard
채널 정보를 표시하는 카드 컴포넌트입니다.

**Props:**
- `ownedChannelsCount?: number` - 소유한 채널 수
- `memberChannelsCount?: number` - 멤버인 채널 수
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { ChannelInfoCard } from '../../components/specific';

<ChannelInfoCard 
  ownedChannelsCount={5}
  memberChannelsCount={3}
/>
```

## Chat Page Components

### ChatHeader
채팅 페이지의 헤더를 담당하는 컴포넌트입니다.

**Props:**
- `channelId: string` - 채널 ID
- `backRoute: string` - 뒤로가기 라우트
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { ChatHeader } from '../../components/specific';

<ChatHeader 
  channelId="channel-123"
  backRoute="/home"
/>
```

### ChatMessages
채팅 메시지 목록을 표시하는 컴포넌트입니다.

**Props:**
- `messages: Message[]` - 메시지 배열
- `loading: boolean` - 로딩 상태
- `currentUserId?: string` - 현재 사용자 ID
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { ChatMessages } from '../../components/specific';

<ChatMessages
  messages={messages}
  loading={loading}
  currentUserId={userId}
/>
```

### ChatInput
채팅 메시지 입력 영역을 담당하는 컴포넌트입니다.

**Props:**
- `onSendMessage: (message: string) => void` - 메시지 전송 콜백
- `loading?: boolean` - 로딩 상태
- `disabled?: boolean` - 비활성화 상태
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { ChatInput } from '../../components/specific';

<ChatInput
  onSendMessage={handleSendMessage}
  loading={loading}
/>
```

## Channel Page Components

### ChannelHeader
채널 페이지의 헤더를 담당하는 컴포넌트입니다.

**Props:**
- `onCreateChannel: () => void` - 채널 생성 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { ChannelHeader } from '../../components/specific';

<ChannelHeader onCreateChannel={handleCreateChannel} />
```

### EmptyChannelState
빈 채널 상태를 표시하는 컴포넌트입니다.

**Props:**
- `onCreateChannel: () => void` - 채널 생성 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { EmptyChannelState } from '../../components/specific';

<EmptyChannelState onCreateChannel={handleCreateChannel} />
```

## Auth Page Components

### QuickLoginButtons
빠른 로그인 버튼들을 담당하는 컴포넌트입니다.

**Props:**
- `onQuickLogin: (email: string) => void` - 빠른 로그인 콜백
- `loading?: boolean` - 로딩 상태
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { QuickLoginButtons } from '../../components/specific';

<QuickLoginButtons 
  onQuickLogin={handleQuickLogin}
  loading={loading}
/>
```

## 컴포넌트화의 장점

1. **재사용성**: 각 컴포넌트는 독립적으로 사용할 수 있습니다.
2. **유지보수성**: 특정 기능을 담당하는 컴포넌트로 분리되어 유지보수가 용이합니다.
3. **테스트 용이성**: 각 컴포넌트를 독립적으로 테스트할 수 있습니다.
4. **가독성**: 페이지 코드가 더 간결하고 읽기 쉬워집니다.
5. **확장성**: 새로운 기능을 추가할 때 기존 컴포넌트를 확장하거나 새로운 컴포넌트를 추가할 수 있습니다.

## MyPage Components

### MenuCard
메뉴 아이템을 표시하는 카드 컴포넌트입니다.

**Props:**
- `item: MenuItem` - 메뉴 아이템 정보
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { MenuCard } from '../../components/specific';

<MenuCard item={menuItem} />
```

### MenuGrid
메뉴 아이템들을 그리드 형태로 표시하는 컴포넌트입니다.

**Props:**
- `items: MenuItem[]` - 메뉴 아이템 배열
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { MenuGrid } from '../../components/specific';

<MenuGrid items={menuItems} />
```

## Analysis Page Components

### AnalysisHeader
분석 페이지의 헤더를 담당하는 컴포넌트입니다.

**Props:**
- `onCreateAnalysis: () => void` - 새 분석 생성 콜백
- `isCreating: boolean` - 분석 생성 중 상태
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { AnalysisHeader } from '../../components/specific';

<AnalysisHeader 
  onCreateAnalysis={handleCreateAnalysis}
  isCreating={isCreating}
/>
```

### CoupleProfile
커플 프로필을 표시하는 컴포넌트입니다.

**Props:**
- `user1: User` - 첫 번째 사용자 정보
- `user2: User` - 두 번째 사용자 정보
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CoupleProfile } from '../../components/specific';

<CoupleProfile user1={user1} user2={user2} />
```

### MbtiMatch
MBTI 매치 정보를 표시하는 컴포넌트입니다.

**Props:**
- `user1: User` - 첫 번째 사용자 정보
- `user2: User` - 두 번째 사용자 정보
- `matchPercent?: string` - 매치 퍼센트
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { MbtiMatch } from '../../components/specific';

<MbtiMatch 
  user1={user1} 
  user2={user2} 
  matchPercent="85"
/>
```

### KeywordsSection
키워드 섹션을 표시하는 컴포넌트입니다.

**Props:**
- `keywords: string[]` - 키워드 배열
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { KeywordsSection } from '../../components/specific';

<KeywordsSection keywords={keywords} />
```

### AnalysisSection
분석 섹션(요약, 조언 등)을 표시하는 컴포넌트입니다.

**Props:**
- `title: string` - 섹션 제목
- `content: string` - 섹션 내용
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { AnalysisSection } from '../../components/specific';

<AnalysisSection 
  title="분석 요약"
  content="분석 내용..."
/>
```

### PersonasSection
성향 분석 섹션을 표시하는 컴포넌트입니다.

**Props:**
- `persona1?: string` - 첫 번째 사용자 성향
- `persona2?: string` - 두 번째 사용자 성향
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { PersonasSection } from '../../components/specific';

<PersonasSection 
  persona1="열정적이고 창의적인 성격"
  persona2="안정적이고 체계적인 성격"
/>
```

## Payment Page Components

### ProductGrid
구독 상품들을 그리드 형태로 표시하는 컴포넌트입니다.

**Props:**
- `products: SubscriptionProduct[]` - 상품 배열
- `onPurchase: (product: SubscriptionProduct) => void` - 구매 콜백
- `purchasePending: boolean` - 구매 처리 중 상태
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { ProductGrid } from '../../components/specific';

<ProductGrid
  products={products}
  onPurchase={handlePurchase}
  purchasePending={purchasePending}
/>
```

## Invite Page Components

### InviteForm
파트너 초대 폼을 담당하는 컴포넌트입니다.

**Props:**
- `onInvite: (email: string) => void` - 초대 콜백
- `isLoading: boolean` - 로딩 상태
- `error: string | null` - 에러 메시지
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { InviteForm } from '../../components/specific';

<InviteForm
  onInvite={handleInvite}
  isLoading={isLoading}
  error={error}
/>
```

## Calendar Page Components

### CalendarHeader
캘린더 페이지의 헤더를 담당하는 컴포넌트입니다.

**Props:**
- `currentDate: Date` - 현재 선택된 날짜
- `onPreviousMonth: () => void` - 이전 월 이동 콜백
- `onNextMonth: () => void` - 다음 월 이동 콜백
- `onToday: () => void` - 오늘 날짜로 이동 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CalendarHeader } from '../../components/specific';

<CalendarHeader
  currentDate={currentDate}
  onPreviousMonth={goToPreviousMonth}
  onNextMonth={goToNextMonth}
  onToday={goToToday}
/>
```

### CalendarGrid
캘린더 그리드를 담당하는 컴포넌트입니다.

**Props:**
- `daysInMonth: Date[]` - 월의 모든 날짜 배열
- `currentDate: Date` - 현재 선택된 날짜
- `selectedDate: Date | null` - 선택된 날짜
- `events: Event[]` - 이벤트 배열
- `onDateClick: (date: Date) => void` - 날짜 클릭 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CalendarGrid } from '../../components/specific';

<CalendarGrid
  daysInMonth={daysInMonth}
  currentDate={currentDate}
  selectedDate={selectedDate}
  events={events}
  onDateClick={handleDateClick}
/>
```

### EventList
선택된 날짜의 이벤트 목록을 표시하는 컴포넌트입니다.

**Props:**
- `selectedDate: Date` - 선택된 날짜
- `events: Event[]` - 이벤트 배열
- `onAddEvent: () => void` - 이벤트 추가 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { EventList } from '../../components/specific';

<EventList
  selectedDate={selectedDate}
  events={events}
  onAddEvent={handleAddEvent}
/>
```

## Assistant Page Components

### AssistantFilters
어시스턴트 필터(검색, 카테고리)를 담당하는 컴포넌트입니다.

**Props:**
- `searchTerm: string` - 검색어
- `selectedCategory: string` - 선택된 카테고리
- `categories: Category[]` - 카테고리 배열
- `onSearchChange: (term: string) => void` - 검색어 변경 콜백
- `onCategoryChange: (category: string) => void` - 카테고리 변경 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { AssistantFilters } from '../../components/specific';

<AssistantFilters
  searchTerm={searchTerm}
  selectedCategory={selectedCategory}
  categories={categories}
  onSearchChange={setSearchTerm}
  onCategoryChange={setSelectedCategory}
/>
```

### AssistantGrid
어시스턴트 그리드를 담당하는 컴포넌트입니다.

**Props:**
- `assistants: Assistant[]` - 어시스턴트 배열
- `onAssistantSelect: (assistant: Assistant) => void` - 어시스턴트 선택 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { AssistantGrid } from '../../components/specific';

<AssistantGrid
  assistants={assistants}
  onAssistantSelect={handleAssistantSelect}
/>
```

## Category Page Components

### CategoryCard
카테고리 카드를 담당하는 컴포넌트입니다.

**Props:**
- `category: Category` - 카테고리 정보
- `isSelected: boolean` - 선택 여부
- `onClick: (categoryId: string) => void` - 클릭 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CategoryCard } from '../../components/specific';

<CategoryCard
  category={category}
  isSelected={selectedCategory === category.id}
  onClick={handleCategorySelect}
/>
```

### CategoryGrid
카테고리 그리드를 담당하는 컴포넌트입니다.

**Props:**
- `categories: Category[]` - 카테고리 배열
- `selectedCategory: string | null` - 선택된 카테고리
- `onCategorySelect: (categoryId: string) => void` - 카테고리 선택 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { CategoryGrid } from '../../components/specific';

<CategoryGrid
  categories={categories}
  selectedCategory={selectedCategory}
  onCategorySelect={setSelectedCategory}
/>
```

## Invitation Page Components

### InvitationCard
초대장 카드를 담당하는 컴포넌트입니다.

**Props:**
- `invitation: ChannelInvitation` - 초대장 정보
- `onAccept: (invitationId: string) => void` - 수락 콜백
- `onReject: (invitationId: string) => void` - 거절 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { InvitationCard } from '../../components/specific';

<InvitationCard
  invitation={invitation}
  onAccept={handleAccept}
  onReject={handleReject}
/>
```

### InvitationList
초대장 목록을 담당하는 컴포넌트입니다.

**Props:**
- `invitations: ChannelInvitation[]` - 초대장 배열
- `onAccept: (invitationId: string) => void` - 수락 콜백
- `onReject: (invitationId: string) => void` - 거절 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { InvitationList } from '../../components/specific';

<InvitationList
  invitations={invitations}
  onAccept={handleAccept}
  onReject={handleReject}
/>
```

## Common Components

### LoadingState
로딩 상태를 표시하는 공통 컴포넌트입니다.

**Props:**
- `message?: string` - 로딩 메시지
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { LoadingState } from '../../components/specific';

<LoadingState message="데이터를 불러오는 중..." />
```

### ErrorState
에러 상태를 표시하는 공통 컴포넌트입니다.

**Props:**
- `title?: string` - 에러 제목
- `message?: string` - 에러 메시지
- `onRetry?: () => void` - 재시도 콜백
- `className?: string` - 추가 CSS 클래스

**사용법:**
```tsx
import { ErrorState } from '../../components/specific';

<ErrorState
  title="오류가 발생했습니다"
  message="데이터를 불러올 수 없습니다."
  onRetry={handleRetry}
/>
```

## 사용 가이드라인

1. **Props 설계**: 컴포넌트는 필요한 데이터만 props로 받도록 설계합니다.
2. **타입 안전성**: TypeScript 인터페이스를 사용하여 타입 안전성을 보장합니다.
3. **기본값 제공**: 선택적 props에는 적절한 기본값을 제공합니다.
4. **스타일링**: className prop을 통해 외부에서 스타일을 커스터마이징할 수 있도록 합니다.
5. **접근성**: 적절한 ARIA 속성과 키보드 네비게이션을 고려합니다. 