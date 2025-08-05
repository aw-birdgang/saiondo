import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface PageLoaderProps {
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  message = '페이지를 로딩 중입니다...',
}) => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-center'>
        <LoadingSpinner size='lg' />
        <p className='mt-4 text-gray-600'>{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;
