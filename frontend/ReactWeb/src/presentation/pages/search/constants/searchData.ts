import type { SearchResult, SearchFilter } from '@/presentation/pages/search/types/searchTypes';

// Mock 검색 결과 데이터
export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: '1',
    type: 'user',
    title: '김철수',
    description: '개발자 김철수입니다. React와 TypeScript를 주로 사용합니다.',
    url: '/profile/user1',
    metadata: {
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      category: '개발자',
      tags: ['React', 'TypeScript', 'Frontend'],
      relevance: 0.95,
    },
    highlights: {
      title: ['김철수'],
      description: ['개발자', 'React', 'TypeScript'],
    },
  },
  {
    id: '2',
    type: 'channel',
    title: '개발자 모임',
    description: '프론트엔드 개발자들이 모여서 기술을 공유하는 채널입니다.',
    url: '/channel/dev-meeting',
    metadata: {
      category: '개발',
      tags: ['프론트엔드', '개발', '기술공유'],
      relevance: 0.88,
    },
    highlights: {
      title: ['개발자 모임'],
      description: ['프론트엔드', '개발자', '기술공유'],
    },
  },
  {
    id: '3',
    type: 'message',
    title: 'React Hooks 사용법',
    description:
      'useState와 useEffect를 활용한 상태 관리 방법에 대해 설명드리겠습니다.',
    url: '/chat/room1/message123',
    metadata: {
      sender: '김철수',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: '개발',
      tags: ['React', 'Hooks', 'useState', 'useEffect'],
      relevance: 0.82,
    },
    highlights: {
      title: ['React Hooks'],
      description: ['useState', 'useEffect', '상태관리'],
    },
  },
  {
    id: '4',
    type: 'analysis',
    title: '김철수 & 이영희 관계 분석',
    description: '두 사람의 관계 호환성과 소통 패턴을 분석한 결과입니다.',
    url: '/analysis/result1',
    metadata: {
      category: '관계분석',
      tags: ['호환성', '소통', '관계'],
      relevance: 0.75,
    },
    highlights: {
      title: ['김철수', '이영희', '관계 분석'],
      description: ['호환성', '소통', '패턴'],
    },
  },
  {
    id: '5',
    type: 'assistant',
    title: '개발 도우미 AI',
    description:
      '코딩 관련 질문에 답변하고 코드 리뷰를 도와주는 AI 상담사입니다.',
    url: '/assistant/dev-helper',
    metadata: {
      category: 'AI 상담사',
      tags: ['코딩', '리뷰', '질문'],
      relevance: 0.7,
    },
    highlights: {
      title: ['개발 도우미 AI'],
      description: ['코딩', '리뷰', '질문'],
    },
  },
  {
    id: '6',
    type: 'category',
    title: '프로그래밍',
    description: '프로그래밍 언어와 개발 도구에 관한 대화 주제입니다.',
    url: '/category/programming',
    metadata: {
      category: '기술',
      tags: ['프로그래밍', '개발', '언어'],
      relevance: 0.65,
    },
    highlights: {
      title: ['프로그래밍'],
      description: ['프로그래밍', '개발', '언어'],
    },
  },
  {
    id: '7',
    type: 'user',
    title: '이영희',
    description: '디자이너 이영희입니다. UI/UX 디자인을 전문으로 합니다.',
    url: '/profile/user2',
    metadata: {
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      category: '디자이너',
      tags: ['UI/UX', '디자인', 'Figma'],
      relevance: 0.6,
    },
    highlights: {
      title: ['이영희'],
      description: ['디자이너', 'UI/UX', '디자인'],
    },
  },
  {
    id: '8',
    type: 'channel',
    title: '디자인 스터디',
    description: 'UI/UX 디자인 트렌드와 실무 경험을 공유하는 채널입니다.',
    url: '/channel/design-study',
    metadata: {
      category: '디자인',
      tags: ['UI/UX', '트렌드', '실무'],
      relevance: 0.55,
    },
    highlights: {
      title: ['디자인 스터디'],
      description: ['UI/UX', '트렌드', '실무'],
    },
  },
];

// 검색 필터 옵션
export const SEARCH_FILTERS: SearchFilter[] = [
  {
    type: 'all',
    label: '전체',
    count: 0,
    isActive: true,
  },
  {
    type: 'user',
    label: '사용자',
    count: 0,
    isActive: false,
  },
  {
    type: 'channel',
    label: '채널',
    count: 0,
    isActive: false,
  },
  {
    type: 'message',
    label: '메시지',
    count: 0,
    isActive: false,
  },
  {
    type: 'analysis',
    label: '분석',
    count: 0,
    isActive: false,
  },
  {
    type: 'assistant',
    label: 'AI 상담사',
    count: 0,
    isActive: false,
  },
  {
    type: 'category',
    label: '카테고리',
    count: 0,
    isActive: false,
  },
];

// 검색 타입별 아이콘
export const SEARCH_TYPE_ICONS = {
  user: '👤',
  channel: '📢',
  message: '💬',
  analysis: '📊',
  assistant: '🤖',
  category: '📁',
};

// 검색 타입별 색상
export const SEARCH_TYPE_COLORS = {
  user: 'bg-blue-500',
  channel: 'bg-green-500',
  message: 'bg-purple-500',
  analysis: 'bg-orange-500',
  assistant: 'bg-pink-500',
  category: 'bg-gray-500',
};

// 인기 검색어
export const TRENDING_SEARCHES = [
  'React 개발',
  'TypeScript',
  'UI/UX 디자인',
  '관계 분석',
  'AI 상담사',
  '프로그래밍',
  '개발자 모임',
  '디자인 트렌드',
];

// 검색 제안어
export const SEARCH_SUGGESTIONS = [
  'React Hooks',
  'TypeScript 설정',
  'UI 컴포넌트',
  '상태 관리',
  'API 연동',
  '성능 최적화',
  '테스트 코드',
  '배포 방법',
];

// 최근 검색어 (Mock)
export const RECENT_SEARCHES = [
  'React 개발',
  'TypeScript 설정',
  'UI 컴포넌트',
  '상태 관리',
];

// 검색 로딩 시뮬레이션 시간 (ms)
export const SEARCH_LOAD_TIME = 1000;

// 검색 제안 로딩 시뮬레이션 시간 (ms)
export const SUGGESTION_LOAD_TIME = 300;

// 검색 결과 하이라이트 함수
export const highlightText = (text: string, query: string): string => {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
  );
};

// 검색 결과 정렬 함수
export const sortSearchResults = (
  results: SearchResult[],
  query: string
): SearchResult[] => {
  return results.sort((a, b) => {
    // 관련도 점수로 정렬
    const relevanceDiff =
      (b.metadata.relevance || 0) - (a.metadata.relevance || 0);
    if (relevanceDiff !== 0) return relevanceDiff;

    // 제목에 검색어가 포함된 것을 우선
    const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase());
    const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase());
    if (aTitleMatch && !bTitleMatch) return -1;
    if (!aTitleMatch && bTitleMatch) return 1;

    return 0;
  });
};
