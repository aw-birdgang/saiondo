import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { MOCK_NOTIFICATIONS, NOTIFICATION_LOAD_TIME, NOTIFICATION_SAVE_TIME, NOTIFICATION_CATEGORIES } from '../constants/notificationData';
import type { Notification, NotificationState, NotificationStats } from '../types/notificationTypes';

export const useNotificationData = () => {
  const navigate = useNavigate();
  
  const [state, setState] = useState<NotificationState>({
    isLoading: false,
    isMarkingAsRead: false,
    error: null,
    notifications: [],
    filteredNotifications: [],
    unreadCount: 0,
    selectedCategory: 'all',
    selectedNotifications: [],
    isSelectMode: false
  });

  // 알림 통계 계산
  const notificationStats = useMemo((): NotificationStats => {
    const stats: NotificationStats = {
      total: state.notifications.length,
      unread: state.notifications.filter(n => !n.isRead).length,
      byCategory: {},
      byType: {}
    };

    // 카테고리별 통계
    NOTIFICATION_CATEGORIES.forEach(category => {
      stats.byCategory[category.id] = state.notifications.filter(n => 
        category.id === 'all' ? true : n.category === category.id
      ).length;
    });

    // 타입별 통계
    state.notifications.forEach(notification => {
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
    });

    return stats;
  }, [state.notifications]);

  // 필터링된 알림 계산
  const filteredNotifications = useMemo(() => {
    if (state.selectedCategory === 'all') {
      return state.notifications;
    }
    return state.notifications.filter(notification => 
      notification.category === state.selectedCategory
    );
  }, [state.notifications, state.selectedCategory]);

  // 알림 로딩
  const loadNotifications = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: Implement actual API call
      // const response = await notificationService.getNotifications();
      // return response.data;

      // Mock 데이터 로딩 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, NOTIFICATION_LOAD_TIME));
      
      const notifications = MOCK_NOTIFICATIONS;
      const unreadCount = notifications.filter(n => !n.isRead).length;
      
      setState(prev => ({
        ...prev,
        notifications,
        filteredNotifications: notifications,
        unreadCount,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setState(prev => ({
        ...prev,
        error: '알림을 불러오는데 실패했습니다.',
        isLoading: false
      }));
      toast.error('알림을 불러오는데 실패했습니다.');
    }
  }, []);

  // 알림 읽음 처리
  const markAsRead = useCallback(async (notificationId: string) => {
    setState(prev => ({ ...prev, isMarkingAsRead: true }));
    
    try {
      // TODO: Implement actual API call
      // await notificationService.markAsRead(notificationId);
      
      // Mock 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, NOTIFICATION_SAVE_TIME));
      
      setState(prev => {
        const updatedNotifications = prev.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
        
        return {
          ...prev,
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter(n => !n.isRead).length,
          isMarkingAsRead: false
        };
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      setState(prev => ({ ...prev, isMarkingAsRead: false }));
      toast.error('알림 읽음 처리에 실패했습니다.');
    }
  }, []);

  // 모든 알림 읽음 처리
  const markAllAsRead = useCallback(async () => {
    setState(prev => ({ ...prev, isMarkingAsRead: true }));
    
    try {
      // TODO: Implement actual API call
      // await notificationService.markAllAsRead();
      
      // Mock 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, NOTIFICATION_SAVE_TIME));
      
      setState(prev => {
        const updatedNotifications = prev.notifications.map(notification => ({
          ...notification,
          isRead: true
        }));
        
        return {
          ...prev,
          notifications: updatedNotifications,
          unreadCount: 0,
          isMarkingAsRead: false
        };
      });
      
      toast.success('모든 알림을 읽음 처리했습니다.');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      setState(prev => ({ ...prev, isMarkingAsRead: false }));
      toast.error('알림 읽음 처리에 실패했습니다.');
    }
  }, []);

  // 알림 삭제
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      // TODO: Implement actual API call
      // await notificationService.deleteNotification(notificationId);
      
      // Mock 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, NOTIFICATION_SAVE_TIME));
      
      setState(prev => {
        const updatedNotifications = prev.notifications.filter(
          notification => notification.id !== notificationId
        );
        
        return {
          ...prev,
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter(n => !n.isRead).length,
          selectedNotifications: prev.selectedNotifications.filter(id => id !== notificationId)
        };
      });
      
      toast.success('알림이 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('알림 삭제에 실패했습니다.');
    }
  }, []);

  // 선택된 알림 삭제
  const deleteSelectedNotifications = useCallback(async () => {
    if (state.selectedNotifications.length === 0) return;
    
    try {
      // TODO: Implement actual API call
      // await notificationService.deleteMultipleNotifications(state.selectedNotifications);
      
      // Mock 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, NOTIFICATION_SAVE_TIME));
      
      setState(prev => {
        const updatedNotifications = prev.notifications.filter(
          notification => !prev.selectedNotifications.includes(notification.id)
        );
        
        return {
          ...prev,
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter(n => !n.isRead).length,
          selectedNotifications: [],
          isSelectMode: false
        };
      });
      
      toast.success(`${state.selectedNotifications.length}개의 알림이 삭제되었습니다.`);
    } catch (error) {
      console.error('Failed to delete selected notifications:', error);
      toast.error('알림 삭제에 실패했습니다.');
    }
  }, [state.selectedNotifications]);

  // 카테고리 변경
  const handleCategoryChange = useCallback((category: string) => {
    setState(prev => ({ ...prev, selectedCategory: category }));
  }, []);

  // 선택 모드 토글
  const handleSelectModeToggle = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSelectMode: !prev.isSelectMode,
      selectedNotifications: []
    }));
  }, []);

  // 알림 선택/해제
  const handleNotificationSelect = useCallback((notificationId: string) => {
    setState(prev => {
      const isSelected = prev.selectedNotifications.includes(notificationId);
      const updatedSelected = isSelected
        ? prev.selectedNotifications.filter(id => id !== notificationId)
        : [...prev.selectedNotifications, notificationId];
      
      return {
        ...prev,
        selectedNotifications: updatedSelected
      };
    });
  }, []);

  // 알림 클릭 처리
  const handleNotificationClick = useCallback((notification: Notification) => {
    if (state.isSelectMode) {
      handleNotificationSelect(notification.id);
      return;
    }

    // 읽지 않은 알림이면 읽음 처리
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // 액션 처리
    if (notification.action) {
      switch (notification.action.type) {
        case 'navigate':
          if (notification.action.url) {
            navigate(notification.action.url);
          }
          break;
        case 'open':
          if (notification.action.url) {
            window.open(notification.action.url, '_blank');
          }
          break;
        case 'dismiss':
          deleteNotification(notification.id);
          break;
      }
    }
  }, [state.isSelectMode, handleNotificationSelect, markAsRead, navigate, deleteNotification]);

  // 초기 로딩
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // 필터링된 알림 업데이트
  useEffect(() => {
    setState(prev => ({
      ...prev,
      filteredNotifications
    }));
  }, [filteredNotifications]);

  return {
    // 상태
    notifications: state.notifications,
    filteredNotifications: state.filteredNotifications,
    isLoading: state.isLoading,
    isMarkingAsRead: state.isMarkingAsRead,
    error: state.error,
    unreadCount: state.unreadCount,
    selectedCategory: state.selectedCategory,
    selectedNotifications: state.selectedNotifications,
    isSelectMode: state.isSelectMode,
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
  };
}; 