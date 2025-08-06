import type {
  ChannelInvitationItem,
  InviteRequest,
  InviteResponse,
  InvitationResponseRequest,
  InvitationResponseResponse,
  InviteValidationError,
  InviteStats,
} from '@/domain/types/invite';

// UseCase 인터페이스 - 애플리케이션 로직 조율
export interface IInviteUseCase {
  sendInvitation(request: InviteRequest): Promise<InviteResponse>;
  getInvitations(userId: string): Promise<ChannelInvitationItem[]>;
  respondToInvitation(
    request: InvitationResponseRequest
  ): Promise<InvitationResponseResponse>;
  getInvitationStats(userId: string): Promise<InviteStats>;
  cancelInvitation(invitationId: string): Promise<boolean>;
  validateInviteRequest(request: InviteRequest): InviteValidationError[];
  validateEmail(email: string): boolean;
  formatInvitationMessage(email: string, message?: string): string;
}
