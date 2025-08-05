import React from 'react';
import { Button } from '../../common';
import { cn } from '../../../../utils/cn';
import SearchResultItem from './SearchResultItem';
import type { SearchResultsProps } from '../../../pages/search/types/searchTypes';

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  hasMore,
  onLoadMore,
  onResultClick,
  className,
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12',
          className
        )}
      >
        <div className='text-6xl mb-4'>🔍</div>
        <h3 className='text-lg font-medium text-txt mb-2'>검색 중...</h3>
        <p className='text-sm text-txt-secondary text-center'>
          검색 결과를 찾고 있습니다.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12',
          className
        )}
      >
        <div className='text-6xl mb-4'>🔍</div>
        <h3 className='text-lg font-medium text-txt mb-2'>
          검색 결과가 없습니다
        </h3>
        <p className='text-sm text-txt-secondary text-center'>
          다른 검색어를 시도해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('', className)}>
      {/* 검색 결과 목록 */}
      <div className='divide-y divide-border'>
        {results.map(result => (
          <SearchResultItem
            key={result.id}
            result={result}
            onClick={onResultClick}
          />
        ))}
      </div>

      {/* 더 보기 버튼 */}
      {hasMore && (
        <div className='flex justify-center p-6'>
          <Button variant='outline' onClick={onLoadMore} className='px-8'>
            더 많은 결과 보기
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
