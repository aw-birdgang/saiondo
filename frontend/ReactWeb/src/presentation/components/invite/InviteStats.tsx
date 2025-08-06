import React from 'react';
// import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import type { InviteStats as InviteStatsType } from '@/domain/types/invite';

interface InviteStatsProps {
  stats: InviteStatsType;
  className?: string;
}

export const InviteStats: React.FC<InviteStatsProps> = ({
  stats,
  className,
}) => {
  // const { t } = useTranslation();

  const statItems = [
    {
      label: '전체',
      value: stats.totalInvitations,
      color: 'bg-blue-100 text-blue-800',
      icon: (
        <svg
          className='w-5 h-5'
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
      ),
    },
    {
      label: '대기 중',
      value: stats.pendingInvitations,
      color: 'bg-yellow-100 text-yellow-800',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      ),
    },
    {
      label: '수락됨',
      value: stats.acceptedInvitations,
      color: 'bg-green-100 text-green-800',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M5 13l4 4L19 7'
          />
        </svg>
      ),
    },
    {
      label: '거절됨',
      value: stats.rejectedInvitations,
      color: 'bg-red-100 text-red-800',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      ),
    },
  ];

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {statItems.map((item, index) => (
        <div
          key={index}
          className='p-4 bg-surface border border-border rounded-lg text-center'
        >
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2',
              item.color
            )}
          >
            {item.icon}
          </div>
          <div className='text-2xl font-bold text-txt mb-1'>{item.value}</div>
          <div className='text-sm text-txt-secondary'>{item.label}</div>
        </div>
      ))}
    </div>
  );
};
