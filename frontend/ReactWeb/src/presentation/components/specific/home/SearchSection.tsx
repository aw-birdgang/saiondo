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
    <div className={cn("mb-12", className)}>
      <div className="w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-sm">
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 transform rotate-12 scale-150"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative p-10 lg:p-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                </div>
                <div>
                  <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
                    무엇을 찾고 계신가요?
                  </h2>
                </div>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                상담, 조언, 정보를 검색해보세요. <span className="font-semibold text-blue-600 dark:text-blue-400">AI가 도움을 드릴게요.</span>
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto mb-8">
              <SearchInput
                placeholder="상담 주제나 키워드를 입력하세요..."
                className="w-full transform hover:scale-105 transition-transform duration-300"
                onSearch={onSearch}
                showSuggestions={true}
                suggestions={suggestions}
                onSuggestionClick={onSuggestionClick}
              />
            </div>
            
            {/* Enhanced Popular Searches */}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">인기 검색어</p>
              <div className="flex flex-wrap justify-center gap-3">
                {suggestions.slice(0, 6).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="group relative px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="relative z-10">{suggestion}</span>
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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