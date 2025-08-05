import type { 
  ChannelInvitationItem, 
  InviteRequest, 
  InviteResponse,
  InvitationResponseRequest,
  InvitationResponseResponse,
  InviteValidationError,
  InviteStats
} from '../../../domain/types/invite';
import type { IInviteRepository } from '../interfaces/IInviteRepository';
import type { IInviteService } from '../interfaces/IInviteService';
import type { ICache } from '../interfaces/ICache';
import { BUSINESS_RULES, ERROR_MESSAGES, CACHE_TTL } from '../constants/InviteConstants';
import { MemoryCache } from '../cache/MemoryCache';

// Service 구현체
export class InviteService implements IInviteService {
  private cache: ICache;
  private permissionCache = new Map<string, { hasPermission: boolean; expires: number }>();

  constructor(
    private inviteRepository: IInviteRepository,
    cache?: ICache
  ) {
    this.cache = cache || new MemoryCache();
  }

  async sendInvitation(request: InviteRequest): Promise<InviteResponse> {
    try {
      // 비즈니스 로직 검증
      const validationErrors = this.validateInviteRequest(request);
      if (validationErrors.length > 0) {
        return this.createErrorResponse(validationErrors[0].message, 'VALIDATION_ERROR');
      }

      // 사용자 권한 확인 (캐시 활용)
      const hasPermission = await this.checkUserPermissions(request.senderId);
      if (!hasPermission) {
        return this.createErrorResponse(ERROR_MESSAGES.PERMISSION.DENIED, 'PERMISSION_DENIED');
      }

      // 초대 제한 확인
      const canSendInvitation = await this.checkInvitationLimit(request.senderId);
      if (!canSendInvitation) {
        return this.createErrorResponse(ERROR_MESSAGES.LIMIT.EXCEEDED, 'LIMIT_EXCEEDED');
      }

      // 메시지 포맷팅
      const formattedRequest = {
        ...request,
        message: this.formatInvitationMessage(request.partnerEmail, request.message)
      };

      const response = await this.inviteRepository.sendInvitation(formattedRequest);
      
      // 성공 시 캐시 무효화
      if (response.success) {
        this.invalidateUserCache(request.senderId);
      }

      return response;
    } catch (error) {
      console.error('Failed to send invitation:', error);
      return this.createErrorResponse(ERROR_MESSAGES.OPERATION.SEND_FAILED, 'SEND_FAILED');
    }
  }

  async getInvitations(userId: string): Promise<ChannelInvitationItem[]> {
    if (!userId) {
      throw new Error(ERROR_MESSAGES.VALIDATION.USER_ID_REQUIRED);
    }

    try {
      // 캐시 확인
      const cacheKey = `invitations:${userId}`;
      const cached = this.cache.get<ChannelInvitationItem[]>(cacheKey);
      if (cached) {
        return this.filterExpiredInvitations(cached);
      }

      const invitations = await this.inviteRepository.getInvitations(userId);
      const validInvitations = this.filterExpiredInvitations(invitations);
      
      // 캐시 저장
      this.cache.set(cacheKey, validInvitations, CACHE_TTL.INVITATIONS);
      
      return validInvitations;
    } catch (error) {
      console.error('Failed to get invitations:', error);
      throw new Error(ERROR_MESSAGES.OPERATION.GET_FAILED);
    }
  }

  async respondToInvitation(request: InvitationResponseRequest): Promise<InvitationResponseResponse> {
    if (!request.invitationId) {
      return this.createErrorResponse(ERROR_MESSAGES.VALIDATION.INVITATION_ID_REQUIRED, 'INVALID_INVITATION_ID');
    }

    try {
      const response = await this.inviteRepository.respondToInvitation(request);
      const processedResponse = await this.processInvitationResponse(response);
      
      // 응답 처리 후 관련 캐시 무효화
      if (processedResponse.success) {
        this.invalidateInvitationCache(request.invitationId);
      }
      
      return processedResponse;
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
      return this.createErrorResponse(ERROR_MESSAGES.OPERATION.RESPONSE_FAILED, 'RESPONSE_FAILED');
    }
  }

  async getInvitationStats(userId: string): Promise<InviteStats> {
    if (!userId) {
      throw new Error(ERROR_MESSAGES.VALIDATION.USER_ID_REQUIRED);
    }

    try {
      // 캐시 확인
      const cacheKey = `stats:${userId}`;
      const cached = this.cache.get<InviteStats>(cacheKey);
      if (cached) {
        return cached;
      }

      const stats = await this.inviteRepository.getInvitationStats(userId);
      const enhancedStats = this.enhanceStatsData(stats);
      
      // 캐시 저장
      this.cache.set(cacheKey, enhancedStats, CACHE_TTL.STATS);
      
      return enhancedStats;
    } catch (error) {
      console.error('Failed to get invitation stats:', error);
      throw new Error(ERROR_MESSAGES.OPERATION.STATS_FAILED);
    }
  }

  async cancelInvitation(invitationId: string): Promise<boolean> {
    if (!invitationId) {
      throw new Error(ERROR_MESSAGES.VALIDATION.INVITATION_ID_REQUIRED);
    }

    try {
      const result = await this.inviteRepository.cancelInvitation(invitationId);
      
      // 성공 시 캐시 무효화
      if (result) {
        this.invalidateInvitationCache(invitationId);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
      throw new Error(ERROR_MESSAGES.OPERATION.CANCEL_FAILED);
    }
  }

  validateInviteRequest(request: InviteRequest): InviteValidationError[] {
    const errors: InviteValidationError[] = [];

    // 이메일 유효성 검사
    if (!request.partnerEmail?.trim()) {
      errors.push({
        field: 'partnerEmail',
        message: ERROR_MESSAGES.VALIDATION.EMAIL_REQUIRED
      });
    } else if (!this.validateEmail(request.partnerEmail)) {
      errors.push({
        field: 'partnerEmail',
        message: ERROR_MESSAGES.VALIDATION.EMAIL_INVALID
      });
    }

    // 메시지 길이 검사
    if (request.message && request.message.length > BUSINESS_RULES.MAX_MESSAGE_LENGTH) {
      errors.push({
        field: 'message',
        message: ERROR_MESSAGES.VALIDATION.MESSAGE_TOO_LONG
      });
    }

    return errors;
  }

  validateEmail(email: string): boolean {
    return BUSINESS_RULES.EMAIL_REGEX.test(email.trim());
  }

  formatInvitationMessage(email: string, message?: string): string {
    const defaultMessage = `${email}님을 초대합니다. 함께 대화를 나누어보세요!`;
    return message?.trim() || defaultMessage;
  }

  async checkInvitationLimit(userId: string): Promise<boolean> {
    try {
      const stats = await this.getInvitationStats(userId);
      return (stats.todaySent || 0) < BUSINESS_RULES.MAX_DAILY_INVITATIONS;
    } catch (error) {
      console.error('Failed to check invitation limit:', error);
      return false;
    }
  }

  async checkUserPermissions(userId: string): Promise<boolean> {
    // 권한 캐시 확인
    const cached = this.permissionCache.get(userId);
    if (cached && cached.expires > Date.now()) {
      return cached.hasPermission;
    }

    try {
      // 실제 권한 확인 로직 (예시)
      const hasPermission = await this.validateUserStatus(userId);
      
      // 권한 캐시 저장
      this.permissionCache.set(userId, {
        hasPermission,
        expires: Date.now() + CACHE_TTL.PERMISSIONS
      });
      
      return hasPermission;
    } catch (error) {
      console.error('Failed to check user permissions:', error);
      return false;
    }
  }

  async processInvitationResponse(response: InvitationResponseResponse): Promise<InvitationResponseResponse> {
    if (response.success) {
      // 비즈니스 로직: 초대 응답 처리 후 추가 작업
      await this.handleSuccessfulResponse(response);
    }
    
    return response;
  }

  // Private helper methods
  private createErrorResponse(message: string, error: string): InviteResponse {
    return {
      success: false,
      message,
      error
    };
  }

  private filterExpiredInvitations(invitations: ChannelInvitationItem[]): ChannelInvitationItem[] {
    const now = new Date();
    return invitations.filter(invitation => {
      const expirationDate = new Date(invitation.expiresAt);
      return expirationDate > now;
    });
  }

  private enhanceStatsData(stats: InviteStats): InviteStats {
    return {
      ...stats,
      acceptanceRate: stats.totalSent > 0 ? (stats.accepted / stats.totalSent) * 100 : 0,
      averageResponseTime: this.calculateAverageResponseTime(stats)
    };
  }

  private calculateAverageResponseTime(stats: InviteStats): number {
    if (stats.accepted === 0) return 0;
    // 실제 구현에서는 응답 시간 데이터를 사용
    return BUSINESS_RULES.DEFAULT_EXPIRATION_HOURS;
  }

  private async validateUserStatus(userId: string): Promise<boolean> {
    // 실제 구현에서는 사용자 상태, 역할 등을 확인
    // 예시: 활성 사용자만 초대 가능
    return true;
  }

  private async handleSuccessfulResponse(response: InvitationResponseResponse): Promise<void> {
    // 예시: 알림 발송, 통계 업데이트 등
    console.log('Invitation response processed successfully');
  }

  private invalidateUserCache(userId: string): void {
    this.cache.delete(`invitations:${userId}`);
    this.cache.delete(`stats:${userId}`);
    this.permissionCache.delete(userId);
  }

  private invalidateInvitationCache(invitationId: string): void {
    // 관련된 모든 캐시 무효화
    this.cache.delete(`invitation:${invitationId}`);
  }
} 