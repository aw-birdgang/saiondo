// 시스템 상태 상수
export const SYSTEM_STATUS = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  UNHEALTHY: 'unhealthy',
  CRITICAL: 'critical',
} as const;

// 시스템 컴포넌트 상수
export const SYSTEM_COMPONENTS = {
  DATABASE: 'database',
  CACHE: 'cache',
  API: 'api',
  AUTH: 'auth',
  STORAGE: 'storage',
  QUEUE: 'queue',
  SEARCH: 'search',
  ANALYTICS: 'analytics',
} as const;

// 유지보수 타입 상수
export const MAINTENANCE_TYPES = {
  BACKUP: 'backup',
  CLEANUP: 'cleanup',
  OPTIMIZATION: 'optimization',
  RESTART: 'restart',
} as const;

// 시스템 제한 상수
export const SYSTEM_LIMITS = {
  MAX_BACKUP_SIZE: 1024 * 1024 * 1024, // 1GB
  MAX_LOG_RETENTION_DAYS: 30,
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_CONCURRENT_USERS: 10000,
  MAX_API_REQUESTS_PER_MINUTE: 1000,
} as const;

// 에러 메시지 상수
export const SYSTEM_ERROR_MESSAGES = {
  VALIDATION: {
    MAINTENANCE_TYPE_INVALID: '유효하지 않은 유지보수 타입입니다.',
    TIME_RANGE_INVALID: '유효하지 않은 시간 범위입니다.',
    CONFIG_INVALID: '유효하지 않은 설정입니다.',
  },
  OPERATION: {
    SYSTEM_OVERVIEW_FAILED: '시스템 개요 조회에 실패했습니다.',
    OPTIMIZATION_FAILED: '시스템 최적화에 실패했습니다.',
    MAINTENANCE_FAILED: '유지보수 작업에 실패했습니다.',
    MONITORING_FAILED: '실시간 모니터링에 실패했습니다.',
    DIAGNOSIS_FAILED: '시스템 진단에 실패했습니다.',
    BACKUP_FAILED: '백업 작업에 실패했습니다.',
    CLEANUP_FAILED: '정리 작업에 실패했습니다.',
    RESTART_FAILED: '재시작 준비에 실패했습니다.',
  },
} as const;

// 캐시 TTL 상수
export const SYSTEM_CACHE_TTL = {
  SYSTEM_OVERVIEW: 60 * 1000, // 1분
  REAL_TIME_MONITORING: 30 * 1000, // 30초
  SYSTEM_DIAGNOSIS: 5 * 60 * 1000, // 5분
} as const;

// 시스템 권장사항 상수
export const SYSTEM_RECOMMENDATIONS = {
  PERFORMANCE_DEGRADED: '시스템 성능이 저하되고 있습니다. 추가 최적화가 필요합니다.',
  SECURITY_VIOLATION: '보안 위반이 감지되었습니다. 보안 설정을 강화하세요.',
  HIGH_MEMORY_USAGE: '메모리 사용량이 높습니다. 캐시 정리를 고려하세요.',
  SLOW_RESPONSE_TIME: '응답 시간이 느려지고 있습니다. 성능 최적화가 필요합니다.',
  DATABASE_CONNECTION_ISSUES: '데이터베이스 연결에 문제가 있습니다. 즉시 점검이 필요합니다.',
} as const; 