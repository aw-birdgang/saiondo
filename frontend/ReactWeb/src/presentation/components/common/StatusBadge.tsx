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
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };
    return typeClasses[type];
  };

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    const sizeClasses = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-3 py-1',
      lg: 'text-base px-4 py-2',
    };
    return sizeClasses[size];
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${getTypeClasses(type)} ${getSizeClasses(size)} ${className}`}
    >
      {text}
    </span>
  );
};

export default StatusBadge; 