import React from 'react';

interface StatCardProps {
  stat: {
    label: string;
    value: string | number;
    trend?: string;
  };
  index: number;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, onClick }) => {
  const getStatIcon = (label: string) => {
    const iconMap: Record<string, string> = {
      '총 채팅': '💬',
      'AI 분석': '🤖',
      '채널 참여': '📢',
      '활동 점수': '⭐',
      '총 메시지': '💬',
      '분석 횟수': '📊',
      '참여 채널': '🏠',
      '평균 점수': '📈',
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
      'from-red-500 to-red-600',
    ];
    return colors[index % colors.length];
  };

  const getTrendColor = (trend?: string) => {
    if (!trend) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    if (trend.startsWith('+'))
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (trend.startsWith('-'))
      return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
  };

  const getTrendIcon = (trend?: string) => {
    if (!trend) return '→';
    if (trend.startsWith('+')) return '↗';
    if (trend.startsWith('-')) return '↘';
    return '→';
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
      role='button'
      tabIndex={0}
      aria-label={`${stat.label}: ${stat.value}`}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      onClick={onClick}
    >
      {/* 배경 그라데이션 */}
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${getStatColor(index)}`}
      />

      <div className='relative p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div
            className={`w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xl ${getStatColor(index)}`}
          >
            {getStatIcon(stat.label)}
          </div>

          {stat.trend && (
            <div
              className={`flex items-center text-xs font-medium px-2 py-1 rounded-full transition-all duration-200 ${getTrendColor(stat.trend)}`}
            >
              <span className='mr-1'>{getTrendIcon(stat.trend)}</span>
              {stat.trend}
            </div>
          )}
        </div>

        <div className='space-y-2'>
          <p className='text-sm font-medium text-gray-600 dark:text-gray-300'>
            {stat.label}
          </p>
          <p className='text-3xl font-bold text-gray-900 dark:text-white'>
            {stat.value}
          </p>
        </div>

        {/* 호버 시 표시될 추가 정보 */}
        <div className='absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center'>
          <span className='text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full'>
            자세히 보기
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
