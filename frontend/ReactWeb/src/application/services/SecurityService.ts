export interface SecurityConfig {
  enableRateLimiting?: boolean;
  enableInputValidation?: boolean;
  enableXSSProtection?: boolean;
  enableCSRFProtection?: boolean;
  maxRequestSize?: number;
  allowedOrigins?: string[];
  sessionTimeout?: number;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: any) => string;
}

export interface SecurityViolation {
  id: string;
  type: 'rate_limit' | 'xss_attempt' | 'csrf_attempt' | 'invalid_input' | 'unauthorized_access';
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityReport {
  totalViolations: number;
  violationsByType: Record<string, number>;
  violationsBySeverity: Record<string, number>;
  recentViolations: SecurityViolation[];
  blockedIPs: string[];
  timeRange: {
    start: Date;
    end: Date;
  };
}

export class SecurityService {
  private violations: SecurityViolation[] = [];
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();
  private blockedIPs: Set<string> = new Set();
  private readonly config: SecurityConfig;
  private readonly maxViolations = 10000;

  constructor(config: SecurityConfig = {}) {
    this.config = {
      enableRateLimiting: true,
      enableInputValidation: true,
      enableXSSProtection: true,
      enableCSRFProtection: true,
      maxRequestSize: 10 * 1024 * 1024, // 10MB
      allowedOrigins: ['*'],
      sessionTimeout: 30 * 60 * 1000, // 30분
      ...config,
    };
  }

  /**
   * 입력 데이터 검증
   */
  validateInput(data: any, schema: Record<string, any>): {
    isValid: boolean;
    errors: string[];
    sanitizedData?: any;
  } {
    if (!this.config.enableInputValidation) {
      return { isValid: true, errors: [] };
    }

    const errors: string[] = [];
    const sanitizedData: any = {};

    for (const [key, rules] of Object.entries(schema)) {
      const value = data[key];

      // 필수 필드 검증
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${key} is required`);
        continue;
      }

      if (value !== undefined && value !== null) {
        // 타입 검증
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${key} must be of type ${rules.type}`);
          continue;
        }

        // 길이 검증
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${key} must be at least ${rules.minLength} characters long`);
        }

        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${key} must be at most ${rules.maxLength} characters long`);
        }

        // 패턴 검증
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${key} does not match the required pattern`);
        }

        // XSS 방지
        if (this.config.enableXSSProtection && typeof value === 'string') {
          const sanitized = this.sanitizeInput(value);
          if (sanitized !== value) {
            errors.push(`${key} contains potentially dangerous content`);
          } else {
            sanitizedData[key] = sanitized;
          }
        } else {
          sanitizedData[key] = value;
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitizedData : undefined,
    };
  }

  /**
   * XSS 공격 방지
   */
  sanitizeInput(input: string): string {
    if (!this.config.enableXSSProtection) return input;

    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  }

  /**
   * CSRF 토큰 검증
   */
  validateCSRFToken(token: string, sessionToken: string): boolean {
    if (!this.config.enableCSRFProtection) return true;

    return token === sessionToken && token.length > 0;
  }

  /**
   * CSRF 토큰 생성
   */
  generateCSRFToken(): string {
    return this.generateSecureToken(32);
  }

  /**
   * Rate Limiting
   */
  checkRateLimit(key: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    if (!this.config.enableRateLimiting) {
      return { allowed: true, remaining: Infinity, resetTime: Date.now() };
    }

    const now = Date.now();
    const windowStart = now - config.windowMs;
    const current = this.rateLimitStore.get(key);

    if (!current || current.resetTime < windowStart) {
      // 새로운 윈도우 시작
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
      };
    }

    if (current.count >= config.maxRequests) {
      // Rate limit 초과
      this.recordViolation({
        type: 'rate_limit',
        userId: key,
        details: { limit: config.maxRequests, windowMs: config.windowMs },
        severity: 'medium',
      });

      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime,
      };
    }

    // 카운트 증가
    current.count++;
    this.rateLimitStore.set(key, current);

    return {
      allowed: true,
      remaining: config.maxRequests - current.count,
      resetTime: current.resetTime,
    };
  }

  /**
   * IP 주소 차단
   */
  blockIP(ipAddress: string, reason: string, duration?: number): void {
    this.blockedIPs.add(ipAddress);

    this.recordViolation({
      type: 'unauthorized_access',
      ipAddress,
      details: { reason, duration },
      severity: 'high',
    });

    // 일정 시간 후 자동 해제
    if (duration) {
      setTimeout(() => {
        this.unblockIP(ipAddress);
      }, duration);
    }
  }

  /**
   * IP 주소 차단 해제
   */
  unblockIP(ipAddress: string): void {
    this.blockedIPs.delete(ipAddress);
  }

  /**
   * IP 주소 차단 여부 확인
   */
  isIPBlocked(ipAddress: string): boolean {
    return this.blockedIPs.has(ipAddress);
  }

  /**
   * 보안 위반 기록
   */
  recordViolation(violation: Omit<SecurityViolation, 'id' | 'timestamp'>): void {
    const fullViolation: SecurityViolation = {
      id: this.generateViolationId(),
      timestamp: new Date(),
      ...violation,
    };

    this.violations.push(fullViolation);

    // 최대 개수 제한
    if (this.violations.length > this.maxViolations) {
      this.violations = this.violations.slice(-this.maxViolations);
    }

    // 심각한 위반은 즉시 로깅
    if (violation.severity === 'critical') {
      console.error('Critical security violation:', fullViolation);
    }
  }

  /**
   * 보안 리포트 생성
   */
  generateSecurityReport(timeRange: { start: Date; end: Date }): SecurityReport {
    const filteredViolations = this.violations.filter(
      violation => violation.timestamp >= timeRange.start && violation.timestamp <= timeRange.end
    );

    if (filteredViolations.length === 0) {
      return {
        totalViolations: 0,
        violationsByType: {},
        violationsBySeverity: {},
        recentViolations: [],
        blockedIPs: Array.from(this.blockedIPs),
        timeRange,
      };
    }

    // 타입별 위반 수
    const violationsByType: Record<string, number> = {};
    filteredViolations.forEach(violation => {
      violationsByType[violation.type] = (violationsByType[violation.type] || 0) + 1;
    });

    // 심각도별 위반 수
    const violationsBySeverity: Record<string, number> = {};
    filteredViolations.forEach(violation => {
      violationsBySeverity[violation.severity] = (violationsBySeverity[violation.severity] || 0) + 1;
    });

    // 최근 위반들
    const recentViolations = filteredViolations
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalViolations: filteredViolations.length,
      violationsByType,
      violationsBySeverity,
      recentViolations,
      blockedIPs: Array.from(this.blockedIPs),
      timeRange,
    };
  }

  /**
   * 보안 위반 패턴 분석
   */
  analyzeSecurityPatterns(): {
    mostCommonViolations: Array<{ type: string; count: number }>;
    topAttackSources: Array<{ ipAddress: string; count: number }>;
    attackTrends: Array<{ date: string; count: number }>;
  } {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentViolations = this.violations.filter(v => v.timestamp >= oneWeekAgo);

    // 가장 흔한 위반 타입
    const violationCounts: Record<string, number> = {};
    recentViolations.forEach(violation => {
      violationCounts[violation.type] = (violationCounts[violation.type] || 0) + 1;
    });

    const mostCommonViolations = Object.entries(violationCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 상위 공격 소스
    const ipCounts: Record<string, number> = {};
    recentViolations.forEach(violation => {
      if (violation.ipAddress) {
        ipCounts[violation.ipAddress] = (ipCounts[violation.ipAddress] || 0) + 1;
      }
    });

    const topAttackSources = Object.entries(ipCounts)
      .map(([ipAddress, count]) => ({ ipAddress, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 공격 트렌드 (일별)
    const dailyCounts: Record<string, number> = {};
    recentViolations.forEach(violation => {
      const date = violation.timestamp.toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    const attackTrends = Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      mostCommonViolations,
      topAttackSources,
      attackTrends,
    };
  }

  /**
   * 보안 권장사항 생성
   */
  generateSecurityRecommendations(): string[] {
    const recommendations: string[] = [];
    const patterns = this.analyzeSecurityPatterns();

    // Rate limiting 권장사항
    if (patterns.mostCommonViolations.some(v => v.type === 'rate_limit' && v.count > 10)) {
      recommendations.push('Rate limiting 임계값을 낮추거나 윈도우 시간을 늘려보세요.');
    }

    // XSS 공격 권장사항
    if (patterns.mostCommonViolations.some(v => v.type === 'xss_attempt' && v.count > 5)) {
      recommendations.push('입력 검증을 강화하고 Content Security Policy를 설정하세요.');
    }

    // CSRF 공격 권장사항
    if (patterns.mostCommonViolations.some(v => v.type === 'csrf_attempt' && v.count > 3)) {
      recommendations.push('CSRF 토큰 검증을 강화하고 SameSite 쿠키를 설정하세요.');
    }

    // IP 차단 권장사항
    if (patterns.topAttackSources.some(s => s.count > 20)) {
      recommendations.push('자동 IP 차단 시스템을 구현하세요.');
    }

    return recommendations;
  }

  /**
   * 보안 위반 로그 조회
   */
  getViolations(
    filters?: {
      type?: SecurityViolation['type'];
      severity?: SecurityViolation['severity'];
      userId?: string;
      ipAddress?: string;
      startDate?: Date;
      endDate?: Date;
    },
    limit: number = 100
  ): SecurityViolation[] {
    let filteredViolations = [...this.violations];

    if (filters?.type) {
      filteredViolations = filteredViolations.filter(v => v.type === filters.type);
    }

    if (filters?.severity) {
      filteredViolations = filteredViolations.filter(v => v.severity === filters.severity);
    }

    if (filters?.userId) {
      filteredViolations = filteredViolations.filter(v => v.userId === filters.userId);
    }

    if (filters?.ipAddress) {
      filteredViolations = filteredViolations.filter(v => v.ipAddress === filters.ipAddress);
    }

    if (filters?.startDate) {
      filteredViolations = filteredViolations.filter(v => v.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      filteredViolations = filteredViolations.filter(v => v.timestamp <= filters.endDate!);
    }

    return filteredViolations
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * 보안 위반 로그 초기화
   */
  clearViolations(): void {
    this.violations = [];
    this.rateLimitStore.clear();
  }

  private generateSecureToken(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateViolationId(): string {
    return `violation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 