// 분석 이벤트 타입 상수
export const ANALYTICS_EVENT_TYPES = {
  PAGE_VIEW: 'page_view',
  MESSAGE_SENT: 'message_sent',
  CHANNEL_JOINED: 'channel_joined',
  FILE_UPLOADED: 'file_uploaded',
  SEARCH_PERFORMED: 'search_performed',
  LOGIN: 'login',
  LOGOUT: 'logout',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  ERROR_OCCURRED: 'error_occurred',
} as const;

// 분석 세션 상수
export const ANALYTICS_SESSION = {
  MAX_SESSION_DURATION: 24 * 60 * 60 * 1000, // 24시간
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30분
  MIN_SESSION_DURATION: 1000, // 1초
} as const;

// 분석 제한 상수
export const ANALYTICS_LIMITS = {
  MAX_EVENT_PROPERTIES: 50,
  MAX_PROPERTY_KEY_LENGTH: 100,
  MAX_PROPERTY_VALUE_LENGTH: 1000,
  MAX_SESSION_ID_LENGTH: 64,
  MAX_USER_ID_LENGTH: 128,
  MAX_EVENT_TYPE_LENGTH: 50,
} as const;

// 분석 시간 범위 상수
export const ANALYTICS_TIME_RANGES = {
  LAST_HOUR: 60 * 60 * 1000,
  LAST_DAY: 24 * 60 * 60 * 1000,
  LAST_WEEK: 7 * 24 * 60 * 60 * 1000,
  LAST_MONTH: 30 * 24 * 60 * 60 * 1000,
  LAST_YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

// 에러 메시지 상수
export const ANALYTICS_ERROR_MESSAGES = {
  VALIDATION: {
    USER_ID_REQUIRED: '사용자 ID가 필요합니다.',
    EVENT_TYPE_REQUIRED: '이벤트 타입이 필요합니다.',
    SESSION_ID_INVALID: '유효하지 않은 세션 ID입니다.',
    PROPERTIES_TOO_LARGE: '이벤트 속성이 너무 큽니다.',
    TIME_RANGE_INVALID: '유효하지 않은 시간 범위입니다.',
  },
  OPERATION: {
    TRACK_EVENT_FAILED: '이벤트 추적에 실패했습니다.',
    START_SESSION_FAILED: '세션 시작에 실패했습니다.',
    END_SESSION_FAILED: '세션 종료에 실패했습니다.',
    GENERATE_REPORT_FAILED: '리포트 생성에 실패했습니다.',
    ANALYZE_BEHAVIOR_FAILED: '사용자 행동 분석에 실패했습니다.',
    PREDICT_CHURN_FAILED: '이탈 예측에 실패했습니다.',
    EXPORT_DATA_FAILED: '데이터 내보내기에 실패했습니다.',
  },
} as const;

// 캐시 TTL 상수
export const ANALYTICS_CACHE_TTL = {
  REAL_TIME_ACTIVITY: 30 * 1000, // 30초
  USER_BEHAVIOR: 5 * 60 * 1000, // 5분
  ANALYTICS_REPORT: 15 * 60 * 1000, // 15분
  USER_JOURNEY: 10 * 60 * 1000, // 10분
  CHURN_PREDICTION: 30 * 60 * 1000, // 30분
} as const;

// 분석 가중치 상수
export const ANALYTICS_WEIGHTS = {
  RECENT_EVENT: 1.0,
  OLD_EVENT: 0.5,
  CRITICAL_EVENT: 2.0,
  USER_ENGAGEMENT: 1.5,
  CONVERSION_EVENT: 3.0,
} as const; 