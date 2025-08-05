import React from 'react';
import { cn } from '../../../utils/cn';

interface ContentGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  children,
  className,
  columns = 2,
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 xl:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div
      className={cn(
        'grid gap-6 lg:gap-8',
        gridClasses[columns],
        'animate-in fade-in duration-500',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ContentGrid;
