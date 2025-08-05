// Chart data
export const CHART_DATA = [
  { x: '1월', y: 65, label: '1월' },
  { x: '2월', y: 78, label: '2월' },
  { x: '3월', y: 90, label: '3월' },
  { x: '4월', y: 81, label: '4월' },
  { x: '5월', y: 95, label: '5월' },
  { x: '6월', y: 88, label: '6월' },
];

export const BAR_DATA = [
  { x: '채팅', y: 45, color: '#d21e1d' },
  { x: 'AI', y: 32, color: '#4D1F7C' },
  { x: '분석', y: 28, color: '#1CDEC9' },
  { x: '채널', y: 38, color: '#FF8383' },
];

// Stats data
export const STATS_DATA = [
  {
    title: '총 채팅',
    value: 1234,
    description: '이번 달 총 채팅 수',
    icon: 'chat',
    trend: { value: 12, isPositive: true },
  },
  {
    title: '활성 채널',
    value: 56,
    description: '현재 활성 채널 수',
    icon: 'channel',
    trend: { value: 8, isPositive: true },
  },
  {
    title: 'AI 상호작용',
    value: 89,
    description: 'AI와의 상호작용 수',
    icon: 'ai',
    trend: { value: 23, isPositive: true },
  },
  {
    title: '만족도',
    value: 4.8,
    description: '평균 만족도 점수',
    icon: 'star',
    trend: { value: 5, isPositive: true },
  },
];

// Quick actions data
export const QUICK_ACTIONS = [
  {
    title: '새 채팅 시작',
    description: '새로운 대화를 시작하세요',
    icon: 'plus',
    href: '/chat',
    color: 'bg-blue-500',
    badge: '3',
    gradient: true,
  },
  {
    title: '채널 생성',
    description: '새로운 채널을 만들어보세요',
    icon: 'channel',
    href: '/channels',
    color: 'bg-green-500',
    gradient: true,
  },
  {
    title: 'AI 어시스턴트 선택',
    description: '전문 AI 상담사를 선택하세요',
    icon: 'ai',
    href: '/assistant',
    color: 'bg-purple-500',
    badge: '5',
    gradient: true,
  },
  {
    title: '데이터 분석',
    description: '통계를 확인해보세요',
    icon: 'chart',
    href: '/analysis',
    color: 'bg-orange-500',
    gradient: true,
  },
  {
    title: '프로필 관리',
    description: '내 프로필을 확인하고 관리하세요',
    icon: 'user',
    href: '/profile',
    color: 'bg-pink-500',
    gradient: true,
  },
];

// Activity data
export const ACTIVITIES = [
  {
    id: 1,
    title: '새 채팅방 생성',
    user: '김철수',
    time: '2시간 전',
    status: 'online' as const,
  },
  {
    id: 2,
    title: 'AI 어시스턴트 사용',
    user: '이영희',
    time: '4시간 전',
    status: 'online' as const,
  },
  {
    id: 3,
    title: '채널 참여',
    user: '박민수',
    time: '6시간 전',
    status: 'away' as const,
  },
  {
    id: 4,
    title: '데이터 분석 실행',
    user: '최지영',
    time: '1일 전',
    status: 'offline' as const,
  },
];

// System status data
export const SYSTEM_STATUS = [
  {
    service: '채팅 서버',
    status: '정상',
    color: 'text-green-600',
    badge: 'success' as const,
  },
  {
    service: 'AI 서비스',
    status: '정상',
    color: 'text-green-600',
    badge: 'success' as const,
  },
  {
    service: '데이터베이스',
    status: '정상',
    color: 'text-green-600',
    badge: 'success' as const,
  },
  {
    service: '파일 스토리지',
    status: '점검 중',
    color: 'text-yellow-600',
    badge: 'warning' as const,
  },
];

export const NOTIFICATIONS = [
  {
    message: '새로운 채팅 메시지가 도착했습니다',
    time: '1분 전',
    type: 'info' as const,
  },
  {
    message: 'AI 분석이 완료되었습니다',
    time: '5분 전',
    type: 'success' as const,
  },
  {
    message: '시스템 업데이트가 필요합니다',
    time: '10분 전',
    type: 'warning' as const,
  },
];
