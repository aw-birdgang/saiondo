import React from 'react';

interface InfoCardProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  value?: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  subtitle,
  icon,
  value,
  description,
  trend,
  onClick,
  className = '',
  variant = 'default',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/10';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10';
      default:
        return 'border-border bg-surface';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.isPositive ? '↗' : '↘';
  };

  const getTrendColor = () => {
    if (!trend) return '';
    return trend.isPositive
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <div
      className={`
        card p-6 transition-all duration-200
        ${getVariantClasses()}
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          {icon && <div className='text-3xl mb-4'>{icon}</div>}

          {title && (
            <h3 className='text-sm font-medium text-txt-secondary mb-2'>
              {title}
            </h3>
          )}

          {value !== undefined && (
            <div className='flex items-baseline gap-3 mb-2'>
              <span className='text-3xl font-bold text-txt'>{value}</span>
              {trend && (
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {getTrendIcon()} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
          )}

          {subtitle && (
            <p className='text-sm text-txt-secondary mb-2'>{subtitle}</p>
          )}

          {description && (
            <p className='text-xs text-txt-secondary leading-relaxed'>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
