import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../constants';
import { useAuthStore } from '../../core/stores/authStore';
import EmptyState from '../common/EmptyState';

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  type: 'chat' | 'analysis' | 'system' | 'invitation';
  isRead: boolean;
}

const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pushMessages, clearAllPushMessages, clearUnreadPush } = useAuthStore();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: '새로운 메시지가 도착했습니다.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
      type: 'chat',
      isRead: false,
    },
    {
      id: '2',
      message: '채널 초대가 도착했습니다.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
      type: 'invitation',
      isRead: true,
    },
    {
      id: '3',
      message: '분석 결과가 준비되었습니다.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
      type: 'analysis',
      isRead: true,
    },
  ]);

  const handleClearAll = () => {
    setNotifications([]);
    clearAllPushMessages();
    toast.success(t('all_notifications_cleared'));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
    toast.success(t('notification_deleted'));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'chat':
        return '💬';
      case 'analysis':
        return '📊';
      case 'invitation':
        return '👥';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'chat':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'analysis':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'invitation':
        return 'bg-purple-100 dark:bg-purple-900/20';
      case 'system':
        return 'bg-gray-100 dark:bg-gray-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-surface">
      {/* Header */}
      <div className="bg-white dark:bg-dark-secondary-container shadow-sm border-b dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔔</span>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('notification_box')}
                </h1>
              </div>
            </div>
            
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title={t('delete_all_notifications')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <EmptyState
            icon="🔕"
            title={t('no_notifications')}
            description={t('no_notifications_description')}
          />
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 transition-all ${
                  !notification.isRead ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-medium'} text-gray-900 dark:text-white`}>
                        {notification.message}
                      </p>
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(notification.timestamp)}
                      </span>
                      
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          {t('mark_as_read')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
