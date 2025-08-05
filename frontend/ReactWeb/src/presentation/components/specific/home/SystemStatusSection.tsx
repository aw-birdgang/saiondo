import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusBadge,
} from '../../common';
import { cn } from '../../../../utils/cn';

interface SystemStatusItem {
  service: string;
  status: string;
  color: string;
  badge: 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
}

interface NotificationItem {
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
}

interface SystemStatusSectionProps {
  systemStatus: SystemStatusItem[];
  notifications: NotificationItem[];
  className?: string;
}

const SystemStatusSection: React.FC<SystemStatusSectionProps> = ({
  systemStatus,
  notifications,
  className,
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
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
      case 'success':
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
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
      case 'warning':
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
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        );
      case 'error':
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
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in',
        className
      )}
      style={{ animationDelay: '1s' }}
    >
      {/* System Status Card */}
      <Card
        variant='elevated'
        hover='glow'
        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg'
      >
        <CardHeader
          withDivider
          className='border-gray-200 dark:border-gray-700'
        >
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div>
              <CardTitle size='lg' className='text-gray-900 dark:text-white'>
                시스템 상태
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400'>
                현재 시스템 상태를 확인하세요
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='space-y-4'>
            {systemStatus.map((item, index) => (
              <div
                key={index}
                className='flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600'
              >
                <div className='flex items-center space-x-3'>
                  {item.icon && (
                    <div className='w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center'>
                      {item.icon}
                    </div>
                  )}
                  <span className='text-sm font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200'>
                    {item.service}
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <StatusBadge status={item.badge} showText={false} size='sm' />
                  <span
                    className={cn(
                      'text-sm font-semibold px-3 py-1 rounded-full',
                      item.color
                    )}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications Card */}
      <Card
        variant='elevated'
        hover='glow'
        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg'
      >
        <CardHeader
          withDivider
          className='border-gray-200 dark:border-gray-700'
        >
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 17h5l-5 5v-5z'
                />
              </svg>
            </div>
            <div>
              <CardTitle size='lg' className='text-gray-900 dark:text-white'>
                실시간 알림
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400'>
                최근 알림 내역
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='space-y-3'>
            {notifications.map((notification, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start space-x-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-md',
                  getNotificationColor(notification.type)
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                    notification.type === 'info' &&
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                    notification.type === 'success' &&
                      'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                    notification.type === 'warning' &&
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
                    notification.type === 'error' &&
                      'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  )}
                >
                  {notification.icon || getNotificationIcon(notification.type)}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium'>{notification.message}</p>
                  <p className='text-xs opacity-75 mt-1'>{notification.time}</p>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className='text-center py-8'>
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
                      d='M15 17h5l-5 5v-5z'
                    />
                  </svg>
                </div>
                <p className='text-gray-500 dark:text-gray-400'>
                  새로운 알림이 없습니다
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatusSection;
