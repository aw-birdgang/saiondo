import React from 'react';
import LoadingSpinner from '../../common/LoadingSpinner';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = '로딩 중...',
  size = 'lg',
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center ${className}`}>
      <div className="text-center">
        <LoadingSpinner size={size} />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingState; 