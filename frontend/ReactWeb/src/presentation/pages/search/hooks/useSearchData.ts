import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { searchService } from '../../../../infrastructure/api/services';
import type { SearchResult } from '../../../../infrastructure/api/services/searchService';

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  hasMore: boolean;
  selectedFilters: Record<string, any>;
}

export const useSearchData = () => {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    isLoading: false,
    error: null,
    total: 0,
    page: 1,
    hasMore: true,
    selectedFilters: {}
  });

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 검색 실행
  const performSearch = useCallback(async (query: string, page = 1, filters = {}) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, results: [], total: 0, page: 1, hasMore: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await searchService.search({
        query,
        page,
        limit: 20,
        filters
      });

      setState(prev => ({
        ...prev,
        results: page === 1 ? response.results : [...prev.results, ...response.results],
        total: response.total,
        page: response.page,
        hasMore: response.page < response.limit,
        isLoading: false
      }));
    } catch (error) {
      console.error('Search failed:', error);
      setState(prev => ({
        ...prev,
        error: '검색에 실패했습니다.',
        isLoading: false
      }));
      toast.error('검색에 실패했습니다.');
    }
  }, []);

  // 검색어 변경 처리 (디바운스)
  const handleQueryChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));

    // 이전 타이머 클리어
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 새로운 검색 타이머 설정
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query, 1, state.selectedFilters);
    }, 300);
  }, [performSearch, state.selectedFilters]);

  // 필터 변경
  const handleFilterChange = useCallback((filters: Record<string, any>) => {
    setState(prev => ({ ...prev, selectedFilters: filters }));
    performSearch(state.query, 1, filters);
  }, [state.query, performSearch]);

  // 더 많은 결과 로드
  const loadMore = useCallback(() => {
    if (!state.hasMore || state.isLoading) return;
    
    const nextPage = state.page + 1;
    performSearch(state.query, nextPage, state.selectedFilters);
  }, [state.hasMore, state.isLoading, state.page, state.query, state.selectedFilters, performSearch]);

  // 검색 제안 가져오기
  const getSuggestions = useCallback(async (query: string): Promise<string[]> => {
    if (!query.trim()) return [];

    try {
      return await searchService.getSuggestions(query);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }, []);

  // 인기 검색어 가져오기
  const getTrendingSearches = useCallback(async (): Promise<string[]> => {
    try {
      return await searchService.getTrendingSearches();
    } catch (error) {
      console.error('Failed to get trending searches:', error);
      return [];
    }
  }, []);

  // 검색 기록 가져오기
  const getSearchHistory = useCallback(async (): Promise<string[]> => {
    try {
      return await searchService.getSearchHistory();
    } catch (error) {
      console.error('Failed to get search history:', error);
      return [];
    }
  }, []);

  // 검색 기록 삭제
  const clearSearchHistory = useCallback(async () => {
    try {
      await searchService.clearSearchHistory();
      toast.success('검색 기록이 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to clear search history:', error);
      toast.error('검색 기록 삭제에 실패했습니다.');
    }
  }, []);

  // 검색 초기화
  const resetSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      query: '',
      results: [],
      total: 0,
      page: 1,
      hasMore: true,
      selectedFilters: {}
    }));
  }, []);

  return {
    // 상태
    ...state,

    // 액션
    handleQueryChange,
    handleFilterChange,
    loadMore,
    getSuggestions,
    getTrendingSearches,
    getSearchHistory,
    clearSearchHistory,
    resetSearch
  };
}; 