import React from 'react';
import { SwipeableListItem, StatusBadge } from '../../common';
import { cn } from '../../../../utils/cn';

interface ActivityItem {
  id: number;
  title: string;
  user: string;
  time: string;
  status: 'online' | 'away' | 'offline';
  type?: 'message' | 'file' | 'update' | 'system';
}

interface ActivityListSectionProps {
  activities: ActivityItem[];
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;
  className?: string;
}

const ActivityListSection: React.FC<ActivityListSectionProps> = ({
  activities,
  onDelete,
  onEdit,
  className,
}) => {
  const getActivityIcon = (type?: string) => {
    switch (type) {
      case 'message':
        return (
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
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
        );
      case 'file':
        return (
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
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
        );
      case 'update':
        return (
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
              d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
            />
          </svg>
        );
      case 'system':
        return (
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
              d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
            />
          </svg>
        );
      default:
        return (
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
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
    }
  };

  const getActivityColor = (type?: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-500';
      case 'file':
        return 'bg-green-500';
      case 'update':
        return 'bg-purple-500';
      case 'system':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={cn('animate-fade-in', className)}
      style={{ animationDelay: '0.8s' }}
    >
      <div className='flex items-center justify-between mb-6'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            최근 활동
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            시스템에서 발생한 최근 활동들을 확인하세요
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            좌우 스와이프로 편집/삭제
          </span>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden'>
        <div className='space-y-1'>
          {activities.map((item, index) => (
            <SwipeableListItem
              key={item.id}
              onDelete={() => onDelete(index)}
              onEdit={() => onEdit(index)}
              className='group hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'
            >
              <div className='flex items-center space-x-4 p-4'>
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg',
                    getActivityColor(item.type)
                  )}
                >
                  {getActivityIcon(item.type)}
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200'>
                      {item.title}
                    </p>
                    <span className='text-xs text-gray-500 dark:text-gray-400 ml-2'>
                      {item.time}
                    </span>
                  </div>

                  <div className='flex items-center space-x-3 mt-1'>
                    <div className='flex items-center space-x-2'>
                      <div className='w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
                        <span className='text-white text-xs font-bold'>
                          {item.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className='text-xs text-gray-600 dark:text-gray-400 font-medium'>
                        {item.user}
                      </span>
                    </div>

                    <StatusBadge
                      status={item.status}
                      showText={false}
                      size='sm'
                      className='ml-auto'
                    />
                  </div>
                </div>
              </div>
            </SwipeableListItem>
          ))}
        </div>

        {activities.length === 0 && (
          <div className='p-8 text-center'>
            <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <p className='text-gray-500 dark:text-gray-400'>
              아직 활동이 없습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityListSection;
