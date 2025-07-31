import { toast } from 'react-hot-toast';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export class NotificationService {
  static show(
    message: string,
    type: NotificationType = 'info',
    options: NotificationOptions = {}
  ): void {
    const { duration = 4000, position = 'top-right' } = options;

    switch (type) {
      case 'success':
        toast.success(message, { duration, position });
        break;
      case 'error':
        toast.error(message, { duration, position });
        break;
      case 'warning':
        toast(message, {
          duration,
          position,
          icon: '⚠️',
          style: {
            background: '#fbbf24',
            color: '#1f2937',
          },
        });
        break;
      case 'info':
      default:
        toast(message, { duration, position });
        break;
    }
  }

  static success(message: string, options?: NotificationOptions): void {
    this.show(message, 'success', options);
  }

  static error(message: string, options?: NotificationOptions): void {
    this.show(message, 'error', options);
  }

  static warning(message: string, options?: NotificationOptions): void {
    this.show(message, 'warning', options);
  }

  static info(message: string, options?: NotificationOptions): void {
    this.show(message, 'info', options);
  }

  static dismiss(): void {
    toast.dismiss();
  }
} 