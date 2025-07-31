import React from 'react';
import Button from '../../common/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  icon?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = '오류가 발생했습니다',
  message = '문제가 발생했습니다. 다시 시도해주세요.',
  icon = '❌',
  onRetry,
  retryText = '다시 시도',
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center ${className}`}>
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">{icon}</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
          >
            {retryText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState; 