import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../common';
import { InvitationCard } from './InvitationCard';
import type { ChannelInvitationItem } from '../../../domain/types/invite';

interface InvitationListProps {
  invitations: ChannelInvitationItem[];
  isLoading: boolean;
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
  onCancel: (invitationId: string) => void;
  className?: string;
}

export const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  isLoading,
  onAccept,
  onReject,
  onCancel,
  className,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <LoadingSpinner size='lg' text='초대장을 불러오는 중...' />
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-txt-secondary'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-txt mb-2'>
            초대장이 없습니다
          </h3>
          <p className='text-txt-secondary'>
            새로운 초대장이 도착하면 여기에 표시됩니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className='space-y-4'>
        {invitations.map(invitation => (
          <InvitationCard
            key={invitation.id}
            invitation={invitation}
            onAccept={onAccept}
            onReject={onReject}
            onCancel={onCancel}
          />
        ))}
      </div>
    </div>
  );
};
