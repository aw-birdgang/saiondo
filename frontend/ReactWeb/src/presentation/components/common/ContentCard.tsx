import React from 'react';

interface ContentCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  children,
  variant = 'default',
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

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-4';
      case 'lg':
        return 'p-6';
      case 'xl':
        return 'p-8';
      default:
        return 'p-5';
    }
  };

  return (
    <div className={`rounded-lg ${getVariantClasses()} ${getPaddingClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default ContentCard; 