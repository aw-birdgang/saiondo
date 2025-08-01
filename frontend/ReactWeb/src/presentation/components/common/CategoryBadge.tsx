import React from 'react';

interface CategoryBadgeProps {
  category: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'relationship':
        return {
          color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200',
          icon: '💕',
          label: '관계'
        };
      case 'emotion':
        return {
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200',
          icon: '❤️',
          label: '감정'
        };
      case 'communication':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
          icon: '💬',
          label: '소통'
        };
      case 'conflict':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
          icon: '⚡',
          label: '갈등'
        };
      case 'planning':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
          icon: '🎯',
          label: '계획'
        };
      case 'topic':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
          icon: '📋',
          label: '주제'
        };
      case 'meeting':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
          icon: '🤝',
          label: '미팅'
        };
      case 'date':
        return {
          color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200',
          icon: '💕',
          label: '데이트'
        };
      case 'anniversary':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
          icon: '🎉',
          label: '기념일'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200',
          icon: '📝',
          label: category
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-3 py-1.5 text-sm';
      default:
        return 'px-2.5 py-1 text-sm';
    }
  };

  const config = getCategoryConfig(category);
  const sizeClasses = getSizeClasses();

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${config.color} ${sizeClasses} ${className}
      `}
    >
      {showIcon && <span>{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
};

export default CategoryBadge; 