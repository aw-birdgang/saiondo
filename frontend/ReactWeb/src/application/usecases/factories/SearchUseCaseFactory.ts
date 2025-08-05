import type { ISearchRepository } from '../interfaces/ISearchRepository';
import type { ISearchUseCase } from '../interfaces/ISearchUseCase';
import type { ICache } from '../interfaces/ICache';
import { SearchService } from '../services/SearchService';
import { SearchUseCase } from '../SearchUseCase';

// 의존성 주입을 위한 팩토리 함수
export const createSearchUseCase = (
  repository: ISearchRepository, 
  cache?: ICache
): ISearchUseCase => {
  const service = new SearchService(repository, cache);
  return new SearchUseCase(service);
};

// 테스트를 위한 Mock 팩토리
export const createMockSearchUseCase = (): ISearchUseCase => {
  const mockRepository: ISearchRepository = {
    search: async () => ({ 
      results: [], 
      totalResults: 0,
      query: '',
      filters: [],
      currentPage: 1,
      totalPages: 1,
      hasMore: false,
      searchTime: 0,
      suggestions: []
    }),
    getSuggestions: async () => [],
    getSearchHistory: async () => [],
    getTrendingSearches: async () => [],
    saveSearchHistory: async () => {},
    clearSearchHistory: async () => {},
    getSearchStats: async () => ({}),
    updateSearchIndex: async () => {},
  };
  
  return createSearchUseCase(mockRepository);
}; 