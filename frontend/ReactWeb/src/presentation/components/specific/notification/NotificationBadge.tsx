import React from 'react';
import { cn } from '../../../../utils/cn';
import type { NotificationBadgeProps } from '../../../pages/notification/types/notificationTypes';

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  size = 'md',
  className
}) => {
  if (count === 0) return null;

  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm'
  };

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <div
      className={cn(
        'bg-red-500 text-white rounded-full flex items-center justify-center font-medium',
        sizeClasses[size],
        className
      )}
    >
      {displayCount}
    </div>
  );
};

export default NotificationBadge; 