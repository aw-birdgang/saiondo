import type { ISearchService } from './interfaces/ISearchService';
import type { ISearchUseCase } from './interfaces/ISearchUseCase';
import type { 
  SearchResult, 
  SearchRequest, 
  SearchResponse,
  SearchSuggestion,
  SearchHistoryItem,
  SearchTrendingItem
} from '../../domain/types/search';

// Search UseCase 구현체 - Service를 사용하여 애플리케이션 로직 조율
export class SearchUseCase implements ISearchUseCase {
  constructor(private searchService: ISearchService) {}

  async search(request: SearchRequest): Promise<SearchResponse> {
    return await this.searchService.search(request);
  }

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    return await this.searchService.getSuggestions(query);
  }

  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    return await this.searchService.getSearchHistory();
  }

  async getTrendingSearches(): Promise<SearchTrendingItem[]> {
    return await this.searchService.getTrendingSearches();
  }

  async saveSearchHistory(query: string, resultCount: number): Promise<void> {
    return await this.searchService.saveSearchHistory(query, resultCount);
  }

  async clearSearchHistory(): Promise<void> {
    return await this.searchService.clearSearchHistory();
  }

  validateSearchQuery(query: string): boolean {
    return this.searchService.validateSearchQuery(query);
  }

  sortSearchResults(results: SearchResult[], query: string): SearchResult[] {
    return this.searchService.sortSearchResults(results, query);
  }

  filterSearchResults(results: SearchResult[], filters: string[]): SearchResult[] {
    return this.searchService.filterSearchResults(results, filters);
  }

  calculateSearchStats(results: SearchResult[], query: string, searchTime: number): any {
    return this.searchService.calculateSearchStats(results, query, searchTime);
  }
} 