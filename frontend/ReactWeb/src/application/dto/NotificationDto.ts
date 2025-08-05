/**
 * Notification Use Case DTOs
 * 알림 관리 관련 Request/Response 인터페이스
 */

export interface SendNotificationRequest {
  title: string;
  message: string;
  type: 'message' | 'invitation' | 'mention' | 'system';
  userId: string;
  channelId?: string;
  metadata?: Record<string, any>;
}

export interface SendNotificationResponse {
  notification: NotificationProfile | null;
  success: boolean;
  error?: string;
  sentAt: Date;
}

export interface GetNotificationRequest {
  notificationId: string;
}

export interface GetNotificationResponse {
  notification: NotificationProfile | null;
  success: boolean;
  error?: string;
  cached: boolean;
  fetchedAt: Date;
}

export interface GetUserNotificationsRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface GetUserNotificationsResponse {
  notifications: NotificationProfile[];
  success: boolean;
  error?: string;
  cached: boolean;
  total: number;
  hasMore: boolean;
  fetchedAt: Date;
}

export interface MarkAsReadRequest {
  notificationId: string;
  userId: string;
}

export interface MarkAsReadResponse {
  success: boolean;
  error?: string;
  updatedAt: Date;
}

export interface DeleteNotificationRequest {
  notificationId: string;
  userId: string;
}

export interface DeleteNotificationResponse {
  success: boolean;
  error?: string;
  deletedAt: Date;
}

export interface GetNotificationStatsRequest {
  userId?: string;
}

export interface GetNotificationStatsResponse {
  stats: NotificationStats | null;
  success: boolean;
  error?: string;
  cached: boolean;
  fetchedAt: Date;
}

export interface NotificationProfile {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'invitation' | 'mention' | 'system';
  userId: string;
  channelId?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  isRead: boolean;
  isSent: boolean;
}

export interface NotificationStats {
  totalNotifications: number;
  unreadCount: number;
  notificationsByType: Record<string, number>;
  lastNotificationAt: Date;
  userId?: string;
}

export interface NotificationValidationSchema {
  title: { required: boolean; type: string; maxLength: number };
  message: { required: boolean; type: string; maxLength: number };
  type: { required: boolean; type: string; enum: string[] };
  userId: { required: boolean; type: string };
}

export interface NotificationServiceConfig {
  enableValidation?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableSecurityChecks?: boolean;
  maxTitleLength?: number;
  maxMessageLength?: number;
  enablePushNotifications?: boolean;
  enableEmailNotifications?: boolean;
} 