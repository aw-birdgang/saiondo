import React from 'react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'danger':
        return 'bg-error text-on-error hover:bg-error/90 shadow-sm';
      case 'success':
        return 'bg-green-500 text-white hover:bg-green-600 shadow-sm';
      case 'warning':
        return 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-3 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        btn rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95
        ${getVariantClasses()} ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading ? (
        <div className='flex items-center justify-center space-x-2'>
          <div className='spinner' />
          <span>처리 중...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default ActionButton;
