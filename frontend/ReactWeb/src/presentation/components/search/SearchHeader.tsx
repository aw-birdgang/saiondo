import React from 'react';
// import { useTranslation } from 'react-i18next';
import { Input, Button, LoadingSpinner } from '@/presentation/components/common';
import { cn } from '@/utils/cn';

interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onClear: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isSearching: boolean;
  totalResults: number;
  className?: string;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  query,
  onQueryChange,
  onSearch,
  onClear,
  onKeyPress,
  isSearching,
  totalResults,
  className,
}) => {
  // const { t } = useTranslation();

  return (
    <div
      className={cn(
        'sticky top-0 z-10 bg-surface border-b border-border p-4',
        className
      )}
    >
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center space-x-4'>
          {/* 검색 입력창 */}
          <div className='flex-1 relative'>
            <Input
              type='text'
              placeholder='검색어를 입력하세요...'
              value={query}
              onChange={e => onQueryChange(e.target.value)}
              onKeyPress={onKeyPress}
              className='pr-12'
              disabled={isSearching}
            />

            {/* 검색 버튼 */}
            <div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
              {isSearching ? (
                <LoadingSpinner size='sm' />
              ) : (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={onSearch}
                  disabled={!query.trim()}
                  className='h-8 w-8 p-0'
                >
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                </Button>
              )}
            </div>
          </div>

          {/* 클리어 버튼 */}
          {query && (
            <Button
              variant='outline'
              onClick={onClear}
              disabled={isSearching}
              className='whitespace-nowrap'
            >
              클리어
            </Button>
          )}
        </div>

        {/* 검색 결과 수 표시 */}
        {totalResults > 0 && (
          <div className='mt-2 text-sm text-txt-secondary'>
            {totalResults.toLocaleString()}개의 검색 결과
          </div>
        )}
      </div>
    </div>
  );
};
