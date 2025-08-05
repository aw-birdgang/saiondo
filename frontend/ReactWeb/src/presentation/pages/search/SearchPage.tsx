import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useSearchData } from './hooks/useSearchData';
import { useToastContext } from '../../providers/ToastProvider';
import { SearchContainer, SearchFilters, SearchHeader, SearchResults, SearchSuggestions } from '../../components/search';
import { ErrorState } from '../../components/specific';

const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const toast = useToastContext();

  // URL에서 초기 검색어 가져오기
  const initialQuery = searchParams.get('q') || '';

  // Search 상태 관리 훅
  const {
    query,
    results,
    isLoading,
    error,
    total,
    page,
    hasMore,
    selectedFilters,
    handleQueryChange,
    handleFilterChange,
    loadMore,
    getSuggestions,
    getTrendingSearches,
    getSearchHistory,
    clearSearchHistory,
    resetSearch
  } = useSearchData();

  // 검색 제안 및 인기 검색어 상태
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = React.useState<string[]>([]);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  // URL 쿼리 파라미터가 있으면 초기 검색 실행
  React.useEffect(() => {
    if (initialQuery && !query) {
      handleQueryChange(initialQuery);
    }
  }, [initialQuery, query, handleQueryChange]);

  // 검색어 변경 시 제안 로드
  React.useEffect(() => {
    const loadSuggestions = async () => {
      if (query.trim()) {
        const suggestionResults = await getSuggestions(query);
        setSuggestions(suggestionResults);
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(loadSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query, getSuggestions]);

  // 초기 데이터 로드
  React.useEffect(() => {
    const loadInitialData = async () => {
      const [trending, recent] = await Promise.all([
        getTrendingSearches(),
        getSearchHistory()
      ]);
      setTrendingSearches(trending);
      setRecentSearches(recent);
    };

    loadInitialData();
  }, [getTrendingSearches, getSearchHistory]);

  // 에러 처리
  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);

  // 검색 실행
  const handleSearch = () => {
    if (!query.trim()) return;
    // handleQueryChange는 이미 디바운스되어 있으므로 추가 처리 불필요
  };

  // 검색어 클리어
  const handleClear = () => {
    resetSearch();
  };

  // 키보드 이벤트 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 제안어 클릭
  const handleSuggestionClick = (suggestion: string) => {
    handleQueryChange(suggestion);
  };

  // 최근 검색어 클릭
  const handleRecentSearchClick = (search: string) => {
    handleQueryChange(search);
  };

  // 검색 기록 삭제
  const handleClearHistory = async () => {
    await clearSearchHistory();
    setRecentSearches([]);
  };

  // 검색 결과 클릭
  const handleResultClick = (result: any) => {
    // 검색어를 히스토리에 추가하는 로직은 서버에서 처리
    console.log('Search result clicked:', result);
    // 실제로는 라우터를 사용하여 결과 페이지로 이동
  };

  const hasSearchResults = results.length > 0;
  const showSuggestions = !hasSearchResults && !isLoading && !query.trim();

  if (error) {
    return (
      <ErrorState
        title="검색 중 오류가 발생했습니다"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <SearchContainer>
      {/* 헤더 */}
      <SearchHeader
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
        onClear={handleClear}
        onKeyPress={handleKeyPress}
        isSearching={isLoading}
        totalResults={total}
      />

      {/* 필터 */}
      {hasSearchResults && (
        <SearchFilters
          filters={[
            { type: 'all', label: '전체', count: total, isActive: Object.keys(selectedFilters).length === 0 },
            { type: 'message', label: '메시지', count: results.filter(r => r.type === 'message').length, isActive: selectedFilters.type === 'message' },
            { type: 'channel', label: '채널', count: results.filter(r => r.type === 'channel').length, isActive: selectedFilters.type === 'channel' },
            { type: 'user', label: '사용자', count: results.filter(r => r.type === 'user').length, isActive: selectedFilters.type === 'user' },
            { type: 'file', label: '파일', count: results.filter(r => r.type === 'file').length, isActive: selectedFilters.type === 'file' }
          ]}
          selectedFilters={Object.keys(selectedFilters).length > 0 ? Object.keys(selectedFilters) : ['all']}
          onFilterChange={(filterType) => {
            const newFilters = filterType === 'all' 
              ? {} 
              : { type: filterType };
            handleFilterChange(newFilters);
          }}
          onClearFilters={() => handleFilterChange({})}
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
            results={results.map(result => ({
              ...result,
              description: result.content || '',
              url: `/${result.type}/${result.id}`,
              type: result.type === 'file' ? 'category' : result.type as any
            }))}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onResultClick={handleResultClick}
          />
        )}
      </div>
    </SearchContainer>
  );
};

export default SearchPage;
