import React from 'react';

interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  hover?: 'none' | 'shadow' | 'scale' | 'both';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  onClick,
  variant = 'default',
  hover = 'shadow',
  padding = 'md',
  className = '',
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

  const getHoverClasses = () => {
    if (!onClick) return '';

    switch (hover) {
      case 'scale':
        return 'hover:scale-[1.02] transition-transform duration-200 cursor-pointer';
      case 'both':
        return 'hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer';
      default:
        return 'hover:shadow-md transition-shadow duration-200 cursor-pointer';
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
    <div
      className={`
        rounded-xl ${getVariantClasses()} ${getHoverClasses()} ${getPaddingClasses()} ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

InteractiveCard.displayName = 'InteractiveCard';
