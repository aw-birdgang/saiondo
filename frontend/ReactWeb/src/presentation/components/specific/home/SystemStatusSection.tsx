import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatusBadge } from '../../common';
import { cn } from '../../../../utils/cn';

interface SystemStatusItem {
  service: string;
  status: string;
  color: string;
  badge: 'success' | 'warning' | 'error';
}

interface NotificationItem {
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

interface SystemStatusSectionProps {
  systemStatus: SystemStatusItem[];
  notifications: NotificationItem[];
  className?: string;
}

const SystemStatusSection: React.FC<SystemStatusSectionProps> = ({
  systemStatus,
  notifications,
  className
}) => {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in", className)} style={{ animationDelay: '1s' }}>
      <Card variant="elevated" hover="glow">
        <CardHeader withDivider>
          <CardTitle size="lg">시스템 상태</CardTitle>
          <CardDescription>현재 시스템 상태를 확인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between group hover:bg-focus p-2 rounded-lg transition-all duration-200">
                <span className="text-sm text-txt group-hover:text-primary transition-colors duration-200">{item.service}</span>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={item.badge} showText={false} size="sm" />
                  <span className={cn("text-sm font-medium", item.color)}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated" hover="glow">
        <CardHeader withDivider>
          <CardTitle size="lg">실시간 알림</CardTitle>
          <CardDescription>최근 알림 내역</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-focus rounded-lg">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2",
                  notification.type === 'info' && 'bg-blue-500',
                  notification.type === 'success' && 'bg-green-500',
                  notification.type === 'warning' && 'bg-yellow-500'
                )} />
                <div className="flex-1">
                  <p className="text-sm text-txt">{notification.message}</p>
                  <p className="text-xs text-txt-secondary mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatusSection; 