import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
}) => {
  return (
    <div className='flex flex-col items-center justify-center p-8 text-center'>
      <div className='w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4'>
        <svg
          className='w-8 h-8 text-red-600 dark:text-red-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
          />
        </svg>
      </div>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
        Something went wrong
      </h3>
      <p className='text-gray-600 dark:text-gray-400 mb-4 max-w-md'>{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
