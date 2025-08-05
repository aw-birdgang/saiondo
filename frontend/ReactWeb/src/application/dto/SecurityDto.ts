/**
 * Security Use Case DTOs
 * 보안 관련 Request/Response 인터페이스
 */

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
  type:
    | 'rate_limit'
    | 'xss_attempt'
    | 'csrf_attempt'
    | 'invalid_input'
    | 'unauthorized_access';
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

export interface InputValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export interface SecurityPatternAnalysis {
  mostCommonViolations: Array<{ type: string; count: number }>;
  topAttackSources: Array<{ ipAddress: string; count: number }>;
  attackTrends: Array<{ date: string; count: number }>;
}

export interface SecurityViolationFilters {
  type?: SecurityViolation['type'];
  severity?: SecurityViolation['severity'];
  userId?: string;
  ipAddress?: string;
  startDate?: Date;
  endDate?: Date;
}
