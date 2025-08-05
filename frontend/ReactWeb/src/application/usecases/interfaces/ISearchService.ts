import type { 
  SearchResult, 
  SearchFilter, 
  SearchRequest, 
  SearchResponse,
  SearchSuggestion,
  SearchHistoryItem,
  SearchTrendingItem
} from '../../../domain/types/search';

// Search Service 인터페이스 - 비즈니스 로직 담당
export interface ISearchService {
  search(request: SearchRequest): Promise<SearchResponse>;
  getSuggestions(query: string): Promise<SearchSuggestion[]>;
  getSearchHistory(): Promise<SearchHistoryItem[]>;
  getTrendingSearches(): Promise<SearchTrendingItem[]>;
  saveSearchHistory(query: string, resultCount: number): Promise<void>;
  clearSearchHistory(): Promise<void>;
  getSearchStats(query: string): Promise<any>;
  updateSearchIndex(): Promise<void>;
  validateSearchQuery(query: string): boolean;
  sortSearchResults(results: SearchResult[], query: string): SearchResult[];
  filterSearchResults(results: SearchResult[], filters: string[]): SearchResult[];
  calculateSearchStats(results: SearchResult[], query: string, searchTime: number): any;
  processSearchQuery(query: string): string;
  calculateRelevanceScore(result: SearchResult, query: string): number;
} 