import React from 'react';
import { cn } from '../../../../utils/cn';
import type { ActivityStatsProps } from '../../../pages/mypage/types/mypageTypes';

const ActivityStats: React.FC<ActivityStatsProps> = ({
  stats,
  className
}) => {
  const getStatIcon = (label: string) => {
    const iconMap: Record<string, string> = {
      '총 채팅': '💬',
      'AI 분석': '🤖',
      '채널 참여': '📢',
      '활동 점수': '⭐',
      '총 메시지': '💬',
      '분석 횟수': '📊',
      '참여 채널': '🏠',
      '평균 점수': '📈'
    };
    return iconMap[label] || '📊';
  };

  const getStatColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-red-500 to-red-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          활동 통계
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          최근 30일 기준
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg",
              "transition-all duration-300 transform hover:-translate-y-1",
              "cursor-pointer"
            )}
            role="button"
            tabIndex={0}
            aria-label={`${stat.label}: ${stat.value}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // 클릭 이벤트 처리
              }
            }}
          >
            {/* 배경 그라데이션 */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300",
              getStatColor(index)
            )} />
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xl",
                  getStatColor(index)
                )}>
                  {getStatIcon(stat.label)}
                </div>
                
                {stat.trend && (
                  <div className={cn(
                    "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                    "transition-all duration-200",
                    stat.trend?.startsWith('+') 
                      ? "text-green-600 bg-green-100 dark:bg-green-900/20" 
                      : stat.trend?.startsWith('-')
                      ? "text-red-600 bg-red-100 dark:bg-red-900/20"
                      : "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
                  )}>
                    <span className="mr-1">
                      {stat.trend?.startsWith('+') ? '↗' : stat.trend?.startsWith('-') ? '↘' : '→'}
                    </span>
                    {stat.trend}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              
              {/* 호버 시 표시될 추가 정보 */}
              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full">
                  자세히 보기
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 요약 정보 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
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
                지난 주 대비 12% 증가
              </p>
            </div>
          </div>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            상세보기 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityStats; 