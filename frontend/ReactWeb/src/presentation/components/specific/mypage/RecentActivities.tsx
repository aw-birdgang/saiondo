import React from 'react';
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

  const getActivityColor = (type: 'chat' | 'ai' | 'channel' | 'analysis') => {
    switch (type) {
      case 'chat': return 'from-blue-500 to-blue-600';
      case 'ai': return 'from-purple-500 to-purple-600';
      case 'channel': return 'from-green-500 to-green-600';
      case 'analysis': return 'from-orange-500 to-orange-600';
    }
  };

  const getActivityBgColor = (type: 'chat' | 'ai' | 'channel' | 'analysis') => {
    switch (type) {
      case 'chat': return 'bg-blue-50 dark:bg-blue-900/10';
      case 'ai': return 'bg-purple-50 dark:bg-purple-900/10';
      case 'channel': return 'bg-green-50 dark:bg-green-900/10';
      case 'analysis': return 'bg-orange-50 dark:bg-orange-900/10';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            최근 활동
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            최근 7일간의 활동 내역입니다
          </p>
        </div>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          전체보기 →
        </button>
      </div>

      {/* 활동 목록 */}
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className={cn(
              "group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg",
              "transition-all duration-300 transform hover:-translate-y-1",
              "cursor-pointer"
            )}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* 배경 그라데이션 */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r opacity-5 group-hover:opacity-10 transition-opacity duration-300",
              getActivityBgColor(activity.type)
            )} />
            
            <div className="relative p-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xl shadow-lg",
                  "transition-all duration-200 group-hover:scale-110",
                  getActivityColor(activity.type)
                )}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.action}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      activity.type === 'chat' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                      activity.type === 'ai' && "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
                      activity.type === 'channel' && "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
                      activity.type === 'analysis' && "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                    )}>
                      {activity.type === 'chat' && '채팅'}
                      {activity.type === 'ai' && 'AI 분석'}
                      {activity.type === 'channel' && '채널'}
                      {activity.type === 'analysis' && '분석'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 빈 상태 */}
      {activities.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-4xl mb-4">📝</div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            아직 활동 내역이 없습니다
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            새로운 활동을 시작해보세요!
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            활동 시작하기
          </button>
        </div>
      )}

      {/* 활동 요약 */}
      {activities.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/10 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📈</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  이번 주 활동 요약
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  총 {activities.length}개의 활동
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activities.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                활동
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivities; 