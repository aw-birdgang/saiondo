import type { ICategoryService } from './interfaces/ICategoryService';
import type { ICategoryUseCase } from './interfaces/ICategoryUseCase';
import type {
  Category,
  CategoryCode,
  CategoryStats,
  CategoryUsageGuide,
  CategoryFilter,
} from '../../domain/types/category';

// Category UseCase 구현체 - Service를 사용하여 애플리케이션 로직 조율
export class CategoryUseCase implements ICategoryUseCase {
  constructor(private categoryService: ICategoryService) {}

  async getCategories(): Promise<Category[]> {
    return await this.categoryService.getCategories();
  }

  async getCategoryCodes(): Promise<CategoryCode[]> {
    return await this.categoryService.getCategoryCodes();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return await this.categoryService.getCategoryById(id);
  }

  async getCategoryCodeById(id: string): Promise<CategoryCode | null> {
    return await this.categoryService.getCategoryCodeById(id);
  }

  async searchCategories(searchTerm: string): Promise<Category[]> {
    return await this.categoryService.searchCategories(searchTerm);
  }

  async searchCategoryCodes(searchTerm: string): Promise<CategoryCode[]> {
    return await this.categoryService.searchCategoryCodes(searchTerm);
  }

  async getCategoryStats(): Promise<CategoryStats> {
    return await this.categoryService.getCategoryStats();
  }

  async createCategory(category: Category): Promise<Category> {
    return await this.categoryService.createCategory(category);
  }

  async updateCategory(
    id: string,
    category: Partial<Category>
  ): Promise<Category> {
    return await this.categoryService.updateCategory(id, category);
  }

  async deleteCategory(id: string): Promise<boolean> {
    return await this.categoryService.deleteCategory(id);
  }

  validateCategoryId(id: string): boolean {
    return this.categoryService.validateCategoryId(id);
  }

  validateSearchTerm(searchTerm: string): boolean {
    return this.categoryService.validateSearchTerm(searchTerm);
  }

  filterCategoriesByType(categories: Category[], type: string): Category[] {
    return this.categoryService.filterCategoriesByType(categories, type);
  }

  getUsageGuide(): CategoryUsageGuide {
    return this.categoryService.getUsageGuide();
  }

  getCategoryFilters(): CategoryFilter[] {
    return this.categoryService.getCategoryFilters();
  }
}
