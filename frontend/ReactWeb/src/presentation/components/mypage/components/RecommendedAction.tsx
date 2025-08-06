import React from 'react';

interface RecommendedActionProps {
  onViewRecommendation?: () => void;
}

const RecommendedAction: React.FC<RecommendedActionProps> = ({
  onViewRecommendation,
}) => (
  <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800'>
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
          <span className='text-white text-lg'>💡</span>
        </div>
        <div>
          <p className='text-sm font-medium text-gray-900 dark:text-white'>
            추천 액션
          </p>
          <p className='text-xs text-gray-600 dark:text-gray-400'>
            AI가 추천하는 다음 액션
          </p>
        </div>
      </div>
      <button
        onClick={onViewRecommendation}
        className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium'
      >
        확인하기 →
      </button>
    </div>
  </div>
);

export default RecommendedAction;
