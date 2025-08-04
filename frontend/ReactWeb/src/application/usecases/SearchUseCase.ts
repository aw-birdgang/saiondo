import type { 
  SearchResult, 
  SearchFilter, 
  SearchRequest, 
  SearchResponse,
  SearchSuggestion,
  SearchHistoryItem,
  SearchTrendingItem
} from '../../domain/types/search';

export interface ISearchRepository {
  search(request: SearchRequest): Promise<SearchResponse>;
  getSuggestions(query: string): Promise<SearchSuggestion[]>;
  getSearchHistory(): Promise<SearchHistoryItem[]>;
  getTrendingSearches(): Promise<SearchTrendingItem[]>;
  saveSearchHistory(query: string, resultCount: number): Promise<void>;
  clearSearchHistory(): Promise<void>;
}

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

export class SearchUseCase implements ISearchUseCase {
  constructor(private searchRepository: ISearchRepository) {}

  async search(request: SearchRequest): Promise<SearchResponse> {
    // 검색어 유효성 검사
    if (!this.validateSearchQuery(request.query)) {
      throw new Error('유효하지 않은 검색어입니다.');
    }

    try {
      const response = await this.searchRepository.search(request);
      
      // 검색 결과 정렬
      const sortedResults = this.sortSearchResults(response.results, request.query);
      
      // 필터 적용
      const filteredResults = request.filters && request.filters.length > 0
        ? this.filterSearchResults(sortedResults, request.filters)
        : sortedResults;

      return {
        ...response,
        results: filteredResults,
        totalResults: filteredResults.length
      };
    } catch (error) {
      console.error('Search failed:', error);
      throw new Error('검색에 실패했습니다.');
    }
  }

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      return await this.searchRepository.getSuggestions(query);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }

  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    try {
      return await this.searchRepository.getSearchHistory();
    } catch (error) {
      console.error('Failed to get search history:', error);
      return [];
    }
  }

  async getTrendingSearches(): Promise<SearchTrendingItem[]> {
    try {
      return await this.searchRepository.getTrendingSearches();
    } catch (error) {
      console.error('Failed to get trending searches:', error);
      return [];
    }
  }

  async saveSearchHistory(query: string, resultCount: number): Promise<void> {
    if (!query.trim()) return;

    try {
      await this.searchRepository.saveSearchHistory(query, resultCount);
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }

  async clearSearchHistory(): Promise<void> {
    try {
      await this.searchRepository.clearSearchHistory();
    } catch (error) {
      console.error('Failed to clear search history:', error);
      throw new Error('검색 기록 삭제에 실패했습니다.');
    }
  }

  validateSearchQuery(query: string): boolean {
    if (!query || !query.trim()) {
      return false;
    }

    // 최소 길이 검사
    if (query.trim().length < 1) {
      return false;
    }

    // 최대 길이 검사
    if (query.length > 100) {
      return false;
    }

    // 특수 문자 필터링 (필요에 따라 조정)
    const invalidChars = /[<>{}]/;
    if (invalidChars.test(query)) {
      return false;
    }

    return true;
  }

  sortSearchResults(results: SearchResult[], query: string): SearchResult[] {
    return results.sort((a, b) => {
      // 관련도 점수로 정렬
      const relevanceA = a.metadata.relevance || 0;
      const relevanceB = b.metadata.relevance || 0;

      // 제목에 검색어가 포함된 경우 우선순위 높임
      const titleMatchA = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
      const titleMatchB = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;

      // 설명에 검색어가 포함된 경우 우선순위 높임
      const descMatchA = a.description.toLowerCase().includes(query.toLowerCase()) ? 0.5 : 0;
      const descMatchB = b.description.toLowerCase().includes(query.toLowerCase()) ? 0.5 : 0;

      const scoreA = relevanceA + titleMatchA + descMatchA;
      const scoreB = relevanceB + titleMatchB + descMatchB;

      return scoreB - scoreA;
    });
  }

  filterSearchResults(results: SearchResult[], filters: string[]): SearchResult[] {
    if (!filters || filters.length === 0 || filters.includes('all')) {
      return results;
    }

    return results.filter(result => filters.includes(result.type));
  }

  calculateSearchStats(results: SearchResult[], query: string, searchTime: number): any {
    const stats = {
      totalResults: results.length,
      byType: {} as Record<string, number>,
      searchTime,
      query
    };

    // 타입별 통계 계산
    results.forEach(result => {
      stats.byType[result.type] = (stats.byType[result.type] || 0) + 1;
    });

    return stats;
  }
} 