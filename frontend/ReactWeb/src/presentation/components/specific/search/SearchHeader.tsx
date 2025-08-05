import React from 'react';
import { Button } from '../../common';
import { cn } from '../../../../utils/cn';
import type { SearchHeaderProps } from '../../../pages/search/types/searchTypes';

const SearchHeader: React.FC<SearchHeaderProps> = ({
  query,
  onQueryChange,
  onSearch,
  onClear,
  isSearching,
  totalResults,
  className,
}) => {
  return (
    <div className={cn('p-4 bg-surface border-b border-border', className)}>
      <div className='max-w-4xl mx-auto'>
        {/* 검색 입력창 */}
        <div className='relative'>
          <div className='flex items-center space-x-2'>
            <div className='flex-1 relative'>
              <input
                type='text'
                value={query}
                onChange={e => onQueryChange(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && onSearch()}
                placeholder='사용자, 채널, 메시지, 분석 결과를 검색하세요...'
                className={cn(
                  'w-full px-4 py-3 pl-12 pr-20 border border-border rounded-lg',
                  'focus:outline-none focus:ring-2 focus:ring-primary',
                  'bg-surface text-txt placeholder-txt-secondary',
                  'text-lg'
                )}
              />

              {/* 검색 아이콘 */}
              <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-txt-secondary'>
                🔍
              </div>

              {/* 클리어 버튼 */}
              {query && (
                <button
                  onClick={onClear}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 text-txt-secondary hover:text-txt'
                >
                  ✕
                </button>
              )}
            </div>

            {/* 검색 버튼 */}
            <Button
              variant='primary'
              onClick={onSearch}
              disabled={isSearching || !query.trim()}
              loading={isSearching}
              loadingText='검색 중...'
              className='px-6 py-3'
            >
              검색
            </Button>
          </div>
        </div>

        {/* 검색 결과 통계 */}
        {totalResults > 0 && (
          <div className='mt-4 text-sm text-txt-secondary'>
            {totalResults}개의 검색 결과를 찾았습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHeader;
