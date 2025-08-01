import React from 'react';

interface HeartIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const HeartIcon: React.FC<HeartIconProps> = ({
  size = 'md',
  animated = false,
  className = '',
}) => {
  const getSizeClasses = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    const sizeClasses = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-3xl',
      xl: 'text-4xl',
    };
    return sizeClasses[size];
  };

  return (
    <div className={`${getSizeClasses(size)} ${className}`}>
      <span className={`text-pink-400 ${animated ? 'animate-pulse' : ''}`}>
        ❤️
      </span>
    </div>
  );
};

export default HeartIcon; 