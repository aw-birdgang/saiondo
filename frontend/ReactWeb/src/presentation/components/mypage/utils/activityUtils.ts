export type ActivityType = 'chat' | 'ai' | 'channel' | 'analysis';

export const getActivityIcon = (type: ActivityType): string => {
  switch (type) {
    case 'chat':
      return '💬';
    case 'ai':
      return '🤖';
    case 'channel':
      return '👥';
    case 'analysis':
      return '📊';
  }
};

export const getActivityColor = (type: ActivityType): string => {
  switch (type) {
    case 'chat':
      return 'from-blue-500 to-blue-600';
    case 'ai':
      return 'from-purple-500 to-purple-600';
    case 'channel':
      return 'from-green-500 to-green-600';
    case 'analysis':
      return 'from-orange-500 to-orange-600';
  }
};

export const getActivityBgColor = (type: ActivityType): string => {
  switch (type) {
    case 'chat':
      return 'bg-blue-50 dark:bg-blue-900/10';
    case 'ai':
      return 'bg-purple-50 dark:bg-purple-900/10';
    case 'channel':
      return 'bg-green-50 dark:bg-green-900/10';
    case 'analysis':
      return 'bg-orange-50 dark:bg-orange-900/10';
  }
};

export const getTypeLabel = (type: ActivityType): string => {
  switch (type) {
    case 'chat':
      return '채팅';
    case 'ai':
      return 'AI 분석';
    case 'channel':
      return '채널';
    case 'analysis':
      return '분석';
  }
};

export const getTypeBadgeColor = (type: ActivityType): string => {
  switch (type) {
    case 'chat':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
    case 'ai':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
    case 'channel':
      return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
    case 'analysis':
      return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
  }
};
