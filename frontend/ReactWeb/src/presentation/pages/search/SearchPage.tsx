import React from 'react';
import { LoadingSpinner } from '../../components/common';
import { ErrorState } from '../../components/specific';
import {
  SearchHeader,
  SearchFilters,
  SearchResults,
  SearchSuggestions,
  SearchContainer
} from '../../components/specific/search';
import { useSearchData } from './hooks/useSearchData';

const SearchPage: React.FC = () => {
  const {
    // 상태
    query,
    results,
    filteredResults,
    isLoading,
    isSearching,
    error,
    filters,
    selectedFilters,
    searchHistory,
    recentSearches,
    suggestions,
    totalResults,
    hasMore,
    searchStats,

    // 액션
    handleQueryChange,
    handleSearch,
    handleClear,
    handleFilterChange,
    handleClearFilters,
    handleSuggestionClick,
    handleRecentSearchClick,
    handleClearHistory,
    handleLoadMore,
    handleResultClick,
    handleKeyPress
  } = useSearchData();

  if (error) {
    return (
      <ErrorState
        title="검색 오류"
        message={error}
        onRetry={handleSearch}
      />
    );
  }

  const hasSearchResults = results.length > 0;
  const showSuggestions = !hasSearchResults && !isSearching;

  return (
    <SearchContainer>
      {/* 헤더 */}
      <SearchHeader
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
        onClear={handleClear}
        isSearching={isSearching}
        totalResults={totalResults}
      />
      
      {/* 필터 */}
      {hasSearchResults && (
        <SearchFilters
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}
      
      {/* 메인 콘텐츠 */}
      <div className="flex-1">
        {showSuggestions ? (
          <SearchSuggestions
            suggestions={suggestions}
            recentSearches={recentSearches}
            onSuggestionClick={handleSuggestionClick}
            onRecentSearchClick={handleRecentSearchClick}
            onClearHistory={handleClearHistory}
          />
        ) : (
          <SearchResults
            results={filteredResults}
            isLoading={isSearching}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onResultClick={handleResultClick}
          />
        )}
      </div>
    </SearchContainer>
  );
};

export default SearchPage; 