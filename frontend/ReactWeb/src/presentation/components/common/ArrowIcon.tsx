import React from 'react';

interface ArrowIconProps {
  direction?: 'left' | 'right' | 'up' | 'down';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({
  direction = 'right',
  size = 'md',
  className = '',
}) => {
  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };
    return sizeClasses[size];
  };

  const getDirectionClasses = (direction: 'left' | 'right' | 'up' | 'down') => {
    const directionClasses = {
      left: 'rotate-180',
      right: '',
      up: '-rotate-90',
      down: 'rotate-90',
    };
    return directionClasses[direction];
  };

  return (
    <svg 
      className={`text-gray-400 ${getSizeClasses(size)} ${getDirectionClasses(direction)} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
};

export default ArrowIcon; 