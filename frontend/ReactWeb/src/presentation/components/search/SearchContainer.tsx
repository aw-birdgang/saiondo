import React from 'react';
import { cn } from '@/utils/cn';

interface SearchContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const SearchContainer: React.FC<SearchContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('min-h-screen bg-bg flex flex-col', className)}>
      {children}
    </div>
  );
};
