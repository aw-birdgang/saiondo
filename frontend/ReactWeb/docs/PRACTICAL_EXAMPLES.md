# 실전 사용 예시 가이드

이 문서는 Clean Architecture 기반 ReactWeb 프로젝트의 실제 사용 예시를 제공합니다.

## 🚀 기본 사용법

### 1. **사용자 인증 및 관리**

```typescript
import { UseCaseFactory } from '../application/usecases/UseCaseFactory';

// 사용자 로그인
const loginUser = async (email: string, password: string) => {
  try {
    const authUseCase = UseCaseFactory.createAuthUseCase();
    const result = await authUseCase.login({ email, password });
    
    console.log('로그인 성공:', result.user);
    return result;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

// 사용자 정보 조회
const getUserProfile = async (userId: string) => {
  const getUserUseCase = UseCaseFactory.createGetCurrentUserUseCase();
  return await getUserUseCase.execute(userId);
};

// 사용자 활동 로그
const logUserActivity = async (userId: string, activity: string) => {
  const activityUseCase = UseCaseFactory.createUserActivityLogUseCase();
  return await activityUseCase.execute({
    userId,
    activity,
    timestamp: new Date()
  });
};
```

### 2. **채널 및 메시지 관리**

```typescript
// 채널 생성
const createNewChannel = async (channelData: {
  name: string;
  description: string;
  type: 'public' | 'private';
}) => {
  const createChannelUseCase = UseCaseFactory.createCreateChannelUseCase();
  return await createChannelUseCase.execute(channelData);
};

// 실시간 채팅
const setupRealTimeChat = async (channelId: string) => {
  const chatUseCase = UseCaseFactory.createRealTimeChatUseCase();
  
  // 채널 참여
  await chatUseCase.joinChannel({ channelId, userId: 'current-user-id' });
  
  // 메시지 전송
  const sendMessage = async (content: string) => {
    return await chatUseCase.sendMessage({
      channelId,
      userId: 'current-user-id',
      content,
      timestamp: new Date()
    });
  };
  
  // 메시지 수신 리스너
  chatUseCase.onMessage('message', (message) => {
    console.log('새 메시지:', message);
  });
  
  return { sendMessage };
};
```

### 3. **파일 업로드 및 관리**

```typescript
// 파일 업로드
const uploadFile = async (file: File, channelId: string) => {
  const uploadUseCase = UseCaseFactory.createUploadFileUseCase();
  
  return await uploadUseCase.execute({
    file,
    channelId,
    userId: 'current-user-id',
    metadata: {
      originalName: file.name,
      size: file.size,
      type: file.type
    }
  });
};

// 파일 다운로드
const downloadFile = async (fileId: string) => {
  const fileUseCase = UseCaseFactory.createFileUseCase();
  return await fileUseCase.download(fileId);
};
```

## 🔧 고급 기능 사용법

### 1. **성능 모니터링**

```typescript
import { PerformanceMonitoringService } from '../application/services/PerformanceMonitoringService';

// 성능 측정 데코레이터
const measurePerformance = async <T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> => {
  const performanceService = new PerformanceMonitoringService(
    userRepository,
    channelRepository,
    messageRepository
  );
  
  return await performanceService.measurePerformance(
    operationName,
    operation,
    { userId: 'current-user-id' }
  );
};

// 사용 예시
const fetchUserData = async (userId: string) => {
  return await measurePerformance('fetch_user_data', async () => {
    // 실제 데이터 조회 로직
    const user = await userRepository.findById(userId);
    const channels = await channelRepository.findByUserId(userId);
    return { user, channels };
  });
};

// 성능 리포트 생성
const generatePerformanceReport = async () => {
  const performanceService = new PerformanceMonitoringService(
    userRepository,
    channelRepository,
    messageRepository
  );
  
  const report = performanceService.generateReport({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24시간
    end: new Date()
  });
  
  console.log('성능 리포트:', report);
  return report;
};
```

### 2. **보안 기능**

```typescript
import { SecurityService } from '../application/services/SecurityService';

// 보안 서비스 초기화
const securityService = new SecurityService({
  enableRateLimiting: true,
  enableInputValidation: true,
  enableXSSProtection: true,
  enableCSRFProtection: true
});

// 입력 검증
const validateUserInput = (userData: any) => {
  const schema = {
    username: { 
      required: true, 
      type: 'string', 
      minLength: 3, 
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/
    },
    email: { 
      required: true, 
      type: 'string', 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: { 
      required: true, 
      type: 'string', 
      minLength: 8,
      maxLength: 128
    }
  };
  
  const validation = securityService.validateInput(userData, schema);
  
  if (!validation.isValid) {
    throw new Error(`입력 검증 실패: ${validation.errors.join(', ')}`);
  }
  
  return validation.sanitizedData;
};

// Rate Limiting
const checkRateLimit = (userId: string) => {
  const rateLimit = securityService.checkRateLimit(userId, {
    windowMs: 60000,    // 1분
    maxRequests: 100    // 최대 100개 요청
  });
  
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000)} seconds`);
  }
  
  return rateLimit;
};

// XSS 방지
const sanitizeUserInput = (input: string) => {
  return securityService.sanitizeInput(input);
};
```

### 3. **캐싱 시스템**

```typescript
import { MultiLevelCacheService } from '../application/services/MultiLevelCacheService';

// 다단계 캐시 설정
const cacheConfig = {
  levels: [
    { name: 'L1', ttl: 60000, maxSize: 1000, priority: 1 },    // 1분
    { name: 'L2', ttl: 300000, maxSize: 5000, priority: 2 },   // 5분
    { name: 'L3', ttl: 1800000, maxSize: 10000, priority: 3 }, // 30분
  ],
  enableCompression: true,
  enableMetrics: true,
};

const cacheService = new MultiLevelCacheService(
  userRepository,
  channelRepository,
  messageRepository,
  cacheConfig
);

// 캐시된 데이터 조회
const getCachedUserData = async (userId: string) => {
  return await cacheService.get(`user:${userId}`, async () => {
    // 캐시에 없으면 데이터베이스에서 조회
    const user = await userRepository.findById(userId);
    const userChannels = await channelRepository.findByUserId(userId);
    return { user, channels: userChannels };
  });
};

// 배치 캐시 조회
const getMultipleUsers = async (userIds: string[]) => {
  return await cacheService.batchGet(userIds, async (keys) => {
    // 여러 사용자를 한 번에 조회
    const users = await userRepository.findByIds(keys);
    const userMap = new Map();
    users.forEach(user => userMap.set(user.id, user));
    return userMap;
  });
};

// 캐시 통계 조회
const getCacheStats = () => {
  const stats = cacheService.getStats();
  console.log('캐시 히트율:', stats.hitRate);
  console.log('캐시 크기:', stats.totalSize);
  return stats;
};
```

### 4. **에러 처리 및 로깅**

```typescript
import { ErrorHandlingService } from '../application/services/ErrorHandlingService';

// 에러 처리 서비스 초기화
const errorService = new ErrorHandlingService({
  enableConsoleLogging: true,
  enableRemoteLogging: true,
  remoteEndpoint: 'https://api.example.com/logs',
  logLevel: 'error'
});

// 글로벌 에러 핸들러 설정
const setupGlobalErrorHandling = () => {
  errorService.setupGlobalErrorHandling();
  
  // React 에러 바운더리와 통합
  window.addEventListener('error', (event) => {
    errorService.logError(event.error, {
      context: 'global_error',
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    errorService.logError(event.reason, {
      context: 'unhandled_promise_rejection',
      url: window.location.href
    });
  });
};

// 에러 복구 시도
const attemptErrorRecovery = async (error: Error, context: any) => {
  const recovered = await errorService.attemptErrorRecovery(error, context);
  
  if (recovered) {
    console.log('에러 복구 성공');
  } else {
    console.log('에러 복구 실패');
  }
  
  return recovered;
};

// 에러 리포트 생성
const generateErrorReport = async () => {
  const report = errorService.generateErrorReport({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24시간
    end: new Date()
  });
  
  console.log('에러 리포트:', report);
  return report;
};
```

### 5. **분석 및 인사이트**

```typescript
import { AnalyticsService } from '../application/services/AnalyticsService';

// 분석 서비스 초기화
const analyticsService = new AnalyticsService(
  userRepository,
  channelRepository,
  messageRepository
);

// 사용자 이벤트 추적
const trackUserEvent = (userId: string, eventType: string, properties?: any) => {
  analyticsService.trackEvent(userId, eventType, properties);
};

// 사용 예시
trackUserEvent('user123', 'page_view', { page: '/dashboard' });
trackUserEvent('user123', 'message_sent', { channelId: 'channel456', messageLength: 50 });
trackUserEvent('user123', 'file_uploaded', { fileType: 'image', fileSize: 1024000 });

// 사용자 세션 관리
const startUserSession = (userId: string) => {
  const sessionId = analyticsService.startSession(userId, navigator.userAgent);
  return sessionId;
};

const endUserSession = (sessionId: string) => {
  analyticsService.endSession(sessionId);
};

// 사용자 행동 분석
const analyzeUserBehavior = async (userId: string) => {
  const behavior = analyticsService.analyzeUserBehavior(userId, {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일
    end: new Date()
  });
  
  console.log('사용자 행동 분석:', behavior);
  return behavior;
};

// 이탈 예측
const predictUserChurn = async (userId: string) => {
  const prediction = analyticsService.predictUserChurn(userId);
  
  console.log('이탈 예측:', prediction);
  return prediction;
};
```

## 🏗️ 시스템 관리

### 1. **시스템 건강 상태 모니터링**

```typescript
import { SystemManagementUseCase } from '../application/usecases/SystemManagementUseCase';

// 시스템 관리 Use Case 생성
const systemManagement = UseCaseFactory.createSystemManagementUseCase();

// 시스템 전체 개요 조회
const getSystemOverview = async () => {
  const overview = await systemManagement.getSystemOverview();
  
  console.log('시스템 상태:', overview.health.overall);
  console.log('성능 메트릭:', overview.metrics);
  console.log('보안 상태:', overview.security);
  
  return overview;
};

// 실시간 모니터링
const getRealTimeMonitoring = async () => {
  const monitoring = await systemManagement.getRealTimeMonitoring();
  
  console.log('활성 사용자:', monitoring.activeUsers);
  console.log('최근 에러:', monitoring.recentErrors);
  console.log('보안 알림:', monitoring.securityAlerts);
  
  return monitoring;
};

// 시스템 진단
const diagnoseSystem = async () => {
  const diagnosis = await systemManagement.diagnoseSystem();
  
  console.log('발견된 문제:', diagnosis.issues);
  console.log('권장사항:', diagnosis.recommendations);
  console.log('예상 해결 시간:', diagnosis.estimatedResolutionTime);
  
  return diagnosis;
};
```

### 2. **시스템 최적화**

```typescript
// 시스템 최적화 설정
const optimizeSystem = async () => {
  const optimizationRequest = {
    enablePerformanceMonitoring: true,
    enableSecurityProtection: true,
    enableAdvancedCaching: true,
    enableAnalytics: true,
    cacheConfig: {
      levels: [
        { name: 'L1', ttl: 60000, maxSize: 1000, priority: 1 },
        { name: 'L2', ttl: 300000, maxSize: 5000, priority: 2 },
        { name: 'L3', ttl: 1800000, maxSize: 10000, priority: 3 },
      ],
      enableCompression: true,
    },
    securityConfig: {
      enableRateLimiting: true,
      enableInputValidation: true,
      enableXSSProtection: true,
      enableCSRFProtection: true,
    },
  };
  
  const result = await systemManagement.optimizeSystem(optimizationRequest);
  
  console.log('최적화 결과:', result);
  return result;
};
```

### 3. **시스템 유지보수**

```typescript
// 시스템 백업
const backupSystem = async () => {
  const result = await systemManagement.performMaintenance({
    type: 'backup',
    options: {
      backupAnalytics: true
    }
  });
  
  console.log('백업 결과:', result);
  return result;
};

// 시스템 정리
const cleanupSystem = async () => {
  const result = await systemManagement.performMaintenance({
    type: 'cleanup',
    options: {
      cleanupOldLogs: true
    }
  });
  
  console.log('정리 결과:', result);
  return result;
};

// 시스템 최적화
const performSystemOptimization = async () => {
  const result = await systemManagement.performMaintenance({
    type: 'optimization',
    options: {
      optimizeCache: true
    }
  });
  
  console.log('최적화 결과:', result);
  return result;
};
```

## 🔄 React 컴포넌트에서 사용

### 1. **커스텀 훅 생성**

```typescript
// useSystemManagement.ts
import { useState, useEffect } from 'react';
import { UseCaseFactory } from '../application/usecases/UseCaseFactory';

export const useSystemManagement = () => {
  const [systemOverview, setSystemOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const systemManagement = UseCaseFactory.createSystemManagementUseCase();

  const refreshOverview = async () => {
    setLoading(true);
    try {
      const overview = await systemManagement.getSystemOverview();
      setSystemOverview(overview);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOverview();
    
    // 30초마다 자동 새로고침
    const interval = setInterval(refreshOverview, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    systemOverview,
    loading,
    error,
    refreshOverview
  };
};
```

### 2. **React 컴포넌트에서 사용**

```typescript
// SystemDashboard.tsx
import React from 'react';
import { useSystemManagement } from './hooks/useSystemManagement';

export const SystemDashboard: React.FC = () => {
  const { systemOverview, loading, error, refreshOverview } = useSystemManagement();

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;
  if (!systemOverview) return <div>데이터가 없습니다.</div>;

  return (
    <div className="system-dashboard">
      <h1>시스템 대시보드</h1>
      
      <div className="status-section">
        <h2>시스템 상태</h2>
        <div className={`status ${systemOverview.health.overall}`}>
          {systemOverview.health.overall}
        </div>
      </div>
      
      <div className="metrics-section">
        <h2>성능 메트릭</h2>
        <div className="metrics-grid">
          <div className="metric">
            <span>응답 시간</span>
            <span>{systemOverview.metrics.performance.averageResponseTime}ms</span>
          </div>
          <div className="metric">
            <span>에러율</span>
            <span>{(systemOverview.metrics.performance.errorRate * 100).toFixed(2)}%</span>
          </div>
          <div className="metric">
            <span>캐시 히트율</span>
            <span>{(systemOverview.metrics.cache.hitRate * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>
      
      <div className="alerts-section">
        <h2>알림</h2>
        {systemOverview.health.alerts.map((alert, index) => (
          <div key={index} className={`alert ${alert.level}`}>
            <span>{alert.message}</span>
            <span>{alert.timestamp.toLocaleString()}</span>
          </div>
        ))}
      </div>
      
      <button onClick={refreshOverview}>새로고침</button>
    </div>
  );
};
```

## 🧪 테스트 예시

### 1. **Use Case 테스트**

```typescript
// SystemManagementUseCase.test.ts
import { SystemManagementUseCase } from '../SystemManagementUseCase';
import { SystemHealthService } from '../services/SystemHealthService';
import { PerformanceMonitoringService } from '../services/PerformanceMonitoringService';

describe('SystemManagementUseCase', () => {
  let useCase: SystemManagementUseCase;
  let mockSystemHealthService: jest.Mocked<SystemHealthService>;
  let mockPerformanceService: jest.Mocked<PerformanceMonitoringService>;

  beforeEach(() => {
    mockSystemHealthService = createMockSystemHealthService();
    mockPerformanceService = createMockPerformanceService();
    
    useCase = new SystemManagementUseCase(
      mockSystemHealthService,
      mockPerformanceService,
      mockErrorService,
      mockSecurityService,
      mockCacheService,
      mockAnalyticsService
    );
  });

  it('should get system overview', async () => {
    const mockOverview = {
      health: { overall: 'healthy' },
      metrics: { performance: { averageResponseTime: 100 } },
      // ... 기타 데이터
    };

    mockSystemHealthService.getSystemHealth.mockResolvedValue(mockOverview.health);
    mockSystemHealthService.getSystemMetrics.mockResolvedValue(mockOverview.metrics);

    const result = await useCase.getSystemOverview();

    expect(result.health.overall).toBe('healthy');
    expect(result.metrics.performance.averageResponseTime).toBe(100);
  });
});
```

### 2. **Service 테스트**

```typescript
// SecurityService.test.ts
import { SecurityService } from '../SecurityService';

describe('SecurityService', () => {
  let securityService: SecurityService;

  beforeEach(() => {
    securityService = new SecurityService({
      enableRateLimiting: true,
      enableInputValidation: true,
      enableXSSProtection: true,
    });
  });

  it('should validate input correctly', () => {
    const schema = {
      username: { required: true, type: 'string', minLength: 3 }
    };

    const validInput = { username: 'testuser' };
    const invalidInput = { username: 'ab' };

    const validResult = securityService.validateInput(validInput, schema);
    const invalidResult = securityService.validateInput(invalidInput, schema);

    expect(validResult.isValid).toBe(true);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toContain('username must be at least 3 characters long');
  });

  it('should sanitize XSS input', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = securityService.sanitizeInput(maliciousInput);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('&lt;script&gt;');
  });
});
```

이러한 예시들을 통해 Clean Architecture 기반의 ReactWeb 프로젝트를 효과적으로 활용할 수 있습니다. 