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
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-400 dark:hover:bg-gray-800',
    };
    return variantClasses[variant];
  };

  const getSizeClasses = (size: IconButtonSize) => {
    const sizeClasses = {
      sm: 'p-1.5 text-sm',
      md: 'p-2 text-base',
      lg: 'p-3 text-lg',
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
        font-medium transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses(variant)}
        ${getSizeClasses(size)}
        ${className}
      `}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
    </button>
  );
};

export default IconButton; 