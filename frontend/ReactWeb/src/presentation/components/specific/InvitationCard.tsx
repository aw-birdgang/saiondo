import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../common';

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

interface InvitationCardProps {
  invitation: ChannelInvitation;
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
  className?: string;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onAccept,
  onReject,
  className = '',
}) => {
  const { t } = useTranslation();

  const getStatusColor = (status: ChannelInvitation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800';
      default:
        return 'bg-secondary text-txt-secondary border border-border';
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

  return (
    <div
      className={`card p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] ${className}`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='flex items-center space-x-4 mb-3'>
            <h3 className='text-lg font-semibold text-txt leading-tight'>
              {invitation.channelName || '채널'}
            </h3>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(invitation.status)}`}
            >
              {getStatusText(invitation.status)}
            </span>
          </div>

          <p className='text-txt-secondary mb-4 leading-relaxed'>
            {invitation.inviterName || '사용자'}님이 초대했습니다
          </p>

          <div className='text-sm text-txt-secondary font-medium'>
            {formatTime(invitation.createdAt)}
          </div>
        </div>

        {invitation.status === 'pending' && (
          <div className='flex space-x-3 ml-6'>
            <Button
              variant='success'
              size='sm'
              onClick={() => onAccept(invitation.id)}
            >
              {t('accept') || '수락'}
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => onReject(invitation.id)}
            >
              {t('reject') || '거절'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationCard;
