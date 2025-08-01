import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../common";

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
  className = "" 
}) => {
  const { t } = useTranslation();

  const getStatusColor = (status: ChannelInvitation['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: ChannelInvitation['status']) => {
    switch (status) {
      case 'pending': return t('pending') || '대기 중';
      case 'accepted': return t('accepted') || '수락됨';
      case 'rejected': return t('rejected') || '거절됨';
      default: return t('unknown') || '알 수 없음';
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
    <div className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {invitation.channelName || '채널'}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
              {getStatusText(invitation.status)}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {invitation.inviterName || '사용자'}님이 초대했습니다
          </p>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatTime(invitation.createdAt)}
          </div>
        </div>

        {invitation.status === 'pending' && (
          <div className="flex space-x-2 ml-4">
            <Button
              variant="success"
              size="sm"
              onClick={() => onAccept(invitation.id)}
            >
              {t('accept') || '수락'}
            </Button>
            <Button
              variant="danger"
              size="sm"
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