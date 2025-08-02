/**
 * Notification Use Case DTOs
 * 알림 관련 Request/Response 인터페이스
 */

export interface NotificationRequest {
  userId: string;
  type: 'message' | 'invitation' | 'mention' | 'system';
  title: string;
  body: string;
  data?: Record<string, unknown>;
  priority?: 'low' | 'normal' | 'high';
}

export interface NotificationResponse {
  success: boolean;
  notificationId: string;
  sentAt: Date;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  mentions: boolean;
  invitations: boolean;
  systemMessages: boolean;
}

export interface UpdateNotificationSettingsRequest {
  userId: string;
  settings: Partial<NotificationSettings>;
}

export interface UpdateNotificationSettingsResponse {
  success: boolean;
  settings: NotificationSettings;
} 