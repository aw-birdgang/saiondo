import type { 
  ChannelInvitationItem, 
  InviteRequest, 
  InviteResponse,
  InvitationResponseRequest,
  InvitationResponseResponse,
  InviteValidationError,
  InviteStats
} from '../../domain/types/invite';

export interface IInviteRepository {
  sendInvitation(request: InviteRequest): Promise<InviteResponse>;
  getInvitations(userId: string): Promise<ChannelInvitationItem[]>;
  respondToInvitation(request: InvitationResponseRequest): Promise<InvitationResponseResponse>;
  getInvitationStats(userId: string): Promise<InviteStats>;
  cancelInvitation(invitationId: string): Promise<boolean>;
}

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

export class InviteUseCase implements IInviteUseCase {
  constructor(private inviteRepository: IInviteRepository) {}

  async sendInvitation(request: InviteRequest): Promise<InviteResponse> {
    // 초대 요청 유효성 검사
    const validationErrors = this.validateInviteRequest(request);
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: validationErrors[0].message,
        error: 'VALIDATION_ERROR'
      };
    }

    try {
      return await this.inviteRepository.sendInvitation(request);
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
      return await this.inviteRepository.getInvitations(userId);
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
      return await this.inviteRepository.respondToInvitation(request);
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
      return await this.inviteRepository.getInvitationStats(userId);
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
} 