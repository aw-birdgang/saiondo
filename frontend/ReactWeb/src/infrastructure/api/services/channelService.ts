import { apiClient } from '../ApiClient';
import { ENDPOINTS } from '../endpoints';
import type {
  Channel,
  Channels,
  ChannelInvitation,
} from '../../../domain/types';

export class ChannelService {
  async fetchAllChannels(): Promise<Channel[]> {
    try {
      const response = await apiClient.get<Channel[]>(ENDPOINTS.CHANNELS);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '채널 목록 조회 실패';
      throw new Error(`채널 목록 조회 실패: ${message}`);
    }
  }

  async fetchChannelById(channelId: string): Promise<Channel> {
    try {
      const response = await apiClient.get<Channel>(
        ENDPOINTS.CHANNEL_BY_ID(channelId)
      );
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '채널 조회 실패';
      throw new Error(`채널 조회 실패: ${message}`);
    }
  }

  async fetchChannelsByUserId(userId: string): Promise<Channels> {
    try {
      const response = await apiClient.get<Channels>(
        ENDPOINTS.CHANNEL_BY_USER_ID(userId)
      );

      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '사용자 채널 조회 실패';
      throw new Error(`사용자 채널 조회 실패: ${message}`);
    }
  }

  async createChannel(userId: string): Promise<Channel> {
    try {
      const response = await apiClient.post<Channel>(ENDPOINTS.CHANNELS, {
        userId,
      });
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '채널 생성 실패';
      throw new Error(`채널 생성 실패: ${message}`);
    }
  }

  async joinByInvite(inviteCode: string, userId: string): Promise<Channel> {
    try {
      const response = await apiClient.post<Channel>(ENDPOINTS.JOIN_BY_INVITE, {
        inviteCode,
        userId,
      });
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '초대코드로 채널 가입 실패';
      throw new Error(`초대코드로 채널 가입 실패: ${message}`);
    }
  }

  async leaveChannel(userId: string): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.LEAVE_CHANNEL, { userId });
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '채널 나가기 실패';
      throw new Error(`채널 나가기 실패: ${message}`);
    }
  }

  async addMember(channelId: string, userId: string): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.MEMBERS(channelId), { userId });
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '멤버 추가 실패';
      throw new Error(`멤버 추가 실패: ${message}`);
    }
  }

  async createInviteCode(
    channelId: string,
    userId: string
  ): Promise<{ inviteCode: string }> {
    try {
      const response = await apiClient.post<{ inviteCode: string }>(
        ENDPOINTS.INVITE_CODE(channelId),
        { channelId, userId }
      );
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '초대 코드 생성 실패';
      throw new Error(`초대 코드 생성 실패: ${message}`);
    }
  }

  async acceptInvitation(channelId: string, userId: string): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.ACCEPT(channelId), { userId });
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '초대 수락 실패';
      throw new Error(`초대 수락 실패: ${message}`);
    }
  }

  async rejectInvitation(channelId: string, userId: string): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.REJECT(channelId), { userId });
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '초대 거절 실패';
      throw new Error(`초대 거절 실패: ${message}`);
    }
  }

  async deleteChannel(channelId: string): Promise<void> {
    try {
      await apiClient.delete(ENDPOINTS.DELETE_CHANNEL(channelId));
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '채널 삭제 실패';
      throw new Error(`채널 삭제 실패: ${message}`);
    }
  }

  async isMember(channelId: string, userId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ isMember: boolean }>(
        ENDPOINTS.MEMBER_BY_ID(channelId, userId)
      );
      return response.isMember;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '멤버십 확인 실패';
      throw new Error(`멤버십 확인 실패: ${message}`);
    }
  }

  async cleanupEmptyChannels(): Promise<void> {
    try {
      await apiClient.delete(ENDPOINTS.CLEANUP);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '멤버 없는 채널 정리 실패';
      throw new Error(`멤버 없는 채널 정리 실패: ${message}`);
    }
  }

  async createInvitation(
    channelId: string,
    inviterId: string,
    inviteeId: string
  ): Promise<ChannelInvitation> {
    try {
      const response = await apiClient.post<ChannelInvitation>(
        ENDPOINTS.INVITE(channelId),
        {
          channelId,
          inviterId,
          inviteeId,
        }
      );
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '초대장 생성 실패';
      throw new Error(`초대장 생성 실패: ${message}`);
    }
  }

  async hasPendingInvitation(
    channelId: string,
    inviteeId: string
  ): Promise<boolean> {
    try {
      const response = await apiClient.get<{ hasPending: boolean }>(
        ENDPOINTS.HAS_PENDING_INVITATION(channelId, inviteeId)
      );
      return response.hasPending;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '초대장 상태 확인 실패';
      throw new Error(`초대장 상태 확인 실패: ${message}`);
    }
  }

  async fetchInvitationsForUser(userId: string): Promise<ChannelInvitation[]> {
    try {
      const response = await apiClient.get<ChannelInvitation[]>(
        ENDPOINTS.INVITATIONS_FOR_USER(userId)
      );
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '초대장 목록 조회 실패';
      throw new Error(`초대장 목록 조회 실패: ${message}`);
    }
  }

  async respondInvitation(
    invitationId: string,
    response: 'ACCEPT' | 'REJECT'
  ): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.RESPOND_INVITATION(invitationId), {
        response,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '초대장 응답 실패';
      throw new Error(`초대장 응답 실패: ${message}`);
    }
  }
}

export const channelService = new ChannelService();
