import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '../providers/ToastProvider';
import type {
  SearchState,
  SearchResult,
  SearchFilter,
  SearchRequest,
} from '../../domain/types/search';
import type { ISearchUseCase } from '../../application/usecases/SearchUseCase';

const SEARCH_FILTERS: SearchFilter[] = [
  { type: 'all', label: '전체', count: 0, isActive: true },
  { type: 'user', label: '사용자', count: 0, isActive: false },
  { type: 'channel', label: '채널', count: 0, isActive: false },
  { type: 'message', label: '메시지', count: 0, isActive: false },
  { type: 'analysis', label: '분석', count: 0, isActive: false },
  { type: 'assistant', label: 'AI 상담사', count: 0, isActive: false },
  { type: 'category', label: '카테고리', count: 0, isActive: false },
];

export const useSearch = (searchUseCase: ISearchUseCase) => {
  const navigate = useNavigate();
  const toast = useToastContext();

  const [state, setState] = useState<SearchState>({
    isLoading: false,
    isSearching: false,
    error: null,
    query: '',
    results: [],
    filters: SEARCH_FILTERS,
    selectedFilters: ['all'],
    searchHistory: [],
    recentSearches: [],
    suggestions: [],
    totalResults: 0,
    currentPage: 1,
    hasMore: false,
  });

  // 검색 통계 계산
  const searchStats = useMemo(() => {
    const stats = {
      totalResults: state.results.length,
      byType: {} as Record<string, number>,
      searchTime: 0,
      query: state.query,
    };

    // 타입별 통계
    state.results.forEach(result => {
      stats.byType[result.type] = (stats.byType[result.type] || 0) + 1;
    });

    return stats;
  }, [state.results, state.query]);

  // 필터링된 결과 계산
  const filteredResults = useMemo(() => {
    if (state.selectedFilters.includes('all')) {
      return state.results;
    }
    return state.results.filter(result =>
      state.selectedFilters.includes(result.type)
    );
  }, [state.results, state.selectedFilters]);

  // 검색 실행
  const performSearch = useCallback(
    async (query: string, page: number = 1) => {
      if (!query.trim()) {
        setState(prev => ({
          ...prev,
          results: [],
          totalResults: 0,
          hasMore: false,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        isSearching: true,
        error: null,
        currentPage: page,
      }));

      try {
        const request: SearchRequest = {
          query,
          filters: state.selectedFilters.includes('all')
            ? []
            : state.selectedFilters,
          page,
          limit: 10,
        };

        const response = await searchUseCase.search(request);

        // 필터 업데이트
        const updatedFilters = SEARCH_FILTERS.map(filter => ({
          ...filter,
          count:
            filter.type === 'all'
              ? response.totalResults
              : response.results.filter(result => result.type === filter.type)
                  .length,
        }));

        setState(prev => ({
          ...prev,
          results:
            page === 1
              ? response.results
              : [...prev.results, ...response.results],
          filters: updatedFilters,
          totalResults: response.totalResults,
          hasMore: response.hasMore,
          isSearching: false,
        }));

        // 검색 히스토리에 저장
        await searchUseCase.saveSearchHistory(query, response.totalResults);

        toast.success(`${response.totalResults}개의 검색 결과를 찾았습니다.`);
      } catch (error) {
        console.error('Search failed:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error ? error.message : '검색에 실패했습니다.',
          isSearching: false,
        }));
        toast.error('검색에 실패했습니다.');
      }
    },
    [state.selectedFilters, searchUseCase, toast]
  );

  // 검색어 변경
  const handleQueryChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
  }, []);

  // 검색 실행
  const handleSearch = useCallback(() => {
    if (!state.query.trim()) return;
    performSearch(state.query, 1);
  }, [state.query, performSearch]);

  // 검색어 클리어
  const handleClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      query: '',
      results: [],
      totalResults: 0,
      hasMore: false,
      selectedFilters: ['all'],
    }));
  }, []);

  // 필터 변경
  const handleFilterChange = useCallback((filterType: string) => {
    setState(prev => {
      let newSelectedFilters: string[];

      if (filterType === 'all') {
        newSelectedFilters = ['all'];
      } else {
        newSelectedFilters = prev.selectedFilters.includes('all')
          ? [filterType]
          : prev.selectedFilters.includes(filterType)
            ? prev.selectedFilters.filter(f => f !== filterType)
            : [...prev.selectedFilters, filterType];

        // 필터가 없으면 전체로 설정
        if (newSelectedFilters.length === 0) {
          newSelectedFilters = ['all'];
        }
      }

      return {
        ...prev,
        selectedFilters: newSelectedFilters,
      };
    });
  }, []);

  // 필터 클리어
  const handleClearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedFilters: ['all'],
    }));
  }, []);

  // 검색 제안 로드
  const loadSuggestions = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setState(prev => ({ ...prev, suggestions: [] }));
        return;
      }

      try {
        const suggestions = await searchUseCase.getSuggestions(query);
        setState(prev => ({
          ...prev,
          suggestions: suggestions.map(s => s.text).slice(0, 5),
        }));
      } catch (error) {
        console.error('Failed to load suggestions:', error);
      }
    },
    [searchUseCase]
  );

  // 제안어 클릭
  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setState(prev => ({ ...prev, query: suggestion }));
      performSearch(suggestion, 1);
    },
    [performSearch]
  );

  // 최근 검색어 클릭
  const handleRecentSearchClick = useCallback(
    (search: string) => {
      setState(prev => ({ ...prev, query: search }));
      performSearch(search, 1);
    },
    [performSearch]
  );

  // 검색 히스토리 클리어
  const handleClearHistory = useCallback(async () => {
    try {
      await searchUseCase.clearSearchHistory();
      setState(prev => ({
        ...prev,
        searchHistory: [],
        recentSearches: [],
      }));
      toast.success('검색 기록이 삭제되었습니다.');
    } catch (error) {
      toast.error('검색 기록 삭제에 실패했습니다.');
    }
  }, [searchUseCase, toast]);

  // 더 많은 결과 로드
  const handleLoadMore = useCallback(() => {
    if (!state.hasMore || state.isSearching) return;
    performSearch(state.query, state.currentPage + 1);
  }, [
    state.hasMore,
    state.isSearching,
    state.query,
    state.currentPage,
    performSearch,
  ]);

  // 검색 결과 클릭
  const handleResultClick = useCallback(
    (result: SearchResult) => {
      // 검색어를 히스토리에 추가
      if (
        state.query.trim() &&
        !state.searchHistory.includes(state.query.trim())
      ) {
        const newHistory = [
          state.query.trim(),
          ...state.searchHistory.slice(0, 9),
        ];
        setState(prev => ({
          ...prev,
          searchHistory: newHistory,
          recentSearches: newHistory,
        }));
      }

      // 결과 페이지로 이동
      navigate(result.url);
    },
    [state.query, state.searchHistory, navigate]
  );

  // Enter 키로 검색
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  // 초기 데이터 로드
  const loadInitialData = useCallback(async () => {
    try {
      const [history, trending] = await Promise.all([
        searchUseCase.getSearchHistory(),
        searchUseCase.getTrendingSearches(),
      ]);

      setState(prev => ({
        ...prev,
        searchHistory: history.map(h => h.query),
        recentSearches: history.map(h => h.query),
      }));
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }, [searchUseCase]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  // 상태 초기화
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isSearching: false,
      error: null,
      query: '',
      results: [],
      filters: SEARCH_FILTERS,
      selectedFilters: ['all'],
      searchHistory: [],
      recentSearches: [],
      suggestions: [],
      totalResults: 0,
      currentPage: 1,
      hasMore: false,
    });
  }, []);

  // 검색어 변경 시 제안 로드
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (state.query.trim()) {
        loadSuggestions(state.query);
      } else {
        setState(prev => ({ ...prev, suggestions: [] }));
      }
    }, 300); // 디바운스

    return () => clearTimeout(timeoutId);
  }, [state.query, loadSuggestions]);

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    // State
    state,
    searchStats,
    filteredResults,

    // Actions
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
    reset,
    performSearch,
  };
};
