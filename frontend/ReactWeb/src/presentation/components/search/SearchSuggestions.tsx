import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../common';
import { cn } from '../../../utils/cn';

interface SearchSuggestionsProps {
  suggestions: string[];
  recentSearches: string[];
  onSuggestionClick: (suggestion: string) => void;
  onRecentSearchClick: (search: string) => void;
  onClearHistory: () => void;
  className?: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  recentSearches,
  onSuggestionClick,
  onRecentSearchClick,
  onClearHistory,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn('max-w-4xl mx-auto p-6', className)}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* 검색 제안 */}
        <div>
          <h3 className='text-lg font-medium text-txt mb-4'>추천 검색어</h3>
          <div className='space-y-2'>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className='w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors group'
                >
                  <div className='flex items-center space-x-3'>
                    <svg
                      className='w-4 h-4 text-txt-secondary group-hover:text-primary'
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
                    <span className='text-txt group-hover:text-primary'>
                      {suggestion}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className='text-center py-8'>
                <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3'>
                  <svg
                    className='w-6 h-6 text-txt-secondary'
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
                <p className='text-txt-secondary'>
                  검색어를 입력하면 추천 검색어가 나타납니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 최근 검색어 */}
        <div>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-medium text-txt'>최근 검색어</h3>
            {recentSearches.length > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onClearHistory}
                className='text-txt-secondary hover:text-txt'
              >
                기록 삭제
              </Button>
            )}
          </div>

          <div className='space-y-2'>
            {recentSearches.length > 0 ? (
              recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => onRecentSearchClick(search)}
                  className='w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors group'
                >
                  <div className='flex items-center space-x-3'>
                    <svg
                      className='w-4 h-4 text-txt-secondary group-hover:text-primary'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    <span className='text-txt group-hover:text-primary'>
                      {search}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className='text-center py-8'>
                <div className='w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3'>
                  <svg
                    className='w-6 h-6 text-txt-secondary'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <p className='text-txt-secondary'>아직 검색 기록이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 트렌딩 검색어 */}
      <div className='mt-8'>
        <h3 className='text-lg font-medium text-txt mb-4'>인기 검색어</h3>
        <div className='flex flex-wrap gap-2'>
          {[
            'React 개발',
            'TypeScript',
            '프론트엔드',
            'AI 상담사',
            '관계 분석',
            '채팅 기능',
          ].map((trend, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(trend)}
              className='px-3 py-2 bg-secondary text-txt rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors'
            >
              #{trend}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
