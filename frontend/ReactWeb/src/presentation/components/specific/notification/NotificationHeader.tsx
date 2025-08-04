import React from 'react';
import { Button } from '../../common';
import { cn } from '../../../../utils/cn';
import { NOTIFICATION_CATEGORIES } from '../../../pages/notification/constants/notificationData';
import type { NotificationHeaderProps } from '../../../pages/notification/types/notificationTypes';

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  selectedCategory,
  onCategoryChange,
  onMarkAllAsRead,
  onSelectModeToggle,
  isSelectMode,
  selectedCount,
  onDeleteSelected,
  className
}) => {
  return (
    <div className={cn("p-4 bg-surface border-b border-border", className)}>
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-txt">알림</h1>
          <p className="text-sm text-txt-secondary">
            {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림` : '모든 알림을 확인했습니다'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isSelectMode && unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
            >
              모두 읽음
            </Button>
          )}
          
          <Button
            variant={isSelectMode ? "primary" : "outline"}
            size="sm"
            onClick={onSelectModeToggle}
          >
            {isSelectMode ? '선택 완료' : '선택'}
          </Button>
          
          {isSelectMode && selectedCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteSelected}
            >
              삭제 ({selectedCount})
            </Button>
          )}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {NOTIFICATION_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              'whitespace-nowrap',
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-focus text-txt hover:bg-focus-dark'
            )}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
            {category.count > 0 && (
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs',
                selectedCategory === category.id
                  ? 'bg-white/20'
                  : 'bg-primary text-white'
              )}>
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationHeader; 