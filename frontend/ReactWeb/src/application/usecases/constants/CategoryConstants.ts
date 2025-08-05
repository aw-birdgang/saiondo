// 카테고리 타입 상수
export const CATEGORY_TYPES = {
  RELATIONSHIP: 'relationship',
  COMMUNICATION: 'communication',
  CONFLICT: 'conflict',
  INTIMACY: 'intimacy',
  FUTURE: 'future',
  DAILY: 'daily',
  ALL: 'all',
} as const;

// 카테고리 상태 상수
export const CATEGORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

// 카테고리 제한 상수
export const CATEGORY_LIMITS = {
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 200,
  MIN_SEARCH_LENGTH: 1,
  MAX_SEARCH_LENGTH: 100,
  MAX_CATEGORIES_PER_PAGE: 20,
} as const;

// 에러 메시지 상수
export const CATEGORY_ERROR_MESSAGES = {
  VALIDATION: {
    ID_REQUIRED: '카테고리 ID가 필요합니다.',
    ID_INVALID: '유효하지 않은 카테고리 ID입니다.',
    SEARCH_TERM_TOO_SHORT: '검색어는 1자 이상 입력해주세요.',
    SEARCH_TERM_TOO_LONG: '검색어는 100자 이내로 입력해주세요.',
    INVALID_CHARACTERS: '검색어에 유효하지 않은 문자가 포함되어 있습니다.',
  },
  OPERATION: {
    GET_CATEGORIES_FAILED: '카테고리를 불러오는데 실패했습니다.',
    GET_CODES_FAILED: '카테고리 코드를 불러오는데 실패했습니다.',
    GET_BY_ID_FAILED: '카테고리를 찾을 수 없습니다.',
    SEARCH_FAILED: '카테고리 검색에 실패했습니다.',
    GET_STATS_FAILED: '카테고리 통계를 불러오는데 실패했습니다.',
  },
} as const;

// 캐시 TTL 상수
export const CATEGORY_CACHE_TTL = {
  CATEGORIES: 30 * 60 * 1000, // 30분
  CATEGORY_CODES: 60 * 60 * 1000, // 1시간
  CATEGORY_STATS: 15 * 60 * 1000, // 15분
} as const;

// 카테고리 필터 상수
export const CATEGORY_FILTERS = [
  { id: 'all', name: '전체', isActive: true, count: 0 },
  { id: 'relationship', name: '관계', isActive: false, count: 0 },
  { id: 'communication', name: '소통', isActive: false, count: 0 },
  { id: 'conflict', name: '갈등', isActive: false, count: 0 },
  { id: 'intimacy', name: '친밀감', isActive: false, count: 0 },
  { id: 'future', name: '미래', isActive: false, count: 0 },
  { id: 'daily', name: '일상', isActive: false, count: 0 }
] as const; 