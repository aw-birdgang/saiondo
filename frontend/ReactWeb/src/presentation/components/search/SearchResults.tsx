import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, LoadingSpinner } from '../common';
import { SearchResultItem } from './SearchResultItem';
import type { SearchResult } from '../../../domain/types/search';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onResultClick: (result: SearchResult) => void;
  className?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  hasMore,
  onLoadMore,
  onResultClick,
  className,
}) => {
  const { t } = useTranslation();

  if (isLoading && results.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <LoadingSpinner size='lg' text='검색 중...' />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-txt-secondary'
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
          </div>
          <h3 className='text-lg font-medium text-txt mb-2'>
            검색 결과가 없습니다
          </h3>
          <p className='text-txt-secondary'>다른 검색어를 시도해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className='max-w-4xl mx-auto'>
        {/* 검색 결과 목록 */}
        <div className='space-y-4'>
          {results.map(result => (
            <SearchResultItem
              key={result.id}
              result={result}
              onClick={onResultClick}
            />
          ))}
        </div>

        {/* 더 많은 결과 로드 버튼 */}
        {hasMore && (
          <div className='mt-8 text-center'>
            <Button onClick={onLoadMore} disabled={isLoading} className='px-8'>
              {isLoading ? (
                <>
                  <LoadingSpinner size='sm' className='mr-2' />
                  로딩 중...
                </>
              ) : (
                '더 많은 결과 보기'
              )}
            </Button>
          </div>
        )}

        {/* 결과 끝 표시 */}
        {!hasMore && results.length > 0 && (
          <div className='mt-8 text-center text-txt-secondary text-sm'>
            모든 검색 결과를 확인했습니다.
          </div>
        )}
      </div>
    </div>
  );
};
