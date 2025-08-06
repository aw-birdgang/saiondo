import React from 'react';
import { cn } from '@/utils/cn';
import type { RecentActivitiesProps } from '@/presentation/pages/mypage/types/mypageTypes';

// Import separated components
import ActivityItem from '@/presentation/components/specific/mypage/components/ActivityItem';
import EmptyActivities from '@/presentation/components/specific/mypage/components/EmptyActivities';
import ActivitiesSummary from '@/presentation/components/specific/mypage/components/ActivitiesSummary';

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* 헤더 */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
            최근 활동
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            최근 7일간의 활동 내역입니다
          </p>
        </div>
        <button className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium'>
          전체보기 →
        </button>
      </div>

      {/* 활동 목록 */}
      <div className='space-y-3'>
        {activities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            index={index}
            onClick={() => {
              // 활동 클릭 이벤트 처리
              console.log(`Clicked on activity: ${activity.action}`);
            }}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {activities.length === 0 && (
        <EmptyActivities
          onStartActivity={() => {
            // 활동 시작 로직
            console.log('Start new activity');
          }}
        />
      )}

      {/* 활동 요약 */}
      {activities.length > 0 && (
        <ActivitiesSummary activityCount={activities.length} />
      )}
    </div>
  );
};

export default RecentActivities;
