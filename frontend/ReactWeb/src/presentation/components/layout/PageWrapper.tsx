import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  background?: 'default' | 'gradient' | 'dark' | 'light' | 'blue' | 'purple';
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  background = 'default',
  className = ''
}) => {
  const getBackgroundClass = () => {
    switch (background) {
      case 'gradient':
        return 'bg-gradient-to-br from-blue-500 to-purple-600';
      case 'dark':
        return 'bg-gray-900 dark:bg-gray-900';
      case 'light':
        return 'bg-white dark:bg-white';
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-900/10';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-900/10';
      default:
        return 'bg-gray-50 dark:bg-dark-surface';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} ${className}`}>
      {children}
    </div>
  );
};

export default PageWrapper; 