import React from 'react';
import { cn } from '../../../../utils/cn';
import type { SearchFiltersProps } from '../../../pages/search/types/searchTypes';

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  className
}) => {
  const hasActiveFilters = selectedFilters.length > 0 && !selectedFilters.includes('all');

  return (
    <div className={cn("p-4 bg-surface border-b border-border", className)}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-txt">검색 필터</h3>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-primary hover:underline"
            >
              필터 초기화
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.type}
              onClick={() => onFilterChange(filter.type)}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                'whitespace-nowrap',
                selectedFilters.includes(filter.type)
                  ? 'bg-primary text-white'
                  : 'bg-focus text-txt hover:bg-focus-dark'
              )}
            >
              <span>{filter.label}</span>
              {filter.count > 0 && (
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs',
                  selectedFilters.includes(filter.type)
                    ? 'bg-white/20'
                    : 'bg-primary text-white'
                )}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters; 