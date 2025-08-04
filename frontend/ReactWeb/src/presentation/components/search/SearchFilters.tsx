import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Badge } from '../common';
import { cn } from '../../../utils/cn';
import type { SearchFilter } from '../../../domain/types/search';

interface SearchFiltersProps {
  filters: SearchFilter[];
  selectedFilters: string[];
  onFilterChange: (filterType: string) => void;
  onClearFilters: () => void;
  className?: string;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  className
}) => {
  const { t } = useTranslation();

  const hasActiveFilters = selectedFilters.length > 0 && !selectedFilters.includes('all');

  return (
    <div className={cn('bg-surface border-b border-border p-4', className)}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-txt">필터</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-txt-secondary hover:text-txt"
            >
              필터 초기화
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isSelected = selectedFilters.includes(filter.type);
            const isAllFilter = filter.type === 'all';
            
            return (
              <Button
                key={filter.type}
                variant={isSelected ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onFilterChange(filter.type)}
                className="flex items-center space-x-2"
              >
                <span>{filter.label}</span>
                {!isAllFilter && filter.count > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {filter.count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* 선택된 필터 표시 */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm text-txt-secondary">선택된 필터:</span>
            {selectedFilters.map((filterType) => {
              const filter = filters.find(f => f.type === filterType);
              if (!filter || filter.type === 'all') return null;
              
              return (
                <Badge
                  key={filterType}
                  variant="default"
                  className="flex items-center space-x-1"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => onFilterChange(filterType)}
                    className="ml-1 hover:bg-primary/20 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}; 