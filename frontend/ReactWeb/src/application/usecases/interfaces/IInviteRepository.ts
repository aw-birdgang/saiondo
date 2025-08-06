import type {
  ChannelInvitationItem,
  InviteRequest,
  InviteResponse,
  InvitationResponseRequest,
  InvitationResponseResponse,
  InviteStats,
} from '@/domain/types/invite';

// Repository 인터페이스 - 데이터 접근만 담당
export interface IInviteRepository {
  sendInvitation(request: InviteRequest): Promise<InviteResponse>;
  getInvitations(userId: string): Promise<ChannelInvitationItem[]>;
  respondToInvitation(
    request: InvitationResponseRequest
  ): Promise<InvitationResponseResponse>;
  getInvitationStats(userId: string): Promise<InviteStats>;
  cancelInvitation(invitationId: string): Promise<boolean>;
}
