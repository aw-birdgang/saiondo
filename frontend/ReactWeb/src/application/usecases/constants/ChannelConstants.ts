// 채널 타입 상수
export const CHANNEL_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  DIRECT: 'direct',
  GROUP: 'group',
} as const;

// 채널 상태 상수
export const CHANNEL_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
} as const;

// 채널 제한 상수
export const CHANNEL_LIMITS = {
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 200,
  MAX_MEMBERS: 1000,
  MIN_NAME_LENGTH: 2,
} as const;

// 채널 권한 상수
export const CHANNEL_PERMISSIONS = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  MEMBER: 'member',
  GUEST: 'guest',
} as const;

// 에러 메시지 상수
export const CHANNEL_ERROR_MESSAGES = {
  VALIDATION: {
    NAME_REQUIRED: '채널명을 입력해주세요.',
    NAME_TOO_SHORT: '채널명은 2자 이상 입력해주세요.',
    NAME_TOO_LONG: '채널명은 50자 이내로 입력해주세요.',
    DESCRIPTION_TOO_LONG: '채널 설명은 200자 이내로 입력해주세요.',
    TYPE_INVALID: '유효하지 않은 채널 타입입니다.',
    OWNER_REQUIRED: '채널 소유자가 필요합니다.',
  },
  OPERATION: {
    CREATE_FAILED: '채널 생성에 실패했습니다.',
    UPDATE_FAILED: '채널 수정에 실패했습니다.',
    GET_FAILED: '채널 정보를 불러오는데 실패했습니다.',
    ADD_MEMBER_FAILED: '멤버 추가에 실패했습니다.',
    REMOVE_MEMBER_FAILED: '멤버 제거에 실패했습니다.',
    NOT_FOUND: '채널을 찾을 수 없습니다.',
    ALREADY_MEMBER: '이미 채널 멤버입니다.',
    NOT_MEMBER: '채널 멤버가 아닙니다.',
  },
  PERMISSION: {
    ACCESS_DENIED: '채널에 접근할 권한이 없습니다.',
    INSUFFICIENT_PERMISSIONS: '권한이 부족합니다.',
    OWNER_ONLY: '채널 소유자만 가능한 작업입니다.',
  },
} as const;

// 캐시 TTL 상수
export const CHANNEL_CACHE_TTL = {
  CHANNEL_INFO: 15 * 60 * 1000, // 15분
  CHANNEL_LIST: 10 * 60 * 1000, // 10분
  MEMBER_LIST: 5 * 60 * 1000, // 5분
} as const; 