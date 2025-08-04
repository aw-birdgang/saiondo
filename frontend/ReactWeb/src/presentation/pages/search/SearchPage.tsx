import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getContainer } from '../../../app/di/container';
import { DI_TOKENS } from '../../../app/di/tokens';
import { useSearch } from '../../hooks/useSearch';
import { useToastContext } from '../../providers/ToastProvider';
import { ErrorState } from '../../components/specific';
import { 
  SearchHeader,
  SearchFilters,
  SearchResults,
  SearchSuggestions,
  SearchContainer
} from '../../components/search';
import type { ISearchUseCase } from '../../../application/usecases/SearchUseCase';

const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToastContext();
  const container = getContainer();

  // Search Use Case 가져오기
  const [searchUseCase] = useState<ISearchUseCase>(() => 
    container.get<ISearchUseCase>(DI_TOKENS.SEARCH_USE_CASE)
  );

  // Search 상태 관리 훅
  const {
    state,
    searchStats,
    filteredResults,
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
    handleKeyPress,
    clearError,
    reset
  } = useSearch(searchUseCase);

  // 에러 처리
  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      clearError();
    }
  }, [state.error, toast, clearError]);

  const hasSearchResults = state.results.length > 0;
  const showSuggestions = !hasSearchResults && !state.isSearching;

  return (
    <SearchContainer>
      {/* 헤더 */}
      <SearchHeader
        query={state.query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
        onClear={handleClear}
        onKeyPress={handleKeyPress}
        isSearching={state.isSearching}
        totalResults={state.totalResults}
      />
      
      {/* 필터 */}
      {hasSearchResults && (
        <SearchFilters
          filters={state.filters}
          selectedFilters={state.selectedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}
      
      {/* 메인 콘텐츠 */}
      <div className="flex-1">
        {showSuggestions ? (
          <SearchSuggestions
            suggestions={state.suggestions}
            recentSearches={state.recentSearches}
            onSuggestionClick={handleSuggestionClick}
            onRecentSearchClick={handleRecentSearchClick}
            onClearHistory={handleClearHistory}
          />
        ) : (
          <SearchResults
            results={filteredResults}
            isLoading={state.isSearching}
            hasMore={state.hasMore}
            onLoadMore={handleLoadMore}
            onResultClick={handleResultClick}
          />
        )}
      </div>
    </SearchContainer>
  );
};

export default SearchPage; 