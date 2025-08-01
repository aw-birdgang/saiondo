import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from "../../../shared/constants/app";
import { useAuthStore } from "../../../stores/authStore";
import { LoadingState, InvitationList, InvitationResponseCard } from '../../components/specific';
import { PageHeader, PageContainer } from '../../components/layout';
import { RefreshButton, EmptyInvitationsState, InvitationPageContainer, InvitationGrid } from '../../components/common';

interface ChannelInvitation {
  id: string;
  inviterId: string;
  inviteeId: string;
  channelId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  inviterName?: string;
  channelName?: string;
}

const ChannelInvitationScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [invitations, setInvitations] = useState<ChannelInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      // TODO: 실제 API 호출로 대체
      // const response = await getChannelInvitations(userId);
      
      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock 데이터
      const mockInvitations: ChannelInvitation[] = [
        {
          id: '1',
          inviterId: 'user1',
          inviteeId: user?.id || 'current-user',
          channelId: 'channel1',
          status: 'pending',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
          inviterName: '김철수',
          channelName: '우리만의 채널',
        },
        {
          id: '2',
          inviterId: 'user2',
          inviteeId: user?.id || 'current-user',
          channelId: 'channel2',
          status: 'accepted',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
          inviterName: '이영희',
          channelName: '커플 채널',
        },
        {
          id: '3',
          inviterId: 'user3',
          inviteeId: user?.id || 'current-user',
          channelId: 'channel3',
          status: 'rejected',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2일 전
          inviterName: '박민수',
          channelName: '친구 채널',
        },
      ];
      
      setInvitations(mockInvitations);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
      toast.error(t('failed_to_load_invitations') || '초대장을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespondToInvitation = async (invitationId: string, accepted: boolean) => {
    try {
      // TODO: 실제 API 호출로 대체
      // await respondToInvitation(invitationId, accepted, userId);
      
      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setInvitations(prev =>
        prev.map(invitation =>
          invitation.id === invitationId
            ? { ...invitation, status: accepted ? 'accepted' : 'rejected' }
            : invitation
        )
      );
      
      toast.success(
        accepted 
          ? t('invitation_accepted') || '초대를 수락했습니다!'
          : t('invitation_rejected') || '초대를 거절했습니다.'
      );
      
      if (accepted) {
        // 채널로 이동
        navigate(ROUTES.CHANNELS);
      }
      
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
      toast.error(t('failed_to_respond') || '초대 응답에 실패했습니다.');
    }
  };



  if (isLoading) {
    return (
      <LoadingState message={t('loading_invitations') || '초대장을 불러오는 중...'} />
    );
  }

  return (
    <InvitationPageContainer>
      {/* Header */}
      <PageHeader
        title={t('channel_invitations') || '채널 초대장'}
        showBackButton
        rightContent={
          invitations.length > 0 && (
            <RefreshButton onClick={fetchInvitations} />
          )
        }
      />

      {/* Content */}
      <PageContainer>
        {invitations.length === 0 ? (
          <EmptyInvitationsState />
        ) : (
          <InvitationGrid>
            {invitations.map((invitation) => (
              <InvitationResponseCard
                key={invitation.id}
                invitation={invitation}
                onAccept={(invitationId) => handleRespondToInvitation(invitationId, true)}
                onReject={(invitationId) => handleRespondToInvitation(invitationId, false)}
              />
            ))}
          </InvitationGrid>
        )}
      </PageContainer>
    </InvitationPageContainer>
  );
};

export default ChannelInvitationScreen;
