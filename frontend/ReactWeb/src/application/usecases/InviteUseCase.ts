import type { 
  ChannelInvitationItem, 
  InviteRequest, 
  InviteResponse,
  InvitationResponseRequest,
  InvitationResponseResponse,
  InviteValidationError,
  InviteStats
} from '../../domain/types/invite';

// Repository 인터페이스 - 데이터 접근만 담당
export interface IInviteRepository {
  sendInvitation(request: InviteRequest): Promise<InviteResponse>;
  getInvitations(userId: string): Promise<ChannelInvitationItem[]>;
  respondToInvitation(request: InvitationResponseRequest): Promise<InvitationResponseResponse>;
  getInvitationStats(userId: string): Promise<InviteStats>;
  cancelInvitation(invitationId: string): Promise<boolean>;
}

// Service 인터페이스 - 비즈니스 로직 담당
export interface IInviteService {
  sendInvitation(request: InviteRequest): Promise<InviteResponse>;
  getInvitations(userId: string): Promise<ChannelInvitationItem[]>;
  respondToInvitation(request: InvitationResponseRequest): Promise<InvitationResponseResponse>;
  getInvitationStats(userId: string): Promise<InviteStats>;
  cancelInvitation(invitationId: string): Promise<boolean>;
  validateInviteRequest(request: InviteRequest): InviteValidationError[];
  validateEmail(email: string): boolean;
  formatInvitationMessage(email: string, message?: string): string;
  checkInvitationLimit(userId: string): Promise<boolean>;
  checkUserPermissions(userId: string): Promise<boolean>;
  processInvitationResponse(response: InvitationResponseResponse): Promise<InvitationResponseResponse>;
}

// UseCase 인터페이스 - 애플리케이션 로직 조율
export interface IInviteUseCase {
  sendInvitation(request: InviteRequest): Promise<InviteResponse>;
  getInvitations(userId: string): Promise<ChannelInvitationItem[]>;
  respondToInvitation(request: InvitationResponseRequest): Promise<InvitationResponseResponse>;
  getInvitationStats(userId: string): Promise<InviteStats>;
  cancelInvitation(invitationId: string): Promise<boolean>;
  validateInviteRequest(request: InviteRequest): InviteValidationError[];
  validateEmail(email: string): boolean;
  formatInvitationMessage(email: string, message?: string): string;
}

// Service 구현체
export class InviteService implements IInviteService {
  constructor(private inviteRepository: IInviteRepository) {}

  async sendInvitation(request: InviteRequest): Promise<InviteResponse> {
    // 비즈니스 로직 검증
    const validationErrors = this.validateInviteRequest(request);
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: validationErrors[0].message,
        error: 'VALIDATION_ERROR'
      };
    }

    // 사용자 권한 확인
    const hasPermission = await this.checkUserPermissions(request.senderId);
    if (!hasPermission) {
      return {
        success: false,
        message: '초대를 보낼 권한이 없습니다.',
        error: 'PERMISSION_DENIED'
      };
    }

    // 초대 제한 확인
    const canSendInvitation = await this.checkInvitationLimit(request.senderId);
    if (!canSendInvitation) {
      return {
        success: false,
        message: '오늘 초대 가능한 횟수를 초과했습니다.',
        error: 'LIMIT_EXCEEDED'
      };
    }

    try {
      // 메시지 포맷팅
      const formattedRequest = {
        ...request,
        message: this.formatInvitationMessage(request.partnerEmail, request.message)
      };

      return await this.inviteRepository.sendInvitation(formattedRequest);
    } catch (error) {
      console.error('Failed to send invitation:', error);
      return {
        success: false,
        message: '초대 발송에 실패했습니다.',
        error: 'SEND_FAILED'
      };
    }
  }

  async getInvitations(userId: string): Promise<ChannelInvitationItem[]> {
    if (!userId) {
      throw new Error('사용자 ID가 필요합니다.');
    }

    try {
      const invitations = await this.inviteRepository.getInvitations(userId);
      
      // 비즈니스 로직: 만료된 초대 필터링
      const validInvitations = invitations.filter(invitation => {
        const expirationDate = new Date(invitation.expiresAt);
        return expirationDate > new Date();
      });

      return validInvitations;
    } catch (error) {
      console.error('Failed to get invitations:', error);
      throw new Error('초대장을 불러오는데 실패했습니다.');
    }
  }

  async respondToInvitation(request: InvitationResponseRequest): Promise<InvitationResponseResponse> {
    if (!request.invitationId) {
      return {
        success: false,
        message: '초대장 ID가 필요합니다.',
        error: 'INVALID_INVITATION_ID'
      };
    }

    try {
      const response = await this.inviteRepository.respondToInvitation(request);
      return await this.processInvitationResponse(response);
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
      return {
        success: false,
        message: '초대 응답에 실패했습니다.',
        error: 'RESPONSE_FAILED'
      };
    }
  }

  async getInvitationStats(userId: string): Promise<InviteStats> {
    if (!userId) {
      throw new Error('사용자 ID가 필요합니다.');
    }

    try {
      const stats = await this.inviteRepository.getInvitationStats(userId);
      
      // 비즈니스 로직: 통계 데이터 가공
      return {
        ...stats,
        acceptanceRate: stats.totalSent > 0 ? (stats.accepted / stats.totalSent) * 100 : 0,
        averageResponseTime: this.calculateAverageResponseTime(stats)
      };
    } catch (error) {
      console.error('Failed to get invitation stats:', error);
      throw new Error('초대 통계를 불러오는데 실패했습니다.');
    }
  }

  async cancelInvitation(invitationId: string): Promise<boolean> {
    if (!invitationId) {
      throw new Error('초대장 ID가 필요합니다.');
    }

    try {
      return await this.inviteRepository.cancelInvitation(invitationId);
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
      throw new Error('초대 취소에 실패했습니다.');
    }
  }

  validateInviteRequest(request: InviteRequest): InviteValidationError[] {
    const errors: InviteValidationError[] = [];

    // 이메일 유효성 검사
    if (!request.partnerEmail || !request.partnerEmail.trim()) {
      errors.push({
        field: 'partnerEmail',
        message: '파트너의 이메일 주소를 입력해주세요.'
      });
    } else if (!this.validateEmail(request.partnerEmail)) {
      errors.push({
        field: 'partnerEmail',
        message: '유효한 이메일 주소를 입력해주세요.'
      });
    }

    // 메시지 길이 검사
    if (request.message && request.message.length > 500) {
      errors.push({
        field: 'message',
        message: '메시지는 500자 이내로 입력해주세요.'
      });
    }

    return errors;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  formatInvitationMessage(email: string, message?: string): string {
    const defaultMessage = `${email}님을 초대합니다. 함께 대화를 나누어보세요!`;
    return message || defaultMessage;
  }

  async checkInvitationLimit(userId: string): Promise<boolean> {
    try {
      const stats = await this.inviteRepository.getInvitationStats(userId);
      const todayInvitations = stats.todaySent || 0;
      const maxDailyInvitations = 10; // 비즈니스 규칙
      
      return todayInvitations < maxDailyInvitations;
    } catch (error) {
      console.error('Failed to check invitation limit:', error);
      return false;
    }
  }

  async checkUserPermissions(userId: string): Promise<boolean> {
    // 비즈니스 로직: 사용자 권한 확인
    // 실제 구현에서는 사용자 상태, 역할 등을 확인
    try {
      // 예시: 활성 사용자만 초대 가능
      return true; // 실제로는 사용자 상태를 확인해야 함
    } catch (error) {
      console.error('Failed to check user permissions:', error);
      return false;
    }
  }

  async processInvitationResponse(response: InvitationResponseResponse): Promise<InvitationResponseResponse> {
    // 비즈니스 로직: 초대 응답 처리 후 추가 작업
    if (response.success) {
      // 예시: 알림 발송, 통계 업데이트 등
      console.log('Invitation response processed successfully');
    }
    
    return response;
  }

  private calculateAverageResponseTime(stats: InviteStats): number {
    // 비즈니스 로직: 평균 응답 시간 계산
    if (stats.accepted === 0) return 0;
    
    // 실제 구현에서는 응답 시간 데이터를 사용
    return 24; // 예시: 24시간
  }
}

// UseCase 구현체 - Service를 사용하여 애플리케이션 로직 조율
export class InviteUseCase implements IInviteUseCase {
  constructor(private inviteService: IInviteService) {}

  async sendInvitation(request: InviteRequest): Promise<InviteResponse> {
    return await this.inviteService.sendInvitation(request);
  }

  async getInvitations(userId: string): Promise<ChannelInvitationItem[]> {
    return await this.inviteService.getInvitations(userId);
  }

  async respondToInvitation(request: InvitationResponseRequest): Promise<InvitationResponseResponse> {
    return await this.inviteService.respondToInvitation(request);
  }

  async getInvitationStats(userId: string): Promise<InviteStats> {
    return await this.inviteService.getInvitationStats(userId);
  }

  async cancelInvitation(invitationId: string): Promise<boolean> {
    return await this.inviteService.cancelInvitation(invitationId);
  }

  validateInviteRequest(request: InviteRequest): InviteValidationError[] {
    return this.inviteService.validateInviteRequest(request);
  }

  validateEmail(email: string): boolean {
    return this.inviteService.validateEmail(email);
  }

  formatInvitationMessage(email: string, message?: string): string {
    return this.inviteService.formatInvitationMessage(email, message);
  }
}

// 의존성 주입을 위한 팩토리 함수
export const createInviteUseCase = (repository: IInviteRepository): IInviteUseCase => {
  const service = new InviteService(repository);
  return new InviteUseCase(service);
};

// 테스트를 위한 Mock 팩토리
export const createMockInviteUseCase = (): IInviteUseCase => {
  const mockRepository: IInviteRepository = {
    sendInvitation: async () => ({ success: false, message: 'Mock response' }),
    getInvitations: async () => [],
    respondToInvitation: async () => ({ success: false, message: 'Mock response' }),
    getInvitationStats: async () => ({ 
      totalInvitations: 0, 
      pendingInvitations: 0, 
      acceptedInvitations: 0, 
      rejectedInvitations: 0,
      totalSent: 0,
      accepted: 0,
      todaySent: 0
    }),
    cancelInvitation: async () => false,
  };
  
  return createInviteUseCase(mockRepository);
}; 