import type {
  SearchRequest,
  SearchResponse,
  SearchSuggestion,
  SearchHistoryItem,
  SearchTrendingItem,
} from '@/domain/types/search';

// Search Repository 인터페이스 - 데이터 접근만 담당
export interface ISearchRepository {
  search(request: SearchRequest): Promise<SearchResponse>;
  getSuggestions(query: string): Promise<SearchSuggestion[]>;
  getSearchHistory(): Promise<SearchHistoryItem[]>;
  getTrendingSearches(): Promise<SearchTrendingItem[]>;
  saveSearchHistory(query: string, resultCount: number): Promise<void>;
  clearSearchHistory(): Promise<void>;
  getSearchStats(query: string): Promise<any>;
  updateSearchIndex(): Promise<void>;
}
