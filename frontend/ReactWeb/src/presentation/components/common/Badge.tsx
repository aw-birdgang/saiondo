import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = true,
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary/10 text-primary border border-primary/20';
      case 'secondary':
        return 'bg-secondary text-txt-secondary border border-border';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 border border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800';
      case 'danger':
        return 'bg-error/10 text-error border border-error/20';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 border border-blue-200 dark:border-blue-800';
      case 'outline':
        return 'bg-transparent border border-border text-txt-secondary';
      default:
        return 'bg-primary/10 text-primary border border-primary/20';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getRoundedClass = () => {
    return rounded ? 'rounded-full' : 'rounded-lg';
  };

  return (
    <span
      className={`
        inline-flex items-center font-semibold transition-all duration-200 hover:scale-105
        ${getVariantClasses()} ${getSizeClasses()} ${getRoundedClass()} ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge; 