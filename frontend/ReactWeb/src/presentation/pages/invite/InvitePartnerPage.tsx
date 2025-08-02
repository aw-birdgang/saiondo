import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from "../../../shared/constants/app";
import { useAuthStore } from '../../../stores/authStore';
import { Header, ContentCard } from '../../components/common';
import { PageWrapper, PageContainer } from '../../components/layout';
import { InviteForm } from '../../components/specific';

const InvitePartnerScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    if (!user?.id) {
      setError(t('no_login') || '로그인 정보가 없습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: 실제 API 호출로 대체
      // 1. 이메일로 초대받을 유저의 id를 조회
      // const inviteeId = await getUserIdByEmail(email);

      // 2. 현재 참여 중인 채널이 없으면 채널을 생성
      // let channelId = currentChannel?.id;
      // if (!channelId) {
      //   const channel = await createChannel(userId);
      //   channelId = channel?.id;
      // }

      // 3. 초대장 생성
      // await createInvitation(channelId, userId, inviteeId);

      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(t('invite_sent') || '초대가 발송되었습니다!');
      navigate(ROUTES.HOME);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '초대 발송에 실패했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
            onInvite={handleInvite}
            isLoading={isLoading}
            error={error}
          />
        </ContentCard>
      </PageContainer>
    </PageWrapper>
  );
};

export default InvitePartnerScreen;
