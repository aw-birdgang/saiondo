import React from 'react';
import type { ReactNode } from 'react';
import { LoadingSpinner } from '@/presentation/components/common/LoadingSpinner';

interface InfiniteScrollLoaderProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  children: ReactNode;
}

export const InfiniteScrollLoader: React.FC<InfiniteScrollLoaderProps> = ({
  isLoading,
  hasMore,
  onLoadMore,
  children,
}) => {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollTop + clientHeight >= scrollHeight - 100 &&
      !isLoading &&
      hasMore
    ) {
      onLoadMore();
    }
  };

  return (
    <div className='h-full overflow-y-auto' onScroll={handleScroll}>
      {children}
      {isLoading && (
        <div className='flex justify-center p-4'>
          <LoadingSpinner size='sm' />
        </div>
      )}
      {!hasMore && (
        <div className='text-center p-4 text-gray-500'>
          모든 항목을 불러왔습니다.
        </div>
      )}
    </div>
  );
};
