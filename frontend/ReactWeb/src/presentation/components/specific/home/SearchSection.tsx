import React from 'react';
import { SearchInput } from '../../search';
import { cn } from '../../../../utils/cn';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  suggestions: string[];
  className?: string;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  onSearch,
  onSuggestionClick,
  suggestions,
  className
}) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 transform rotate-12 scale-150"></div>
          </div>
          
          <div className="relative p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  무엇을 찾고 계신가요?
                </h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                상담, 조언, 정보를 검색해보세요. AI가 도움을 드릴게요.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <SearchInput
                placeholder="상담 주제나 키워드를 입력하세요..."
                className="w-full"
                onSearch={onSearch}
                showSuggestions={true}
                suggestions={suggestions}
                onSuggestionClick={onSuggestionClick}
              />
            </div>
            
            {/* Popular Searches */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">인기 검색어</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.slice(0, 4).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:shadow-md"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection; 