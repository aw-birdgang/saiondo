// 비즈니스 규칙 상수
export const BUSINESS_RULES = {
  MAX_DAILY_INVITATIONS: 10,
  MAX_MESSAGE_LENGTH: 500,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  DEFAULT_EXPIRATION_HOURS: 24,
} as const;

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  VALIDATION: {
    EMAIL_REQUIRED: '파트너의 이메일 주소를 입력해주세요.',
    EMAIL_INVALID: '유효한 이메일 주소를 입력해주세요.',
    MESSAGE_TOO_LONG: '메시지는 500자 이내로 입력해주세요.',
    USER_ID_REQUIRED: '사용자 ID가 필요합니다.',
    INVITATION_ID_REQUIRED: '초대장 ID가 필요합니다.',
  },
  PERMISSION: {
    DENIED: '초대를 보낼 권한이 없습니다.',
  },
  LIMIT: {
    EXCEEDED: '오늘 초대 가능한 횟수를 초과했습니다.',
  },
  OPERATION: {
    SEND_FAILED: '초대 발송에 실패했습니다.',
    RESPONSE_FAILED: '초대 응답에 실패했습니다.',
    GET_FAILED: '초대장을 불러오는데 실패했습니다.',
    STATS_FAILED: '초대 통계를 불러오는데 실패했습니다.',
    CANCEL_FAILED: '초대 취소에 실패했습니다.',
  },
} as const;

// 캐시 TTL 상수
export const CACHE_TTL = {
  INVITATIONS: 5 * 60 * 1000, // 5분
  STATS: 10 * 60 * 1000, // 10분
  PERMISSIONS: 30 * 60 * 1000, // 30분
} as const; 