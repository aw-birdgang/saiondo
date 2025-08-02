import React from 'react';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  text: string;
  type?: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  text,
  type = 'default',
  size = 'md',
  className = '',
}) => {
  const getTypeClasses = (type: StatusType) => {
    const typeClasses = {
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800',
      default: 'bg-secondary text-txt-secondary border border-border',
    };
    return typeClasses[type];
  };

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    const sizeClasses = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-3 py-1.5',
      lg: 'text-base px-4 py-2',
    };
    return sizeClasses[size];
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium transition-all duration-200 ${getTypeClasses(type)} ${getSizeClasses(size)} ${className}`}
    >
      {text}
    </span>
  );
};

export default StatusBadge; 