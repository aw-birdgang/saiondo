import type { ICategoryService } from '../usecases/interfaces/ICategoryService';
import type { 
  Category, 
  CategoryCode, 
  CategoryStats, 
  CategoryUsageGuide, 
  CategoryFilter 
} from '../../domain/types/category';
import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository';

export class CategoryService implements ICategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategories(): Promise<Category[]> {
    return await this.categoryRepository.getCategories();
  }

  async getCategoryCodes(): Promise<CategoryCode[]> {
    return await this.categoryRepository.getCategoryCodes();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return await this.categoryRepository.getCategoryById(id);
  }

  async getCategoryCodeById(id: string): Promise<CategoryCode | null> {
    return await this.categoryRepository.getCategoryCodeById(id);
  }

  async searchCategories(searchTerm: string): Promise<Category[]> {
    return await this.categoryRepository.searchCategories(searchTerm);
  }

  async searchCategoryCodes(searchTerm: string): Promise<CategoryCode[]> {
    return await this.categoryRepository.searchCategoryCodes(searchTerm);
  }

  async getCategoryStats(): Promise<CategoryStats> {
    return await this.categoryRepository.getCategoryStats();
  }

  async createCategory(category: Category): Promise<Category> {
    // 실제 구현에서는 데이터베이스에 저장하는 로직이 필요
    throw new Error('createCategory not implemented');
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    // 실제 구현에서는 데이터베이스 업데이트 로직이 필요
    throw new Error('updateCategory not implemented');
  }

  async deleteCategory(id: string): Promise<boolean> {
    // 실제 구현에서는 데이터베이스 삭제 로직이 필요
    throw new Error('deleteCategory not implemented');
  }

  validateCategoryId(id: string): boolean {
    // 간단한 유효성 검사
    return Boolean(id && id.length > 0);
  }

  validateSearchTerm(searchTerm: string): boolean {
    return Boolean(searchTerm && searchTerm.length >= 2);
  }

  filterCategoriesByType(categories: Category[], type: string): Category[] {
    return categories.filter(category => category.id === type);
  }

  getUsageGuide(): CategoryUsageGuide {
    // 실제 구현에서는 사용 가이드를 반환
    return {
      title: '카테고리 사용 가이드',
      steps: [
        {
          number: 1,
          title: '카테고리 선택',
          description: '원하는 대화 주제의 카테고리를 선택하세요',
          icon: '📂'
        },
        {
          number: 2,
          title: '대화 시작',
          description: '선택한 카테고리의 예시를 참고하여 대화를 시작하세요',
          icon: '💬'
        }
      ]
    };
  }

  getCategoryFilters(): CategoryFilter[] {
    // 실제 구현에서는 필터 목록을 반환
    return [];
  }

  processCategoryData(category: Category): Category {
    // 카테고리 데이터 처리 로직
    return {
      ...category,
      name: category.name.trim(),
      description: category.description?.trim() || ''
    };
  }
} 