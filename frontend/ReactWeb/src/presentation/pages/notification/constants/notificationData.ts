import type { Notification, NotificationCategory } from '../types/notificationTypes';

// Mock 알림 데이터
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: '새로운 메시지',
    message: '김철수님이 채팅방에서 메시지를 보냈습니다.',
    type: 'chat',
    category: 'chat',
    isRead: false,
    isImportant: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5분 전
    sender: {
      id: 'user1',
      name: '김철수',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    action: {
      type: 'navigate',
      url: '/chat/room1'
    },
    metadata: {
      channelId: 'room1',
      messageId: 'msg123'
    }
  },
  {
    id: '2',
    title: '채널 초대',
    message: '새로운 채널 "개발자 모임"에 초대되었습니다.',
    type: 'channel',
    category: 'channel',
    isRead: false,
    isImportant: true,
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15분 전
    action: {
      type: 'navigate',
      url: '/channel/new'
    },
    metadata: {
      channelId: 'new-channel'
    }
  },
  {
    id: '3',
    title: '관계 분석 완료',
    message: '이영희님과의 관계 분석이 완료되었습니다.',
    type: 'analysis',
    category: 'analysis',
    isRead: true,
    isImportant: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
    action: {
      type: 'navigate',
      url: '/analysis/result1'
    },
    metadata: {
      analysisId: 'analysis1'
    }
  },
  {
    id: '4',
    title: '시스템 업데이트',
    message: '새로운 기능이 추가되었습니다. 확인해보세요!',
    type: 'system',
    category: 'system',
    isRead: true,
    isImportant: false,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6시간 전
    action: {
      type: 'open',
      url: '/settings'
    }
  },
  {
    id: '5',
    title: '마케팅 이벤트',
    message: '특별한 할인 혜택을 놓치지 마세요!',
    type: 'info',
    category: 'marketing',
    isRead: false,
    isImportant: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
    action: {
      type: 'open',
      url: '/events'
    }
  },
  {
    id: '6',
    title: '친구 요청',
    message: '박지민님이 친구 요청을 보냈습니다.',
    type: 'info',
    category: 'system',
    isRead: false,
    isImportant: false,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
    sender: {
      id: 'user2',
      name: '박지민',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    action: {
      type: 'navigate',
      url: '/profile/friend-requests'
    },
    metadata: {
      userId: 'user2'
    }
  },
  {
    id: '7',
    title: '알림 설정 변경',
    message: '알림 설정이 업데이트되었습니다.',
    type: 'success',
    category: 'system',
    isRead: true,
    isImportant: false,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
    action: {
      type: 'navigate',
      url: '/settings'
    }
  },
  {
    id: '8',
    title: '채널 활동',
    message: '채널 "취미 공유"에서 새로운 게시물이 올라왔습니다.',
    type: 'channel',
    category: 'channel',
    isRead: true,
    isImportant: false,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4일 전
    action: {
      type: 'navigate',
      url: '/channel/hobby'
    },
    metadata: {
      channelId: 'hobby'
    }
  }
];

// 알림 카테고리
export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: 'all',
    label: '전체',
    icon: '🔔',
    count: 0,
    color: 'bg-gray-500'
  },
  {
    id: 'chat',
    label: '채팅',
    icon: '💬',
    count: 0,
    color: 'bg-blue-500'
  },
  {
    id: 'channel',
    label: '채널',
    icon: '📢',
    count: 0,
    color: 'bg-green-500'
  },
  {
    id: 'analysis',
    label: '분석',
    icon: '📊',
    count: 0,
    color: 'bg-purple-500'
  },
  {
    id: 'system',
    label: '시스템',
    icon: '⚙️',
    count: 0,
    color: 'bg-orange-500'
  },
  {
    id: 'marketing',
    label: '마케팅',
    icon: '🎯',
    count: 0,
    color: 'bg-pink-500'
  }
];

// 알림 타입별 아이콘
export const NOTIFICATION_TYPE_ICONS = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  chat: '💬',
  channel: '📢',
  analysis: '📊',
  system: '⚙️'
};

// 알림 타입별 색상
export const NOTIFICATION_TYPE_COLORS = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  chat: 'bg-blue-500',
  channel: 'bg-green-500',
  analysis: 'bg-purple-500',
  system: 'bg-orange-500'
};

// 시간 포맷팅 함수
export const formatNotificationTime = (timestamp: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}일 전`;
  
  return timestamp.toLocaleDateString('ko-KR');
};

// 알림 로딩 시뮬레이션 시간 (ms)
export const NOTIFICATION_LOAD_TIME = 800;

// 알림 저장 시뮬레이션 시간 (ms)
export const NOTIFICATION_SAVE_TIME = 500; 