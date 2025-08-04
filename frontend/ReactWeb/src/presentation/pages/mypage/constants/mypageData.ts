import type { ActivityStat, RecentActivity, QuickAction, AccountProgressItem } from '../types/mypageTypes';

// 활동 통계 데이터
export const ACTIVITY_STATS: ActivityStat[] = [
  { label: '총 채팅', value: '1,234', trend: '+12%', color: 'text-blue-600' },
  { label: '참여 채널', value: '56', trend: '+8%', color: 'text-green-600' },
  { label: 'AI 상호작용', value: '89', trend: '+23%', color: 'text-purple-600' },
  { label: '만족도', value: '4.8', trend: '+5%', color: 'text-yellow-600' },
];

// 최근 활동 데이터
export const RECENT_ACTIVITIES: RecentActivity[] = [
  { id: 1, action: '새 채팅방 생성', time: '2시간 전', type: 'chat' },
  { id: 2, action: 'AI 어시스턴트 사용', time: '4시간 전', type: 'ai' },
  { id: 3, action: '채널 참여', time: '6시간 전', type: 'channel' },
  { id: 4, action: '데이터 분석 실행', time: '1일 전', type: 'analysis' },
];

// 빠른 액션 데이터
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'new-chat',
    title: '새 채팅 시작',
    path: '/chat',
    icon: 'chat',
    description: '새로운 대화를 시작하세요'
  },
  {
    id: 'channel-management',
    title: '채널 관리',
    path: '/channels',
    icon: 'channel',
    description: '채널을 관리하세요'
  },
  {
    id: 'ai-assistant',
    title: 'AI 어시스턴트',
    path: '/assistant',
    icon: 'assistant',
    description: 'AI와 대화하세요'
  }
];

// 계정 완성도 데이터
export const ACCOUNT_PROGRESS_ITEMS: AccountProgressItem[] = [
  { id: 'profile', label: '프로필 정보', completed: true, color: 'green' },
  { id: 'email', label: '이메일 인증', completed: true, color: 'green' },
  { id: 'photo', label: '프로필 사진', completed: false, color: 'yellow' },
];

// 계정 완성도 퍼센트
export const PROFILE_COMPLETION_PERCENTAGE = 75; 