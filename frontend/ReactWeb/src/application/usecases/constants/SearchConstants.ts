// 검색 제한 상수
export const SEARCH_LIMITS = {
  MIN_QUERY_LENGTH: 1,
  MAX_QUERY_LENGTH: 100,
  MAX_RESULTS_PER_PAGE: 50,
  DEFAULT_RESULTS_PER_PAGE: 20,
  MAX_SUGGESTIONS: 10,
  MAX_HISTORY_ITEMS: 20,
  MAX_TRENDING_ITEMS: 10,
} as const;

// 검색 타입 상수
export const SEARCH_TYPES = {
  ALL: 'all',
  MESSAGES: 'messages',
  USERS: 'users',
  CHANNELS: 'channels',
  FILES: 'files',
} as const;

// 검색 정렬 옵션
export const SEARCH_SORT_OPTIONS = {
  RELEVANCE: 'relevance',
  DATE: 'date',
  TITLE: 'title',
  TYPE: 'type',
} as const;

// 에러 메시지 상수
export const SEARCH_ERROR_MESSAGES = {
  VALIDATION: {
    QUERY_REQUIRED: '검색어를 입력해주세요.',
    QUERY_TOO_SHORT: '검색어는 1자 이상 입력해주세요.',
    QUERY_TOO_LONG: '검색어는 100자 이내로 입력해주세요.',
    INVALID_CHARACTERS: '검색어에 유효하지 않은 문자가 포함되어 있습니다.',
  },
  OPERATION: {
    SEARCH_FAILED: '검색에 실패했습니다.',
    SUGGESTIONS_FAILED: '검색 제안을 불러오는데 실패했습니다.',
    HISTORY_FAILED: '검색 기록을 불러오는데 실패했습니다.',
    TRENDING_FAILED: '인기 검색어를 불러오는데 실패했습니다.',
    SAVE_HISTORY_FAILED: '검색 기록 저장에 실패했습니다.',
    CLEAR_HISTORY_FAILED: '검색 기록 삭제에 실패했습니다.',
  },
} as const;

// 캐시 TTL 상수
export const SEARCH_CACHE_TTL = {
  SEARCH_RESULTS: 5 * 60 * 1000, // 5분
  SUGGESTIONS: 10 * 60 * 1000, // 10분
  SEARCH_HISTORY: 30 * 60 * 1000, // 30분
  TRENDING_SEARCHES: 60 * 60 * 1000, // 1시간
} as const;

// 검색 가중치 상수
export const SEARCH_WEIGHTS = {
  TITLE_MATCH: 3.0,
  DESCRIPTION_MATCH: 1.0,
  CONTENT_MATCH: 2.0,
  EXACT_MATCH: 5.0,
  RECENCY_BONUS: 0.5,
} as const; 