import React from 'react';
import { SwipeableListItem, StatusBadge } from '../../common';
import { cn } from '../../../../utils/cn';

interface ActivityItem {
  id: number;
  title: string;
  user: string;
  time: string;
  status: 'online' | 'away' | 'offline';
}

interface ActivityListSectionProps {
  activities: ActivityItem[];
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;
  className?: string;
}

const ActivityListSection: React.FC<ActivityListSectionProps> = ({
  activities,
  onDelete,
  onEdit,
  className
}) => {
  return (
    <div className={cn("animate-fade-in", className)} style={{ animationDelay: '0.8s' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-txt">최근 활동</h2>
        <p className="text-sm text-txt-secondary">좌우 스와이프로 편집/삭제</p>
      </div>
      <div className="space-y-3">
        {activities.map((item, index) => (
          <SwipeableListItem
            key={item.id}
            onDelete={() => onDelete(index)}
            onEdit={() => onEdit(index)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-txt font-medium">{item.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-txt-secondary">{item.user} • {item.time}</p>
                  <StatusBadge status={item.status} showText={false} size="sm" />
                </div>
              </div>
            </div>
          </SwipeableListItem>
        ))}
      </div>
    </div>
  );
};

export default ActivityListSection; 