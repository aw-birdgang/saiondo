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
        return 'bg-surface shadow-xl border border-border';
      case 'outlined':
        return 'bg-transparent border-2 border-border';
      case 'filled':
        return 'bg-secondary border border-border';
      default:
        return 'bg-surface shadow-sm border border-border';
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
    <div className={`rounded-xl transition-all duration-200 hover:shadow-md ${getVariantClasses()} ${getPaddingClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default ContentCard; 