import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../constants';
import { useAuthStore } from '../../applicati../../application/stores/authStore';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

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
  const { userId } = useAuthStore();
  
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
          inviteeId: userId || 'current-user',
          channelId: 'channel1',
          status: 'pending',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
          inviterName: '김철수',
          channelName: '우리만의 채널',
        },
        {
          id: '2',
          inviterId: 'user2',
          inviteeId: userId || 'current-user',
          channelId: 'channel2',
          status: 'accepted',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
          inviterName: '이영희',
          channelName: '커플 채널',
        },
        {
          id: '3',
          inviterId: 'user3',
          inviteeId: userId || 'current-user',
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
        navigate(ROUTES.CHANNEL);
      }
      
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
      toast.error(t('failed_to_respond') || '초대 응답에 실패했습니다.');
    }
  };

  const getStatusColor = (status: ChannelInvitation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getStatusText = (status: ChannelInvitation['status']) => {
    switch (status) {
      case 'pending':
        return t('pending') || '대기 중';
      case 'accepted':
        return t('accepted') || '수락됨';
      case 'rejected':
        return t('rejected') || '거절됨';
      default:
        return t('unknown') || '알 수 없음';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('loading_invitations') || '초대장을 불러오는 중...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-surface">
      {/* Header */}
      <div className="bg-white dark:bg-dark-secondary-container shadow-sm border-b dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📨</span>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('channel_invitations') || '채널 초대장'}
                </h1>
              </div>
            </div>
            
            {invitations.length > 0 && (
              <button
                onClick={fetchInvitations}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                title={t('refresh') || '새로고침'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {invitations.length === 0 ? (
          <EmptyState
            icon="📭"
            title={t('no_invitations') || '받은 초대장이 없습니다'}
            description={t('no_invitations_description') || '아직 받은 채널 초대장이 없습니다.'}
          />
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">👥</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {invitation.channelName || '채널'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {invitation.inviterName || invitation.inviterId}님이 초대했습니다
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                          {getStatusText(invitation.status)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(invitation.createdAt)}
                        </span>
                      </div>
                      
                      {invitation.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleRespondToInvitation(invitation.id, true)}
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {t('accept') || '수락'}
                          </button>
                          <button
                            onClick={() => handleRespondToInvitation(invitation.id, false)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {t('reject') || '거절'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelInvitationScreen;
