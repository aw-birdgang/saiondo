import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../common';
import { StatusBadge } from '../common';

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

interface InvitationResponseCardProps {
  invitation: ChannelInvitation;
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
  className?: string;
}

const InvitationResponseCard: React.FC<InvitationResponseCardProps> = ({
  invitation,
  onAccept,
  onReject,
  className = ''
}) => {
  const { t } = useTranslation();

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

  const getStatusConfig = () => {
    switch (invitation.status) {
      case 'pending':
        return {
          status: 'pending' as const,
          text: t('pending') || '대기 중',
          color: 'yellow'
        };
      case 'accepted':
        return {
          status: 'success' as const,
          text: t('accepted') || '수락됨',
          color: 'green'
        };
      case 'rejected':
        return {
          status: 'error' as const,
          text: t('rejected') || '거절됨',
          color: 'red'
        };
      default:
        return {
          status: 'inactive' as const,
          text: t('unknown') || '알 수 없음',
          color: 'gray'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {invitation.channelName || t('channel') || '채널'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('invited_by') || '초대자'}: {invitation.inviterName || t('unknown_user') || '알 수 없는 사용자'}
            </p>
          </div>
        </div>
        <StatusBadge
          status={statusConfig.status}
          text={statusConfig.text}
          size="sm"
        />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {t('invitation_code') || '초대 코드'}:
          </span>
          <span className="font-mono text-gray-900 dark:text-white">
            {invitation.channelId}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {t('invited_at') || '초대 시간'}:
          </span>
          <span className="text-gray-900 dark:text-white">
            {formatTime(invitation.createdAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      {invitation.status === 'pending' && (
        <div className="flex space-x-3 mt-6">
          <Button
            onClick={() => onAccept(invitation.id)}
            variant="primary"
            className="flex-1"
          >
            {t('accept') || '수락'}
          </Button>
          <Button
            onClick={() => onReject(invitation.id)}
            variant="secondary"
            className="flex-1"
          >
            {t('reject') || '거절'}
          </Button>
        </div>
      )}

      {/* Status Message */}
      {invitation.status !== 'pending' && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          invitation.status === 'accepted'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
        }`}>
          {invitation.status === 'accepted' 
            ? t('invitation_accepted_message') || '초대를 수락했습니다. 채널에 참여할 수 있습니다.'
            : t('invitation_rejected_message') || '초대를 거절했습니다.'
          }
        </div>
      )}
    </div>
  );
};

export default InvitationResponseCard; 