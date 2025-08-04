export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'chat' | 'channel' | 'analysis' | 'system';
  category: 'all' | 'chat' | 'channel' | 'analysis' | 'system' | 'marketing';
  isRead: boolean;
  isImportant: boolean;
  timestamp: Date;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  action?: {
    type: 'navigate' | 'open' | 'dismiss';
    url?: string;
    data?: any;
  };
  metadata?: {
    channelId?: string;
    messageId?: string;
    analysisId?: string;
    userId?: string;
  };
}

export interface NotificationState {
  isLoading: boolean;
  isMarkingAsRead: boolean;
  error: string | null;
  notifications: Notification[];
  filteredNotifications: Notification[];
  unreadCount: number;
  selectedCategory: string;
  selectedNotifications: string[];
  isSelectMode: boolean;
}

export interface NotificationHeaderProps {
  unreadCount: number;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onMarkAllAsRead: () => void;
  onSelectModeToggle: () => void;
  isSelectMode: boolean;
  selectedCount: number;
  onDeleteSelected: () => void;
  className?: string;
}

export interface NotificationListProps {
  notifications: Notification[];
  isSelectMode: boolean;
  selectedNotifications: string[];
  onNotificationSelect: (id: string) => void;
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export interface NotificationItemProps {
  notification: Notification;
  isSelectMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClick: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export interface NotificationFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export interface NotificationEmptyStateProps {
  category: string;
  className?: string;
}

export interface NotificationContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface NotificationBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface NotificationCategory {
  id: string;
  label: string;
  icon: string;
  count: number;
  color: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
} 