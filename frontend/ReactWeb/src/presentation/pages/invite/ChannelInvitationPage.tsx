import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getContainer } from '../../../di/container';
import { DI_TOKENS } from '../../../di/tokens';
import { useInvite } from '../../hooks/useInvite';
import { useAuthStore } from '../../../stores/authStore';
import { useToastContext } from '../../providers/ToastProvider';
import { PageHeader } from '../../components/layout';
import { Container, RefreshButton } from '../../components/common';
import { InvitationList, InviteStats } from '../../components/invite';
import type { InviteUseCase } from '../../../application/usecases/InviteUseCase';

const ChannelInvitationPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const toast = useToastContext();
  const container = getContainer();

  // Invite Use Case 가져오기
      const [inviteUseCase] = useState<InviteUseCase>(() =>
    container.get<InviteUseCase>(DI_TOKENS.INVITE_USE_CASE)
  );

  // Invite 상태 관리 훅
  const {
    state,
    inviteStats,
    loadInvitations,
    respondToInvitation,
    cancelInvitation,
    clearError,
    // reset,
  } = useInvite(inviteUseCase, user?.id);

  // 에러 처리
  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      clearError();
    }
  }, [state.error, toast, clearError]);

  return (
    <Container variant='page'>
      {/* Header */}
      <Container variant='header'>
        <PageHeader
          title={t('channel_invitations') || '채널 초대장'}
          showBackButton
          rightContent={
            (state.invitations?.length || 0) > 0 && (
              <RefreshButton onClick={loadInvitations} />
            )
          }
        />
      </Container>

      {/* Content */}
      <Container variant='content'>
        {/* 통계 */}
        {state.invitations.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-lg font-medium text-txt mb-4'>초대장 통계</h3>
            <InviteStats stats={inviteStats} />
          </div>
        )}

        {/* 초대장 목록 */}
        <InvitationList
          invitations={state.invitations}
          isLoading={state.isLoading}
          onAccept={invitationId => respondToInvitation(invitationId, true)}
          onReject={invitationId => respondToInvitation(invitationId, false)}
          onCancel={cancelInvitation}
        />
      </Container>
    </Container>
  );
};

export default ChannelInvitationPage;
