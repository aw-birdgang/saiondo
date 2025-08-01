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
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10';
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10';
      case 'error':
        return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10';
      case 'info':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10';
      default:
        return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-secondary-container';
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
        p-4 rounded-lg border transition-all duration-200
        ${getVariantClasses()}
        ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {icon && (
            <div className="text-2xl mb-2">{icon}</div>
          )}
          
          {title && (
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </h3>
          )}
          
          {value !== undefined && (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}
              </span>
              {trend && (
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {getTrendIcon()} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
          )}
          
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
          
          {description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCard; 