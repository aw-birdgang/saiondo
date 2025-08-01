import React from 'react';
import { useTranslation } from 'react-i18next';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  icon,
}) => {
  const { t } = useTranslation();

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container focus:ring-primary/20 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary text-on-secondary hover:bg-secondary-container focus:ring-secondary/20',
    danger: 'bg-error text-on-error hover:bg-error/90 focus:ring-error/20',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500/20',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500/20',
    outline: 'bg-transparent text-primary border border-primary hover:bg-primary hover:text-on-primary focus:ring-primary/20',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <div className="spinner mr-2"></div>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {loading ? t('common.loading') : children}
    </button>
  );
};

export default Button; 