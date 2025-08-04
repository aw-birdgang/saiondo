import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatusBadge } from '../../common';
import { cn } from '../../../../utils/cn';
import type { RecentActivitiesProps } from '../../../pages/mypage/types/mypageTypes';

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  className
}) => {
  const getActivityIcon = (type: 'chat' | 'ai' | 'channel' | 'analysis') => {
    switch (type) {
      case 'chat': return '💬';
      case 'ai': return '🤖';
      case 'channel': return '👥';
      case 'analysis': return '📊';
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
        <CardDescription>최근 7일간의 활동 내역입니다</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-txt">{activity.action}</p>
                <p className="text-xs text-txt-secondary">{activity.time}</p>
              </div>
              <StatusBadge status="success" showText={false} size="sm" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities; 