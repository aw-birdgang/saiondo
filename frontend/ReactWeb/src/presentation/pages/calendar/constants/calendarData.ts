import type { Event, EventTypeConfig } from '../types/calendarTypes';

// 이벤트 타입별 설정
export const EVENT_TYPE_CONFIG: EventTypeConfig = {
  meeting: { color: 'bg-blue-500', label: '회의' },
  date: { color: 'bg-pink-500', label: '데이트' },
  anniversary: { color: 'bg-purple-500', label: '기념일' },
  other: { color: 'bg-gray-500', label: '기타' },
  work: { color: 'bg-green-500', label: '업무' },
  personal: { color: 'bg-orange-500', label: '개인' }
};

// 요일 라벨
export const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

// Mock 이벤트 데이터
export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: '팀 미팅',
    date: new Date(2024, 0, 15),
    type: 'meeting',
    description: '주간 팀 미팅',
    time: '10:00',
    priority: 'high',
    isAllDay: false
  },
  {
    id: '2',
    title: '데이트',
    date: new Date(2024, 0, 20),
    type: 'date',
    description: '영화 보기',
    time: '19:00',
    priority: 'medium',
    isAllDay: false
  },
  {
    id: '3',
    title: '결혼기념일',
    date: new Date(2024, 0, 25),
    type: 'anniversary',
    description: '우리의 특별한 날',
    priority: 'high',
    isAllDay: true
  },
  {
    id: '4',
    title: '프로젝트 마감',
    date: new Date(2024, 0, 30),
    type: 'work',
    description: '중요한 프로젝트 마감일',
    time: '18:00',
    priority: 'high',
    isAllDay: false
  },
  {
    id: '5',
    title: '운동',
    date: new Date(2024, 1, 5),
    type: 'personal',
    description: '헬스장 가기',
    time: '07:00',
    priority: 'low',
    isAllDay: false
  }
];

// 뷰 모드 옵션
export const VIEW_MODE_OPTIONS = [
  { value: 'month', label: '월' },
  { value: 'week', label: '주' },
  { value: 'day', label: '일' }
];

// 이벤트 타입 옵션 (필터용)
export const EVENT_TYPE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'meeting', label: '회의' },
  { value: 'date', label: '데이트' },
  { value: 'anniversary', label: '기념일' },
  { value: 'work', label: '업무' },
  { value: 'personal', label: '개인' },
  { value: 'other', label: '기타' }
];

// 우선순위 옵션
export const PRIORITY_OPTIONS = [
  { value: 'low', label: '낮음' },
  { value: 'medium', label: '보통' },
  { value: 'high', label: '높음' }
];

// 기본 이벤트 폼 데이터
export const DEFAULT_EVENT: Omit<Event, 'id'> = {
  title: '',
  date: new Date(),
  type: 'other',
  description: '',
  time: '',
  location: '',
  priority: 'medium',
  isAllDay: false
}; 