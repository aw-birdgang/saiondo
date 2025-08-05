import type { 
  SearchResult, 
  SearchRequest, 
  SearchResponse,
  SearchSuggestion,
  SearchHistoryItem,
  SearchTrendingItem
} from '../../../domain/types/search';

// Search UseCase 인터페이스 - 애플리케이션 로직 조율
export interface ISearchUseCase {
  search(request: SearchRequest): Promise<SearchResponse>;
  getSuggestions(query: string): Promise<SearchSuggestion[]>;
  getSearchHistory(): Promise<SearchHistoryItem[]>;
  getTrendingSearches(): Promise<SearchTrendingItem[]>;
  saveSearchHistory(query: string, resultCount: number): Promise<void>;
  clearSearchHistory(): Promise<void>;
  validateSearchQuery(query: string): boolean;
  sortSearchResults(results: SearchResult[], query: string): SearchResult[];
  filterSearchResults(results: SearchResult[], filters: string[]): SearchResult[];
  calculateSearchStats(results: SearchResult[], query: string, searchTime: number): any;
} 