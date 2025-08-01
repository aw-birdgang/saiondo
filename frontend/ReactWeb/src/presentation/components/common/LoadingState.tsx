import React from 'react';
import { LoadingSpinner } from './index';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = '로딩 중...',
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
      <LoadingSpinner size={size} color="blue" className="mb-4" />
      <p className="text-gray-600 dark:text-gray-400 text-lg">{message}</p>
    </div>
  );
};

export default LoadingState; 