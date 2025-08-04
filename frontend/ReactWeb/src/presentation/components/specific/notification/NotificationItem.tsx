import React from 'react';
import { cn } from '../../../../utils/cn';
import { formatNotificationTime, NOTIFICATION_TYPE_ICONS, NOTIFICATION_TYPE_COLORS } from '../../../pages/notification/constants/notificationData';
import type { NotificationItemProps } from '../../../pages/notification/types/notificationTypes';

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isSelectMode,
  isSelected,
  onSelect,
  onClick,
  onMarkAsRead,
  onDelete,
  className
}) => {
  const handleClick = () => {
    onClick(notification);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(notification.id);
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'p-4 border-b border-border cursor-pointer transition-colors',
        'hover:bg-focus',
        !notification.isRead && 'bg-blue-50 dark:bg-blue-900/20',
        isSelectMode && 'pl-12',
        className
      )}
    >
      <div className="flex items-start space-x-3">
        {/* 선택 체크박스 */}
        {isSelectMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(notification.id)}
            onClick={handleSelect}
            className="mt-1 h-4 w-4 text-primary border-border rounded focus:ring-primary"
          />
        )}

        {/* 알림 아이콘 */}
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm',
          NOTIFICATION_TYPE_COLORS[notification.type]
        )}>
          {NOTIFICATION_TYPE_ICONS[notification.type]}
        </div>

        {/* 알림 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={cn(
                  'font-medium text-txt',
                  !notification.isRead && 'font-semibold'
                )}>
                  {notification.title}
                </h3>
                {notification.isImportant && (
                  <span className="text-red-500 text-xs">중요</span>
                )}
                {!notification.isRead && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
              
              <p className="text-sm text-txt-secondary mt-1 line-clamp-2">
                {notification.message}
              </p>
              
              {/* 발신자 정보 */}
              {notification.sender && (
                <div className="flex items-center space-x-2 mt-2">
                  {notification.sender.avatar && (
                    <img
                      src={notification.sender.avatar}
                      alt={notification.sender.name}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span className="text-xs text-txt-secondary">
                    {notification.sender.name}
                  </span>
                </div>
              )}
            </div>

            {/* 시간 */}
            <div className="flex-shrink-0 ml-4">
              <span className="text-xs text-txt-secondary">
                {formatNotificationTime(notification.timestamp)}
              </span>
            </div>
          </div>

          {/* 액션 버튼들 */}
          {!isSelectMode && (
            <div className="flex items-center space-x-2 mt-3">
              {!notification.isRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="text-xs text-primary hover:underline"
                >
                  읽음 처리
                </button>
              )}
              <button
                onClick={handleDelete}
                className="text-xs text-red-500 hover:underline"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem; 