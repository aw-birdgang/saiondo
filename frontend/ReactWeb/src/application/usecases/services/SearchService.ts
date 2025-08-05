import type { 
  SearchResult, 
  SearchRequest, 
  SearchResponse,
  SearchSuggestion,
  SearchHistoryItem,
  SearchTrendingItem
} from '../../../domain/types/search';
import type { ISearchRepository } from '../interfaces/ISearchRepository';
import type { ISearchService } from '../interfaces/ISearchService';
import type { ICache } from '../interfaces/ICache';
import { SEARCH_LIMITS, SEARCH_ERROR_MESSAGES, SEARCH_CACHE_TTL, SEARCH_WEIGHTS } from '../constants/SearchConstants';
import { MemoryCache } from '../cache/MemoryCache';

// Search Service 구현체
export class SearchService implements ISearchService {
  private cache: ICache;

  constructor(
    private searchRepository: ISearchRepository,
    cache?: ICache
  ) {
    this.cache = cache || new MemoryCache();
  }

  async search(request: SearchRequest): Promise<SearchResponse> {
    try {
      // 검색어 유효성 검사
      if (!this.validateSearchQuery(request.query)) {
        throw new Error(SEARCH_ERROR_MESSAGES.VALIDATION.QUERY_REQUIRED);
      }

      // 검색어 전처리
      const processedQuery = this.processSearchQuery(request.query);

      // 캐시 확인
      const cacheKey = `search:${processedQuery}:${request.filters?.join(',') || 'all'}`;
      const cached = this.cache.get<SearchResponse>(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await this.searchRepository.search({
        ...request,
        query: processedQuery
      });
      
      // 검색 결과 정렬
      const sortedResults = this.sortSearchResults(response.results, processedQuery);
      
      // 필터 적용
      const filteredResults = request.filters && request.filters.length > 0
        ? this.filterSearchResults(sortedResults, request.filters)
        : sortedResults;

      const finalResponse = {
        ...response,
        results: filteredResults,
        totalResults: filteredResults.length
      };

      // 캐시 저장
      this.cache.set(cacheKey, finalResponse, SEARCH_CACHE_TTL.SEARCH_RESULTS);

      return finalResponse;
    } catch (error) {
      console.error('Search failed:', error);
      throw new Error(SEARCH_ERROR_MESSAGES.OPERATION.SEARCH_FAILED);
    }
  }

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      // 캐시 확인
      const cacheKey = `suggestions:${query}`;
      const cached = this.cache.get<SearchSuggestion[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const suggestions = await this.searchRepository.getSuggestions(query);
      
      // 캐시 저장
      this.cache.set(cacheKey, suggestions, SEARCH_CACHE_TTL.SUGGESTIONS);
      
      return suggestions;
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }

  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    try {
      // 캐시 확인
      const cacheKey = 'search_history';
      const cached = this.cache.get<SearchHistoryItem[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const history = await this.searchRepository.getSearchHistory();
      
      // 캐시 저장
      this.cache.set(cacheKey, history, SEARCH_CACHE_TTL.SEARCH_HISTORY);
      
      return history;
    } catch (error) {
      console.error('Failed to get search history:', error);
      return [];
    }
  }

  async getTrendingSearches(): Promise<SearchTrendingItem[]> {
    try {
      // 캐시 확인
      const cacheKey = 'trending_searches';
      const cached = this.cache.get<SearchTrendingItem[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const trending = await this.searchRepository.getTrendingSearches();
      
      // 캐시 저장
      this.cache.set(cacheKey, trending, SEARCH_CACHE_TTL.TRENDING_SEARCHES);
      
      return trending;
    } catch (error) {
      console.error('Failed to get trending searches:', error);
      return [];
    }
  }

  async saveSearchHistory(query: string, resultCount: number): Promise<void> {
    if (!query.trim()) return;

    try {
      await this.searchRepository.saveSearchHistory(query, resultCount);
      
      // 검색 기록 캐시 무효화
      this.cache.delete('search_history');
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }

  async clearSearchHistory(): Promise<void> {
    try {
      await this.searchRepository.clearSearchHistory();
      
      // 검색 기록 캐시 무효화
      this.cache.delete('search_history');
    } catch (error) {
      console.error('Failed to clear search history:', error);
      throw new Error(SEARCH_ERROR_MESSAGES.OPERATION.CLEAR_HISTORY_FAILED);
    }
  }

  async getSearchStats(query: string): Promise<any> {
    try {
      return await this.searchRepository.getSearchStats(query);
    } catch (error) {
      console.error('Failed to get search stats:', error);
      return {};
    }
  }

  async updateSearchIndex(): Promise<void> {
    try {
      await this.searchRepository.updateSearchIndex();
      
      // 검색 관련 캐시 모두 무효화
      this.invalidateSearchCache();
    } catch (error) {
      console.error('Failed to update search index:', error);
      throw new Error('검색 인덱스 업데이트에 실패했습니다.');
    }
  }

  validateSearchQuery(query: string): boolean {
    if (!query || !query.trim()) {
      return false;
    }

    // 최소 길이 검사
    if (query.trim().length < SEARCH_LIMITS.MIN_QUERY_LENGTH) {
      return false;
    }

    // 최대 길이 검사
    if (query.length > SEARCH_LIMITS.MAX_QUERY_LENGTH) {
      return false;
    }

    // 특수 문자 필터링
    const invalidChars = /[<>{}]/;
    if (invalidChars.test(query)) {
      return false;
    }

    return true;
  }

  sortSearchResults(results: SearchResult[], query: string): SearchResult[] {
    return results.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, query);
      const scoreB = this.calculateRelevanceScore(b, query);
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
      query,
      averageRelevance: 0
    };

    // 타입별 통계 계산
    results.forEach(result => {
      stats.byType[result.type] = (stats.byType[result.type] || 0) + 1;
    });

    // 평균 관련도 계산
    if (results.length > 0) {
      const totalRelevance = results.reduce((sum, result) => {
        return sum + (result.metadata.relevance || 0);
      }, 0);
      stats.averageRelevance = totalRelevance / results.length;
    }

    return stats;
  }

  processSearchQuery(query: string): string {
    // 검색어 전처리: 공백 정리, 소문자 변환
    return query.trim().toLowerCase();
  }

  calculateRelevanceScore(result: SearchResult, query: string): number {
    let score = result.metadata.relevance || 0;
    const queryLower = query.toLowerCase();

    // 제목에 검색어가 포함된 경우 우선순위 높임
    if (result.title.toLowerCase().includes(queryLower)) {
      score += SEARCH_WEIGHTS.TITLE_MATCH;
    }

    // 설명에 검색어가 포함된 경우 우선순위 높임
    if (result.description.toLowerCase().includes(queryLower)) {
      score += SEARCH_WEIGHTS.DESCRIPTION_MATCH;
    }

    // 정확한 일치인 경우 최고 우선순위
    if (result.title.toLowerCase() === queryLower) {
      score += SEARCH_WEIGHTS.EXACT_MATCH;
    }

    // 최신성 보너스
    if (result.metadata.timestamp) {
      const daysSinceCreation = (Date.now() - new Date(result.metadata.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreation < 7) {
        score += SEARCH_WEIGHTS.RECENCY_BONUS;
      }
    }

    return score;
  }

  // Private helper methods
  private invalidateSearchCache(): void {
    this.cache.delete('search_history');
    this.cache.delete('trending_searches');
    // 검색 결과 캐시는 패턴으로 삭제
    this.cache.delete('search:*');
    this.cache.delete('suggestions:*');
  }
} 