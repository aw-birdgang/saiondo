import React from 'react';
import { Skeleton } from '../../common';

interface HomeLoadingStateProps {
  className?: string;
}

const HomeLoadingState: React.FC<HomeLoadingStateProps> = ({ className }) => {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className='flex items-center space-x-4'>
        <Skeleton className='h-12 w-12 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-48' />
          <Skeleton className='h-3 w-32' />
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className='h-32' />
        ))}
      </div>
    </div>
  );
};

export default HomeLoadingState;
