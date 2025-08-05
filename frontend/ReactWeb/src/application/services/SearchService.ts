import type { ISearchService } from '../usecases/interfaces/ISearchService';
import type {
  SearchResult,
  SearchRequest,
  SearchResponse,
  SearchSuggestion,
  SearchHistoryItem,
  SearchTrendingItem,
} from '../../domain/types/search';
import { SearchRepository } from '../../infrastructure/repositories/SearchRepository';

export class SearchService implements ISearchService {
  constructor(private readonly searchRepository: SearchRepository) {}

  async search(request: SearchRequest): Promise<SearchResponse> {
    return await this.searchRepository.search(request);
  }

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    return await this.searchRepository.getSuggestions(query);
  }

  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    return await this.searchRepository.getSearchHistory();
  }

  async getTrendingSearches(): Promise<SearchTrendingItem[]> {
    return await this.searchRepository.getTrendingSearches();
  }

  async saveSearchHistory(query: string, resultCount: number): Promise<void> {
    return await this.searchRepository.saveSearchHistory(query, resultCount);
  }

  async clearSearchHistory(): Promise<void> {
    return await this.searchRepository.clearSearchHistory();
  }

  async getSearchStats(query: string): Promise<any> {
    // 실제 구현에서는 검색 통계를 반환
    return {
      query,
      totalResults: 0,
      searchTime: 0,
      timestamp: new Date().toISOString()
    };
  }

  async updateSearchIndex(): Promise<void> {
    // 실제 구현에서는 검색 인덱스를 업데이트
    console.log('Search index updated');
  }

  validateSearchQuery(query: string): boolean {
    return Boolean(query && query.trim().length >= 2);
  }

  sortSearchResults(results: SearchResult[], query: string): SearchResult[] {
    // 간단한 정렬 로직
    return results.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, query);
      const bScore = this.calculateRelevanceScore(b, query);
      return bScore - aScore;
    });
  }

  filterSearchResults(results: SearchResult[], filters: string[]): SearchResult[] {
    if (!filters || filters.length === 0) return results;
    
    return results.filter(result => {
      return filters.some(filter => 
        result.title.toLowerCase().includes(filter.toLowerCase()) ||
        result.description.toLowerCase().includes(filter.toLowerCase())
      );
    });
  }

  calculateSearchStats(results: SearchResult[], query: string, searchTime: number): any {
    return {
      query,
      resultCount: results.length,
      searchTime,
      timestamp: new Date().toISOString()
    };
  }

  processSearchQuery(query: string): string {
    return query.trim().toLowerCase();
  }

  calculateRelevanceScore(result: SearchResult, query: string): number {
    const processedQuery = this.processSearchQuery(query);
    let score = 0;
    
    if (result.title.toLowerCase().includes(processedQuery)) score += 10;
    if (result.description.toLowerCase().includes(processedQuery)) score += 5;
    
    return score;
  }
} 