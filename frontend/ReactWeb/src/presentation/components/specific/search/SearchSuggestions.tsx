import React from 'react';
import { cn } from '@/utils/cn';
import { TRENDING_SEARCHES } from '@/presentation/pages/search/constants/searchData';
import type { SearchSuggestionsProps } from '@/presentation/pages/search/types/searchTypes';

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  recentSearches,
  onSuggestionClick,
  onRecentSearchClick,
  onClearHistory,
  className,
}) => {
  return (
    <div className={cn('p-6', className)}>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* 최근 검색어 */}
        {recentSearches.length > 0 && (
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-txt'>최근 검색어</h3>
              <button
                onClick={onClearHistory}
                className='text-sm text-txt-secondary hover:text-txt'
              >
                기록 삭제
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {recentSearches.slice(0, 8).map((search, index) => (
                <button
                  key={index}
                  onClick={() => onRecentSearchClick(search)}
                  className='px-3 py-2 bg-focus text-txt rounded-lg hover:bg-focus-dark transition-colors text-sm'
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 검색 제안 */}
        {suggestions.length > 0 && (
          <div>
            <h3 className='text-lg font-medium text-txt mb-4'>검색 제안</h3>
            <div className='flex flex-wrap gap-2'>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className='px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm'
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 인기 검색어 */}
        <div>
          <h3 className='text-lg font-medium text-txt mb-4'>인기 검색어</h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            {TRENDING_SEARCHES.map((search, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(search)}
                className='p-3 bg-surface border border-border rounded-lg hover:bg-focus transition-colors text-left'
              >
                <div className='text-sm font-medium text-txt'>{search}</div>
                <div className='text-xs text-txt-secondary mt-1'>🔥 인기</div>
              </button>
            ))}
          </div>
        </div>

        {/* 검색 팁 */}
        <div className='bg-primary/5 border border-primary/20 rounded-lg p-4'>
          <h4 className='font-medium text-txt mb-2'>💡 검색 팁</h4>
          <ul className='text-sm text-txt-secondary space-y-1'>
            <li>• 사용자 이름으로 친구를 찾아보세요</li>
            <li>• 채널명으로 관심 있는 채널을 검색하세요</li>
            <li>• 메시지 내용으로 대화를 찾아보세요</li>
            <li>• 태그나 키워드로 관련 내용을 검색하세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;
