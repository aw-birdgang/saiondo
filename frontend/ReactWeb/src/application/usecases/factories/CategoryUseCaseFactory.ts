import type { ICategoryRepository } from '../interfaces/ICategoryRepository';
import type { ICategoryUseCase } from '../interfaces/ICategoryUseCase';
import type { ICache } from '../interfaces/ICache';
import { CategoryService } from '../services/CategoryService';
import { CategoryUseCase } from '../CategoryUseCase';

// 의존성 주입을 위한 팩토리 함수
export const createCategoryUseCase = (
  repository: ICategoryRepository,
  cache?: ICache
): ICategoryUseCase => {
  const service = new CategoryService(repository, cache);
  return new CategoryUseCase(service);
};

// 테스트를 위한 Mock 팩토리
export const createMockCategoryUseCase = (): ICategoryUseCase => {
  const mockRepository: ICategoryRepository = {
    getCategories: async () => [],
    getCategoryCodes: async () => [],
    getCategoryById: async () => null,
    getCategoryCodeById: async () => null,
    searchCategories: async () => [],
    searchCategoryCodes: async () => [],
    getCategoryStats: async () => ({
      totalCategories: 0,
      totalCodes: 0,
      byCategory: {},
      popularCategories: [],
    }),
    createCategory: async () => ({
      id: 'mock-id',
      name: 'Mock Category',
      description: '',
      icon: '📋',
      color: '#000000',
      examples: [],
      tips: [],
    }),
    updateCategory: async () => ({
      id: 'mock-id',
      name: 'Updated Mock Category',
      description: '',
      icon: '📋',
      color: '#000000',
      examples: [],
      tips: [],
    }),
    deleteCategory: async () => true,
  };

  return createCategoryUseCase(mockRepository);
};
