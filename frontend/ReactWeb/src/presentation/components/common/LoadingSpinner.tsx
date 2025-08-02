import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'text';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    };
    return sizeClasses[size];
  };

  const getColorClasses = (color: 'primary' | 'secondary' | 'text') => {
    const colorClasses = {
      primary: 'text-primary',
      secondary: 'text-txt-secondary',
      text: 'text-txt',
    };
    return colorClasses[color];
  };

  return (
    <div className={`spinner ${getSizeClasses(size)} ${getColorClasses(color)} ${className}`}>
    </div>
  );
};

export default LoadingSpinner; 