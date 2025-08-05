import React from 'react';
import { cn } from '../../../../utils/cn';
import type { QuickActionsProps } from '../../../pages/mypage/types/mypageTypes';

// Import separated components
import ActionCard from './components/ActionCard';
import RecommendedAction from './components/RecommendedAction';

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionClick,
  className
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            빠른 액션
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            자주 사용하는 기능에 빠르게 접근하세요
          </p>
        </div>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          더보기 →
        </button>
      </div>

      {/* 액션 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <ActionCard
            key={action.id}
            action={action}
            index={index}
            onClick={() => onActionClick(action)}
          />
        ))}
      </div>

      <RecommendedAction 
        onViewRecommendation={() => {
          // 추천 액션 확인 로직
          console.log('View recommended action');
        }}
      />
    </div>
  );
};

export default QuickActions; 