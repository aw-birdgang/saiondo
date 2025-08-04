import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getContainer } from '../../../app/di/container';
import { DI_TOKENS } from '../../../app/di/tokens';
import { useInvite } from '../../hooks/useInvite';
import { useAuthStore } from '../../../stores/authStore';
import { useToastContext } from '../../providers/ToastProvider';
import { Header, ContentCard } from '../../components/common';
import { PageWrapper, PageContainer } from '../../components/layout';
import { InviteForm } from '../../components/invite';
import type { IInviteUseCase } from '../../../application/usecases/InviteUseCase';

const InvitePartnerPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const toast = useToastContext();
  const container = getContainer();

  // Invite Use Case 가져오기
  const [inviteUseCase] = useState<IInviteUseCase>(() => 
    container.get<IInviteUseCase>(DI_TOKENS.INVITE_USE_CASE)
  );

  // Invite 상태 관리 훅
  const {
    state,
    inviteStats,
    updatePartnerEmail,
    sendInvitation,
    clearError,
    reset
  } = useInvite(inviteUseCase, user?.id);

  // 에러 처리
  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      clearError();
    }
  }, [state.error, toast, clearError]);

  return (
    <PageWrapper>
      {/* Header */}
      <Header
        title={t('invite_partner') || '파트너 초대'}
        showBackButton
        className="max-w-4xl mx-auto"
      />

      {/* Content */}
      <PageContainer maxWidth="2xl" padding="lg">
        <ContentCard variant="elevated" padding="xl" className="rounded-3xl">
          <InviteForm
            partnerEmail={state.partnerEmail}
            onEmailChange={updatePartnerEmail}
            onInvite={sendInvitation}
            isLoading={state.isInviting}
            error={state.error}
          />
        </ContentCard>
      </PageContainer>
    </PageWrapper>
  );
};

export default InvitePartnerPage;
