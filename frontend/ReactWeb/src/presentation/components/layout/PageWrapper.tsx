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
  const getBackgroundStyle = () => {
    switch (background) {
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          color: 'var(--color-on-primary)'
        };
      case 'dark':
        return {
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-txt)'
        };
      case 'light':
        return {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-txt)'
        };
      case 'blue':
        return {
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--color-on-secondary)'
        };
      case 'purple':
        return {
          background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
          color: 'var(--color-on-secondary)'
        };
      default:
        return {
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-txt)'
        };
    }
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${className}`}
      style={getBackgroundStyle()}
    >
      {children}
    </div>
  );
};

export default PageWrapper; 