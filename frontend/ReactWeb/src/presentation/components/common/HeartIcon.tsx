import React from 'react';

interface HeartIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animated?: boolean;
  className?: string;
}

const HeartIcon: React.FC<HeartIconProps> = ({
  size = 'md',
  animated = false,
  className = '',
}) => {
  const getSizeClasses = (size: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    const sizeClasses = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-3xl',
      xl: 'text-4xl',
      '2xl': 'text-5xl',
    };
    return sizeClasses[size];
  };

  return (
    <div className={`${getSizeClasses(size)} ${className}`}>
      <span
        className={`text-pink-500 transition-all duration-300 ${
          animated ? 'animate-pulse hover:scale-110' : 'hover:scale-105'
        }`}
      >
        ❤️
      </span>
    </div>
  );
};

export default HeartIcon;
