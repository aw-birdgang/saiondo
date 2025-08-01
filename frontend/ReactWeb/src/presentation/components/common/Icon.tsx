import React from 'react';

interface IconProps {
  icon: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'white' | 'gray';
  background?: 'none' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
  rounded?: boolean;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  icon,
  size = 'md',
  color = 'gray',
  background = 'none',
  rounded = false,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'w-4 h-4 text-xs';
      case 'sm':
        return 'w-6 h-6 text-sm';
      case 'lg':
        return 'w-10 h-10 text-lg';
      case 'xl':
        return 'w-12 h-12 text-xl';
      case '2xl':
        return 'w-16 h-16 text-2xl';
      default:
        return 'w-8 h-8 text-base';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return 'text-blue-600 dark:text-blue-400';
      case 'secondary':
        return 'text-gray-600 dark:text-gray-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'danger':
        return 'text-red-600 dark:text-red-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      case 'white':
        return 'text-white';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getBackgroundClass = () => {
    if (background === 'none') return '';
    
    switch (background) {
      case 'primary':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'secondary':
        return 'bg-gray-100 dark:bg-gray-900/20';
      case 'success':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'danger':
        return 'bg-red-100 dark:bg-red-900/20';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'gray':
        return 'bg-gray-100 dark:bg-gray-900/20';
      default:
        return '';
    }
  };

  const getRoundedClass = () => {
    return rounded ? 'rounded-full' : '';
  };

  return (
    <div
      className={`
        flex items-center justify-center ${getSizeClasses()} ${getColorClass()} ${getBackgroundClass()} ${getRoundedClass()} ${className}
      `}
    >
      {icon}
    </div>
  );
};

export default Icon; 