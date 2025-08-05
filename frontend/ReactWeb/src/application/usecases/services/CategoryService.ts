import type { 
  Category, 
  CategoryCode, 
  CategoryRequest, 
  CategoryResponse,
  CategoryStats,
  CategoryUsageGuide,
  CategoryFilter
} from '../../../domain/types/category';
import type { ICategoryRepository } from '../interfaces/ICategoryRepository';
import type { ICategoryService } from '../interfaces/ICategoryService';
import type { ICache } from '../interfaces/ICache';
import { CATEGORY_LIMITS, CATEGORY_ERROR_MESSAGES, CATEGORY_CACHE_TTL, CATEGORY_FILTERS } from '../constants/CategoryConstants';
import { MemoryCache } from '../cache/MemoryCache';

// Category Service 구현체
export class CategoryService implements ICategoryService {
  private cache: ICache;

  constructor(
    private categoryRepository: ICategoryRepository,
    cache?: ICache
  ) {
    this.cache = cache || new MemoryCache();
  }

  async getCategories(): Promise<Category[]> {
    try {
      // 캐시 확인
      const cacheKey = 'categories';
      const cached = this.cache.get<Category[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const categories = await this.categoryRepository.getCategories();
      
      // 캐시 저장
      this.cache.set(cacheKey, categories, CATEGORY_CACHE_TTL.CATEGORIES);
      
      return categories;
    } catch (error) {
      console.error('Failed to get categories:', error);
      throw new Error(CATEGORY_ERROR_MESSAGES.OPERATION.GET_CATEGORIES_FAILED);
    }
  }

  async getCategoryCodes(): Promise<CategoryCode[]> {
    try {
      // 캐시 확인
      const cacheKey = 'category_codes';
      const cached = this.cache.get<CategoryCode[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const codes = await this.categoryRepository.getCategoryCodes();
      
      // 캐시 저장
      this.cache.set(cacheKey, codes, CATEGORY_CACHE_TTL.CATEGORY_CODES);
      
      return codes;
    } catch (error) {
      console.error('Failed to get category codes:', error);
      throw new Error(CATEGORY_ERROR_MESSAGES.OPERATION.GET_CODES_FAILED);
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    if (!this.validateCategoryId(id)) {
      throw new Error(CATEGORY_ERROR_MESSAGES.VALIDATION.ID_INVALID);
    }

    try {
      // 캐시 확인
      const cacheKey = `category:${id}`;
      const cached = this.cache.get<Category>(cacheKey);
      if (cached) {
        return cached;
      }

      const category = await this.categoryRepository.getCategoryById(id);
      
      if (category) {
        // 캐시 저장
        this.cache.set(cacheKey, category, CATEGORY_CACHE_TTL.CATEGORIES);
      }
      
      return category;
    } catch (error) {
      console.error('Failed to get category by id:', error);
      throw new Error(CATEGORY_ERROR_MESSAGES.OPERATION.GET_BY_ID_FAILED);
    }
  }

  async getCategoryCodeById(id: string): Promise<CategoryCode | null> {
    if (!this.validateCategoryId(id)) {
      throw new Error(CATEGORY_ERROR_MESSAGES.VALIDATION.ID_INVALID);
    }

    try {
      // 캐시 확인
      const cacheKey = `category_code:${id}`;
      const cached = this.cache.get<CategoryCode>(cacheKey);
      if (cached) {
        return cached;
      }

      const code = await this.categoryRepository.getCategoryCodeById(id);
      
      if (code) {
        // 캐시 저장
        this.cache.set(cacheKey, code, CATEGORY_CACHE_TTL.CATEGORY_CODES);
      }
      
      return code;
    } catch (error) {
      console.error('Failed to get category code by id:', error);
      throw new Error(CATEGORY_ERROR_MESSAGES.OPERATION.GET_BY_ID_FAILED);
    }
  }

  async searchCategories(searchTerm: string): Promise<Category[]> {
    if (!this.validateSearchTerm(searchTerm)) {
      return [];
    }

    try {
      const categories = await this.categoryRepository.searchCategories(searchTerm);
      return categories.map(category => this.processCategoryData(category));
    } catch (error) {
      console.error('Failed to search categories:', error);
      return [];
    }
  }

  async searchCategoryCodes(searchTerm: string): Promise<CategoryCode[]> {
    if (!this.validateSearchTerm(searchTerm)) {
      return [];
    }

    try {
      return await this.categoryRepository.searchCategoryCodes(searchTerm);
    } catch (error) {
      console.error('Failed to search category codes:', error);
      return [];
    }
  }

  async getCategoryStats(): Promise<CategoryStats> {
    try {
      // 캐시 확인
      const cacheKey = 'category_stats';
      const cached = this.cache.get<CategoryStats>(cacheKey);
      if (cached) {
        return cached;
      }

      const stats = await this.categoryRepository.getCategoryStats();
      
      // 캐시 저장
      this.cache.set(cacheKey, stats, CATEGORY_CACHE_TTL.CATEGORY_STATS);
      
      return stats;
    } catch (error) {
      console.error('Failed to get category stats:', error);
      throw new Error(CATEGORY_ERROR_MESSAGES.OPERATION.GET_STATS_FAILED);
    }
  }

  async createCategory(category: Category): Promise<Category> {
    try {
      const newCategory = await this.categoryRepository.createCategory(category);
      
      // 캐시 무효화
      this.invalidateCategoryCache();
      
      return this.processCategoryData(newCategory);
    } catch (error) {
      console.error('Failed to create category:', error);
      throw new Error('카테고리 생성에 실패했습니다.');
    }
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    try {
      const updatedCategory = await this.categoryRepository.updateCategory(id, category);
      
      // 캐시 무효화
      this.invalidateCategoryCache();
      
      return this.processCategoryData(updatedCategory);
    } catch (error) {
      console.error('Failed to update category:', error);
      throw new Error('카테고리 수정에 실패했습니다.');
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const result = await this.categoryRepository.deleteCategory(id);
      
      if (result) {
        // 캐시 무효화
        this.invalidateCategoryCache();
      }
      
      return result;
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw new Error('카테고리 삭제에 실패했습니다.');
    }
  }

  validateCategoryId(id: string): boolean {
    return Boolean(id && id.trim().length > 0);
  }

  validateSearchTerm(searchTerm: string): boolean {
    if (!searchTerm || !searchTerm.trim()) {
      return false;
    }

    // 최소 길이 검사
    if (searchTerm.trim().length < CATEGORY_LIMITS.MIN_SEARCH_LENGTH) {
      return false;
    }

    // 최대 길이 검사
    if (searchTerm.length > CATEGORY_LIMITS.MAX_SEARCH_LENGTH) {
      return false;
    }

    // 특수 문자 필터링
    const invalidChars = /[<>{}]/;
    if (invalidChars.test(searchTerm)) {
      return false;
    }

    return true;
  }

  filterCategoriesByType(categories: Category[], type: string): Category[] {
    if (!type || type === 'all') {
      return categories;
    }

    return categories.filter(category => 
      category.id.toLowerCase().includes(type.toLowerCase()) ||
      category.name.toLowerCase().includes(type.toLowerCase())
    );
  }

  getUsageGuide(): CategoryUsageGuide {
    return {
      title: "카테고리 활용 방법",
      steps: [
        {
          number: 1,
          title: "카테고리 선택",
          description: "관심 있는 주제나 현재 필요한 대화 카테고리를 선택하세요.",
          icon: "📋"
        },
        {
          number: 2,
          title: "AI와 대화",
          description: "선택한 카테고리에 맞는 전문적인 조언과 대화를 나누세요.",
          icon: "🤖"
        },
        {
          number: 3,
          title: "관계 개선",
          description: "AI의 조언을 바탕으로 파트너와 더 나은 관계를 만들어가세요.",
          icon: "💕"
        }
      ]
    };
  }

  getCategoryFilters(): CategoryFilter[] {
    return [...CATEGORY_FILTERS] as CategoryFilter[];
  }

  processCategoryData(category: Category): Category {
    // 카테고리 데이터 가공
    return {
      ...category,
      name: category.name.trim(),
      description: category.description?.trim() || '',
    };
  }

  // Private helper methods
  private invalidateCategoryCache(): void {
    this.cache.delete('categories');
    this.cache.delete('category_codes');
    this.cache.delete('category_stats');
    this.cache.delete('category:*');
    this.cache.delete('category_code:*');
  }
} 