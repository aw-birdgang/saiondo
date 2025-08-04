import React from 'react';
import { cn } from '../../../../utils/cn';
import type { NotificationContainerProps } from '../../../pages/notification/types/notificationTypes';

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {children}
    </div>
  );
};

export default NotificationContainer; 