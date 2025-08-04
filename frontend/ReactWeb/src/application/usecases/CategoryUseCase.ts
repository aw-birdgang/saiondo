import type { 
  Category, 
  CategoryCode, 
  CategoryRequest, 
  CategoryResponse,
  CategoryStats,
  CategoryUsageGuide,
  CategoryFilter
} from '../../domain/types/category';

export interface ICategoryRepository {
  getCategories(): Promise<Category[]>;
  getCategoryCodes(): Promise<CategoryCode[]>;
  getCategoryById(id: string): Promise<Category | null>;
  getCategoryCodeById(id: string): Promise<CategoryCode | null>;
  searchCategories(searchTerm: string): Promise<Category[]>;
  searchCategoryCodes(searchTerm: string): Promise<CategoryCode[]>;
  getCategoryStats(): Promise<CategoryStats>;
}

export interface ICategoryUseCase {
  getCategories(): Promise<Category[]>;
  getCategoryCodes(): Promise<CategoryCode[]>;
  getCategoryById(id: string): Promise<Category | null>;
  getCategoryCodeById(id: string): Promise<CategoryCode | null>;
  searchCategories(searchTerm: string): Promise<Category[]>;
  searchCategoryCodes(searchTerm: string): Promise<CategoryCode[]>;
  getCategoryStats(): Promise<CategoryStats>;
  validateCategoryId(id: string): boolean;
  validateSearchTerm(searchTerm: string): boolean;
  filterCategoriesByType(categories: Category[], type: string): Category[];
  getUsageGuide(): CategoryUsageGuide;
  getCategoryFilters(): CategoryFilter[];
}

export class CategoryUseCase implements ICategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async getCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.getCategories();
    } catch (error) {
      console.error('Failed to get categories:', error);
      throw new Error('카테고리를 불러오는데 실패했습니다.');
    }
  }

  async getCategoryCodes(): Promise<CategoryCode[]> {
    try {
      return await this.categoryRepository.getCategoryCodes();
    } catch (error) {
      console.error('Failed to get category codes:', error);
      throw new Error('카테고리 코드를 불러오는데 실패했습니다.');
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    if (!this.validateCategoryId(id)) {
      throw new Error('유효하지 않은 카테고리 ID입니다.');
    }

    try {
      return await this.categoryRepository.getCategoryById(id);
    } catch (error) {
      console.error('Failed to get category by id:', error);
      throw new Error('카테고리를 찾을 수 없습니다.');
    }
  }

  async getCategoryCodeById(id: string): Promise<CategoryCode | null> {
    if (!this.validateCategoryId(id)) {
      throw new Error('유효하지 않은 카테고리 코드 ID입니다.');
    }

    try {
      return await this.categoryRepository.getCategoryCodeById(id);
    } catch (error) {
      console.error('Failed to get category code by id:', error);
      throw new Error('카테고리 코드를 찾을 수 없습니다.');
    }
  }

  async searchCategories(searchTerm: string): Promise<Category[]> {
    if (!this.validateSearchTerm(searchTerm)) {
      return [];
    }

    try {
      return await this.categoryRepository.searchCategories(searchTerm);
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
      return await this.categoryRepository.getCategoryStats();
    } catch (error) {
      console.error('Failed to get category stats:', error);
      throw new Error('카테고리 통계를 불러오는데 실패했습니다.');
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
    if (searchTerm.trim().length < 1) {
      return false;
    }

    // 최대 길이 검사
    if (searchTerm.length > 100) {
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
    return [
      { id: 'all', name: '전체', isActive: true, count: 0 },
      { id: 'relationship', name: '관계', isActive: false, count: 0 },
      { id: 'communication', name: '소통', isActive: false, count: 0 },
      { id: 'conflict', name: '갈등', isActive: false, count: 0 },
      { id: 'intimacy', name: '친밀감', isActive: false, count: 0 },
      { id: 'future', name: '미래', isActive: false, count: 0 },
      { id: 'daily', name: '일상', isActive: false, count: 0 }
    ];
  }
} 