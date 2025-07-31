import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from "../../../shared/constants/app";
import { useAuthStore } from '../../../stores/authStore';
import { Header, Input, Button } from '../../components/common';

const InvitePartnerScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [partnerEmail, setPartnerEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInvite = async () => {
    const trimmedEmail = partnerEmail.trim();

    // 유효성 검사
    if (!trimmedEmail) {
      setError(t('enter_email') || '이메일을 입력해주세요.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError(t('invalid_email_format') || '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (!user?.id) {
      setError(t('no_login') || '로그인 정보가 없습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: 실제 API 호출로 대체
      // 1. 이메일로 초대받을 유저의 id를 조회
      // const inviteeId = await getUserIdByEmail(trimmedEmail);

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
      setPartnerEmail('');
      navigate(ROUTES.HOME);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '초대 발송에 실패했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleInvite();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-surface">
      {/* Header */}
      <Header
        title={t('invite_partner') || '파트너 초대'}
        showBackButton
        className="max-w-4xl mx-auto"
      />

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-dark-secondary-container rounded-3xl shadow-lg p-8">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-blue-100 dark:from-pink-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-pink-500">💕</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('invite_partner_desc') || '연인/파트너의 이메일을 입력해 초대해보세요!'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              함께 대화하고 소통할 수 있는 채널을 만들어보세요
            </p>
          </div>

          {/* Email Input */}
          <Input
            name="partnerEmail"
            type="email"
            value={partnerEmail}
            onChange={(e) => {
              setPartnerEmail(e.target.value);
              if (error) setError(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder="partner@example.com"
            label={t('partner_email') || '초대할 이메일'}
            error={error || undefined}
            disabled={isLoading}
            className="mb-6"
          />

          {/* Invite Button */}
          <Button
            variant="primary"
            fullWidth
            onClick={handleInvite}
            disabled={isLoading || !partnerEmail.trim()}
            loading={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {t('invite') || '초대하기'}
          </Button>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              초대된 사용자는 이메일로 알림을 받게 됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitePartnerScreen;
