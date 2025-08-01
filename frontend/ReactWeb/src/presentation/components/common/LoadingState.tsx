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
      <LoadingSpinner size={size} color="primary" className="mb-6" />
      <p className="text-text-secondary text-lg font-medium">{message}</p>
    </div>
  );
};

export default LoadingState; 