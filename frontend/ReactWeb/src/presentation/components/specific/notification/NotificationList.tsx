import React from 'react';
import { cn } from '../../../../utils/cn';
import NotificationItem from './NotificationItem';
import type { NotificationListProps } from '../../../pages/notification/types/notificationTypes';

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isSelectMode,
  selectedNotifications,
  onNotificationSelect,
  onNotificationClick,
  onMarkAsRead,
  onDelete,
  className
}) => {
  if (notifications.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)}>
        <div className="text-6xl mb-4">🔔</div>
        <h3 className="text-lg font-medium text-txt mb-2">알림이 없습니다</h3>
        <p className="text-sm text-txt-secondary text-center">
          새로운 알림이 도착하면 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("divide-y divide-border", className)}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          isSelectMode={isSelectMode}
          isSelected={selectedNotifications.includes(notification.id)}
          onSelect={onNotificationSelect}
          onClick={onNotificationClick}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NotificationList; 