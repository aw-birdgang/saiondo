import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../constants';
import { useAuthStore } from '../../applicati../../application/stores/authStore';
import LoadingSpinner from '../common/LoadingSpinner';

const InvitePartnerScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  
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
    
    if (!userId) {
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
      <div className="bg-white dark:bg-dark-secondary-container shadow-sm border-b dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('invite_partner') || '파트너 초대'}
            </h1>
          </div>
        </div>
      </div>

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
          <div className="mb-6">
            <label htmlFor="partnerEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('partner_email') || '초대할 이메일'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="partnerEmail"
                type="email"
                value={partnerEmail}
                onChange={(e) => {
                  setPartnerEmail(e.target.value);
                  if (error) setError(null);
                }}
                onKeyPress={handleKeyPress}
                placeholder="partner@example.com"
                disabled={isLoading}
                className={`appearance-none relative block w-full pl-10 pr-3 py-3 border rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-dark-surface dark:text-white dark:border-dark-border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Invite Button */}
          <button
            onClick={handleInvite}
            disabled={isLoading || !partnerEmail.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" color="white" className="mr-2" />
                {t('inviting') || '초대 중...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {t('invite') || '초대하기'}
              </>
            )}
          </button>

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
