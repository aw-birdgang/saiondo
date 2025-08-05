// 사용자 상태 상수
export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy',
} as const;

// 사용자 검색 상수
export const SEARCH_LIMITS = {
  DEFAULT_SEARCH_LIMIT: 10,
  MAX_SEARCH_LIMIT: 50,
  MIN_QUERY_LENGTH: 2,
} as const;

// 사용자 프로필 상수
export const PROFILE_LIMITS = {
  MAX_USERNAME_LENGTH: 30,
  MAX_BIO_LENGTH: 200,
  AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// 에러 메시지 상수
export const USER_ERROR_MESSAGES = {
  VALIDATION: {
    USERNAME_REQUIRED: '사용자명을 입력해주세요.',
    EMAIL_REQUIRED: '이메일을 입력해주세요.',
    EMAIL_INVALID: '유효한 이메일 주소를 입력해주세요.',
    USERNAME_TOO_LONG: '사용자명은 30자 이내로 입력해주세요.',
    BIO_TOO_LONG: '자기소개는 200자 이내로 입력해주세요.',
    AVATAR_TOO_LARGE: '프로필 이미지는 5MB 이하로 업로드해주세요.',
  },
  OPERATION: {
    CREATE_FAILED: '사용자 생성에 실패했습니다.',
    UPDATE_FAILED: '사용자 정보 수정에 실패했습니다.',
    GET_FAILED: '사용자 정보를 불러오는데 실패했습니다.',
    SEARCH_FAILED: '사용자 검색에 실패했습니다.',
    NOT_FOUND: '사용자를 찾을 수 없습니다.',
  },
  PERMISSION: {
    ACCESS_DENIED: '접근 권한이 없습니다.',
    INSUFFICIENT_PERMISSIONS: '권한이 부족합니다.',
  },
} as const;

// 캐시 TTL 상수
export const USER_CACHE_TTL = {
  USER_PROFILE: 10 * 60 * 1000, // 10분
  USER_SEARCH: 5 * 60 * 1000, // 5분
  USER_LIST: 15 * 60 * 1000, // 15분
} as const; 