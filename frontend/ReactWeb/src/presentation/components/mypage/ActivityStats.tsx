import React from 'react';
import { cn } from '@/utils/cn';
import type { ActivityStatsProps } from '@/presentation/pages/mypage/types/mypageTypes';

// Import separated components
import StatCard from '@/presentation/components/mypage/components/StatCard';
import ActivitySummary from '@/presentation/components/mypage/components/ActivitySummary';

const ActivityStats: React.FC<ActivityStatsProps> = ({ stats, className }) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
          활동 통계
        </h3>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          최근 30일 기준
        </span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            stat={stat}
            index={index}
            onClick={() => {
              // 클릭 이벤트 처리
              console.log(`Clicked on ${stat.label}`);
            }}
          />
        ))}
      </div>

      <ActivitySummary
        onViewDetails={() => {
          // 상세보기 이벤트 처리
          console.log('View activity details');
        }}
      />
    </div>
  );
};

export default ActivityStats;
