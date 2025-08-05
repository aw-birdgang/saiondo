import React from 'react';
import { cn } from '../../../../utils/cn';
import type { QuickActionsProps } from '../../../pages/mypage/types/mypageTypes';

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionClick,
  className
}) => {
  const getActionColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600'
    ];
    return colors[index % colors.length];
  };

  const getActionBgColor = (index: number) => {
    const colors = [
      'bg-blue-50 dark:bg-blue-900/10',
      'bg-green-50 dark:bg-green-900/10',
      'bg-purple-50 dark:bg-purple-900/10',
      'bg-orange-50 dark:bg-orange-900/10',
      'bg-pink-50 dark:bg-pink-900/10',
      'bg-indigo-50 dark:bg-indigo-900/10'
    ];
    return colors[index % colors.length];
  };

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
          <button
            key={action.id}
            onClick={() => onActionClick(action)}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg",
              "transition-all duration-300 transform hover:-translate-y-2",
              "cursor-pointer"
            )}
            aria-label={action.title}
          >
            {/* 배경 그라데이션 */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300",
              getActionBgColor(index)
            )} />
            
            <div className="relative p-6 text-center">
              <div className={cn(
                "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-2xl shadow-lg",
                "transition-all duration-200 group-hover:scale-110",
                getActionColor(index)
              )}>
                {action.icon}
              </div>
              
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {action.title}
              </h4>
              
              {action.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {action.description}
                </p>
              )}
              
              {/* 호버 시 표시될 화살표 */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">→</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 추천 액션 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💡</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                추천 액션
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                AI가 추천하는 다음 액션
              </p>
            </div>
          </div>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            확인하기 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions; 