import React from 'react';
import { cn } from '../../../../utils/cn';
import type { SearchContainerProps } from '../../../pages/search/types/searchTypes';

const SearchContainer: React.FC<SearchContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {children}
    </div>
  );
};

export default SearchContainer;
