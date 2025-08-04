export interface ChannelInvitationItem {
  id: string;
  inviterId: string;
  inviteeId: string;
  channelId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  inviterName?: string;
  channelName?: string;
}

export interface InviteState {
  isLoading: boolean;
  isInviting: boolean;
  error: string | null;
  partnerEmail: string;
  invitations: ChannelInvitationItem[];
  currentInvitation: ChannelInvitationItem | null;
}

export interface InviteRequest {
  partnerEmail: string;
  channelId?: string;
  message?: string;
}

export interface InviteResponse {
  success: boolean;
  invitationId?: string;
  message: string;
  error?: string;
}

export interface InvitationResponseRequest {
  invitationId: string;
  accepted: boolean;
  message?: string;
}

export interface InvitationResponseResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface InviteValidationError {
  field: string;
  message: string;
}

export interface InviteStats {
  totalInvitations: number;
  pendingInvitations: number;
  acceptedInvitations: number;
  rejectedInvitations: number;
} 