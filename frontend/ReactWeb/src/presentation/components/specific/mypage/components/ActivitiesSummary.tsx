import React from 'react';

interface ActivitiesSummaryProps {
  activityCount: number;
}

const ActivitiesSummary: React.FC<ActivitiesSummaryProps> = ({
  activityCount,
}) => (
  <div className='bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
          <span className='text-white text-sm'>📈</span>
        </div>
        <div>
          <p className='text-sm font-medium text-gray-900 dark:text-white'>
            이번 주 활동 요약
          </p>
          <p className='text-xs text-gray-600 dark:text-gray-400'>
            총 {activityCount}개의 활동
          </p>
        </div>
      </div>
      <div className='text-right'>
        <p className='text-sm font-medium text-gray-900 dark:text-white'>
          {activityCount}
        </p>
        <p className='text-xs text-gray-500 dark:text-gray-400'>활동</p>
      </div>
    </div>
  </div>
);

export default ActivitiesSummary;
