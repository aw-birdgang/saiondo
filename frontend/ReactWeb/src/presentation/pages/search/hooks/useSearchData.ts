import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  MOCK_SEARCH_RESULTS, 
  SEARCH_FILTERS, 
  TRENDING_SEARCHES, 
  SEARCH_SUGGESTIONS, 
  RECENT_SEARCHES,
  SEARCH_LOAD_TIME, 
  SUGGESTION_LOAD_TIME,
  sortSearchResults
} from '../constants/searchData';
import type { SearchResult, SearchState, SearchFilter, SearchStats } from '../types/searchTypes';

export const useSearchData = () => {
  const navigate = useNavigate();
  
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    isSearching: false,
    error: null,
    query: '',
    results: [],
    filters: SEARCH_FILTERS,
    selectedFilters: ['all'],
    searchHistory: RECENT_SEARCHES,
    recentSearches: RECENT_SEARCHES,
    suggestions: [],
    totalResults: 0,
    currentPage: 1,
    hasMore: false
  });

  // 검색 통계 계산
  const searchStats = useMemo((): SearchStats => {
    const stats: SearchStats = {
      totalResults: state.results.length,
      byType: {},
      searchTime: 0,
      query: state.query
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
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState(prev => ({
        ...prev,
        results: [],
        totalResults: 0,
        hasMore: false
      }));
      return;
    }

    setState(prev => ({ ...prev, isSearching: true, error: null }));
    
    try {
      // TODO: Implement actual API call
      // const response = await searchService.search(query, { filters: state.selectedFilters });
      // return response.data;

      // Mock 검색 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, SEARCH_LOAD_TIME));
      
      // 검색어가 포함된 결과 필터링
      const searchResults = MOCK_SEARCH_RESULTS.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.metadata.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      // 결과 정렬
      const sortedResults = sortSearchResults(searchResults, query);
      
      // 필터 업데이트
      const updatedFilters = SEARCH_FILTERS.map(filter => ({
        ...filter,
        count: filter.type === 'all' 
          ? sortedResults.length 
          : sortedResults.filter(result => result.type === filter.type).length
      }));

      setState(prev => ({
        ...prev,
        results: sortedResults,
        filters: updatedFilters,
        totalResults: sortedResults.length,
        hasMore: sortedResults.length > 8, // 페이지당 8개 결과
        currentPage: 1,
        isSearching: false
      }));

      // 검색어를 히스토리에 추가
      setState(prev => {
        if (query.trim() && !prev.searchHistory.includes(query.trim())) {
          const newHistory = [query.trim(), ...prev.searchHistory.slice(0, 9)]; // 최대 10개
          return {
            ...prev,
            searchHistory: newHistory,
            recentSearches: newHistory
          };
        }
        return prev;
      });

      toast.success(`${sortedResults.length}개의 검색 결과를 찾았습니다.`);
    } catch (error) {
      console.error('Search failed:', error);
      setState(prev => ({
        ...prev,
        error: '검색에 실패했습니다.',
        isSearching: false
      }));
      toast.error('검색에 실패했습니다.');
    }
  }, [state.selectedFilters]);

  // 검색어 변경
  const handleQueryChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
  }, []);

  // 검색 실행
  const handleSearch = useCallback(() => {
    if (!state.query.trim()) return;
    performSearch(state.query);
  }, [state.query, performSearch]);

  // 검색어 클리어
  const handleClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      query: '',
      results: [],
      totalResults: 0,
      hasMore: false,
      selectedFilters: ['all']
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
        selectedFilters: newSelectedFilters
      };
    });
  }, []);

  // 필터 클리어
  const handleClearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedFilters: ['all']
    }));
  }, []);

  // 검색 제안 로드
  const loadSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, suggestions: [] }));
      return;
    }

    try {
      // TODO: Implement actual API call
      // const response = await searchService.getSuggestions(query);
      // return response.data;

      // Mock 제안 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, SUGGESTION_LOAD_TIME));
      
      const filteredSuggestions = SEARCH_SUGGESTIONS.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );

      setState(prev => ({
        ...prev,
        suggestions: filteredSuggestions.slice(0, 5) // 최대 5개
      }));
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  }, []);

  // 제안어 클릭
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setState(prev => ({ ...prev, query: suggestion }));
    performSearch(suggestion);
  }, [performSearch]);

  // 최근 검색어 클릭
  const handleRecentSearchClick = useCallback((search: string) => {
    setState(prev => ({ ...prev, query: search }));
    performSearch(search);
  }, [performSearch]);

  // 검색 히스토리 클리어
  const handleClearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchHistory: [],
      recentSearches: []
    }));
    toast.success('검색 기록이 삭제되었습니다.');
  }, []);

  // 더 많은 결과 로드
  const handleLoadMore = useCallback(() => {
    if (!state.hasMore) return;
    
    setState(prev => ({
      ...prev,
      currentPage: prev.currentPage + 1,
      hasMore: prev.results.length > (prev.currentPage + 1) * 8
    }));
  }, [state.hasMore]);

  // 검색 결과 클릭
  const handleResultClick = useCallback((result: SearchResult) => {
    // 검색어를 히스토리에 추가
    if (state.query.trim() && !state.searchHistory.includes(state.query.trim())) {
      const newHistory = [state.query.trim(), ...state.searchHistory.slice(0, 9)];
      setState(prev => ({
        ...prev,
        searchHistory: newHistory,
        recentSearches: newHistory
      }));
    }

    // 결과 페이지로 이동
    navigate(result.url);
  }, [state.query, state.searchHistory, navigate]);

  // Enter 키로 검색
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

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

  return {
    // 상태
    query: state.query,
    results: state.results,
    filteredResults,
    isLoading: state.isLoading,
    isSearching: state.isSearching,
    error: state.error,
    filters: state.filters,
    selectedFilters: state.selectedFilters,
    searchHistory: state.searchHistory,
    recentSearches: state.recentSearches,
    suggestions: state.suggestions,
    totalResults: state.totalResults,
    hasMore: state.hasMore,
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
    handleKeyPress,
    performSearch
  };
}; 