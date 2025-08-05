import type {
  ChannelInvitationItem,
  InviteRequest,
  InviteResponse,
  InvitationResponseRequest,
  InvitationResponseResponse,
  InviteValidationError,
  InviteStats,
} from '../../../domain/types/invite';

// Service 인터페이스 - 비즈니스 로직 담당
export interface IInviteService {
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
  checkInvitationLimit(userId: string): Promise<boolean>;
  checkUserPermissions(userId: string): Promise<boolean>;
  processInvitationResponse(
    response: InvitationResponseResponse
  ): Promise<InvitationResponseResponse>;
}
