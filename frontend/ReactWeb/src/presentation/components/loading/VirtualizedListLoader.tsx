import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface VirtualizedListLoaderProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => ReactNode;
  isLoading?: boolean;
}

export const VirtualizedListLoader: React.FC<VirtualizedListLoaderProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  isLoading = false,
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length);

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      className='overflow-y-auto'
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
      {isLoading && (
        <div className='flex justify-center p-4'>
          <LoadingSpinner size='sm' />
        </div>
      )}
    </div>
  );
};
