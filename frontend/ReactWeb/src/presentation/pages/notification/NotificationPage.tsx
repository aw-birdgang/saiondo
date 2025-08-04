import React from 'react';
import { LoadingSpinner } from '../../components/common';
import { ErrorState } from '../../components/specific';
import {
  NotificationHeader,
  NotificationList,
  NotificationContainer
} from '../../components/specific/notification';
import { useNotificationData } from './hooks/useNotificationData';

const NotificationPage: React.FC = () => {
  const {
    // 상태
    notifications,
    filteredNotifications,
    isLoading,
    isMarkingAsRead,
    error,
    unreadCount,
    selectedCategory,
    selectedNotifications,
    isSelectMode,
    notificationStats,

    // 액션
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteSelectedNotifications,
    handleCategoryChange,
    handleSelectModeToggle,
    handleNotificationSelect,
    handleNotificationClick
  } = useNotificationData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        title="알림 로드 실패"
        message={error}
        onRetry={loadNotifications}
      />
    );
  }

  return (
    <NotificationContainer>
      {/* 헤더 */}
      <NotificationHeader
        unreadCount={unreadCount}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onMarkAllAsRead={markAllAsRead}
        onSelectModeToggle={handleSelectModeToggle}
        isSelectMode={isSelectMode}
        selectedCount={selectedNotifications.length}
        onDeleteSelected={deleteSelectedNotifications}
      />
      
      {/* 알림 목록 */}
      <div className="flex-1 overflow-y-auto">
        <NotificationList
          notifications={filteredNotifications}
          isSelectMode={isSelectMode}
          selectedNotifications={selectedNotifications}
          onNotificationSelect={handleNotificationSelect}
          onNotificationClick={handleNotificationClick}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
        />
      </div>
    </NotificationContainer>
  );
};

export default NotificationPage; 