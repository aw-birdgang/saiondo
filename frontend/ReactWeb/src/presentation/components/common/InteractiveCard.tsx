import React from 'react';

interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  hover?: 'none' | 'shadow' | 'scale' | 'both';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  onClick,
  variant = 'default',
  hover = 'shadow',
  padding = 'md',
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white dark:bg-dark-secondary-container shadow-lg border border-gray-200 dark:border-gray-700';
      case 'outlined':
        return 'bg-transparent border-2 border-gray-200 dark:border-gray-700';
      case 'filled':
        return 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
      default:
        return 'bg-white dark:bg-dark-secondary-container shadow-sm border border-gray-200 dark:border-gray-700';
    }
  };

  const getHoverClasses = () => {
    if (!onClick) return '';
    
    switch (hover) {
      case 'scale':
        return 'hover:scale-[1.02] transition-transform cursor-pointer';
      case 'both':
        return 'hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer';
      default:
        return 'hover:shadow-md transition-shadow cursor-pointer';
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-3';
      case 'lg':
        return 'p-6';
      case 'xl':
        return 'p-8';
      default:
        return 'p-4';
    }
  };

  return (
    <div
      className={`
        rounded-lg ${getVariantClasses()} ${getHoverClasses()} ${getPaddingClasses()} ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default InteractiveCard; 