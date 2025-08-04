import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Badge } from '../common';
import { cn } from '../../../utils/cn';
import type { ChannelInvitationItem } from '../../../domain/types/invite';

interface InvitationCardProps {
  invitation: ChannelInvitationItem;
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
  onCancel: (invitationId: string) => void;
  className?: string;
}

const getStatusColor = (status: ChannelInvitationItem['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: ChannelInvitationItem['status']) => {
  switch (status) {
    case 'pending':
      return '대기 중';
    case 'accepted':
      return '수락됨';
    case 'rejected':
      return '거절됨';
    default:
      return '알 수 없음';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  return `${days}일 전`;
};

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onAccept,
  onReject,
  onCancel,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn('p-4 border border-border rounded-lg bg-surface', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* 헤더 */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-txt">{invitation.inviterName || '알 수 없는 사용자'}</h3>
              <p className="text-sm text-txt-secondary">{formatTimeAgo(invitation.createdAt)}</p>
            </div>
            <Badge variant="secondary" className={getStatusColor(invitation.status)}>
              {getStatusLabel(invitation.status)}
            </Badge>
          </div>

          {/* 채널 정보 */}
          <div className="mb-4">
            <h4 className="font-medium text-txt mb-1">채널: {invitation.channelName || '알 수 없는 채널'}</h4>
            <p className="text-sm text-txt-secondary">
              {invitation.inviterName || '알 수 없는 사용자'}님이 초대했습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      {invitation.status === 'pending' && (
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAccept(invitation.id)}
            className="flex-1"
          >
            수락
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReject(invitation.id)}
            className="flex-1"
          >
            거절
          </Button>
        </div>
      )}

      {/* 취소 버튼 (수락된 초대장의 경우) */}
      {invitation.status === 'accepted' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCancel(invitation.id)}
          className="w-full"
        >
          채널 나가기
        </Button>
      )}
    </div>
  );
}; 