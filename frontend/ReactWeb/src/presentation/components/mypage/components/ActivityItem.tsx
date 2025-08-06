import React from 'react';
import {
  getActivityIcon,
  getActivityColor,
  getActivityBgColor,
  getTypeLabel,
  getTypeBadgeColor,
  type ActivityType,
} from '@/presentation/components/mypage/utils/activityUtils';

interface ActivityItemProps {
  activity: {
    id: number | string;
    action: string;
    time: string;
    type: ActivityType;
  };
  index: number;
  onClick?: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  index,
  onClick,
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
      onClick={onClick}
    >
      {/* 배경 그라데이션 */}
      <div
        className={`absolute inset-0 bg-gradient-to-r opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${getActivityBgColor(activity.type)}`}
      />

      <div className='relative p-4'>
        <div className='flex items-center gap-4'>
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xl shadow-lg transition-all duration-200 group-hover:scale-110 ${getActivityColor(activity.type)}`}
          >
            {getActivityIcon(activity.type)}
          </div>

          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
              {activity.action}
            </p>
            <div className='flex items-center gap-2 mt-1'>
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                {activity.time}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeBadgeColor(activity.type)}`}
              >
                {getTypeLabel(activity.type)}
              </span>
            </div>
          </div>

          <div className='flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
            <div className='w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center'>
              <span className='text-gray-500 dark:text-gray-400 text-sm'>
                →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
