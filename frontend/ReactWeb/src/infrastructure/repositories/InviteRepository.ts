import type { 
  ChannelInvitationItem, 
  InviteRequest, 
  InviteResponse,
  InvitationResponseRequest,
  InvitationResponseResponse,
  InviteStats
} from '../../domain/types/invite';
import type { IInviteRepository } from '../../application/usecases/interfaces/IInviteRepository';

export class InviteRepository implements IInviteRepository {
  async sendInvitation(request: InviteRequest): Promise<InviteResponse> {
    // 초대 발송 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 성공 확률 90%로 시뮬레이션
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      return {
        success: true,
        invitationId: `INV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: '초대가 성공적으로 발송되었습니다.'
      };
    } else {
      return {
        success: false,
        message: '초대 발송에 실패했습니다. 다시 시도해주세요.',
        error: 'SEND_FAILED'
      };
    }
  }

  async getInvitations(userId: string): Promise<ChannelInvitationItem[]> {
    // 초대장 목록 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock 데이터
    const mockInvitations: ChannelInvitationItem[] = [
      {
        id: '1',
        inviterId: 'user1',
        inviteeId: userId,
        channelId: 'channel1',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7일 후 만료
        inviterName: '김철수',
        channelName: '우리만의 채널',
      },
      {
        id: '2',
        inviterId: 'user2',
        inviteeId: userId,
        channelId: 'channel2',
        status: 'accepted',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7일 후 만료
        inviterName: '이영희',
        channelName: '커플 채널',
      },
      {
        id: '3',
        inviterId: 'user3',
        inviteeId: userId,
        channelId: 'channel3',
        status: 'rejected',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2일 전
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7일 후 만료
        inviterName: '박민수',
        channelName: '친구 채널',
      },
    ];

    return mockInvitations;
  }

  async respondToInvitation(request: InvitationResponseRequest): Promise<InvitationResponseResponse> {
    // 초대 응답 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));

    // 성공 확률 95%로 시뮬레이션
    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      return {
        success: true,
        message: request.accepted 
          ? '초대를 수락했습니다!' 
          : '초대를 거절했습니다.'
      };
    } else {
      return {
        success: false,
        message: '초대 응답에 실패했습니다. 다시 시도해주세요.',
        error: 'RESPONSE_FAILED'
      };
    }
  }

  async getInvitationStats(userId: string): Promise<InviteStats> {
    // 초대 통계 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));

    const invitations = await this.getInvitations(userId);
    
    const stats: InviteStats = {
      totalInvitations: invitations.length,
      pendingInvitations: invitations.filter(inv => inv.status === 'pending').length,
      acceptedInvitations: invitations.filter(inv => inv.status === 'accepted').length,
      rejectedInvitations: invitations.filter(inv => inv.status === 'rejected').length,
      totalSent: invitations.length,
      accepted: invitations.filter(inv => inv.status === 'accepted').length,
      todaySent: invitations.filter(inv => {
        const today = new Date();
        const inviteDate = new Date(inv.createdAt);
        return inviteDate.toDateString() === today.toDateString();
      }).length,
    };

    return stats;
  }

  async cancelInvitation(invitationId: string): Promise<boolean> {
    // 초대 취소 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));

    // 성공 확률 90%로 시뮬레이션
    const isSuccess = Math.random() > 0.1;

    return isSuccess;
  }
} 