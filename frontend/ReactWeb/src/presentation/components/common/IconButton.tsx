import React from 'react';

type IconButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  loading = false,
  title,
  className = '',
}) => {
  const getVariantClasses = (variant: IconButtonVariant) => {
    const variantClasses = {
      primary: 'bg-primary text-on-primary hover:bg-primary-container focus:ring-primary/20 shadow-sm',
      secondary: 'bg-secondary text-txt-secondary hover:bg-secondary/80 hover:text-txt focus:ring-secondary/20',
      danger: 'bg-error text-on-error hover:bg-error/90 focus:ring-error/20 shadow-sm',
      ghost: 'bg-transparent text-txt-secondary hover:bg-secondary hover:text-txt focus:ring-secondary/20',
    };
    return variantClasses[variant];
  };

  const getSizeClasses = (size: IconButtonSize) => {
    const sizeClasses = {
      sm: 'p-2 text-sm',
      md: 'p-3 text-base',
      lg: 'p-4 text-lg',
    };
    return sizeClasses[size];
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`
        inline-flex items-center justify-center rounded-lg
        font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-105 active:scale-95
        ${getVariantClasses(variant)}
        ${getSizeClasses(size)}
        ${className}
      `}
    >
      {loading ? (
        <div className="spinner" />
      ) : (
        icon
      )}
    </button>
  );
};

export default IconButton; 