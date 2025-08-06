import type {
  Category,
  CategoryCode,
  CategoryStats,
  CategoryUsageGuide,
  CategoryFilter,
} from '@/domain/types/category';

// Category UseCase 인터페이스 - 애플리케이션 로직 조율
export interface ICategoryUseCase {
  getCategories(): Promise<Category[]>;
  getCategoryCodes(): Promise<CategoryCode[]>;
  getCategoryById(id: string): Promise<Category | null>;
  getCategoryCodeById(id: string): Promise<CategoryCode | null>;
  searchCategories(searchTerm: string): Promise<Category[]>;
  searchCategoryCodes(searchTerm: string): Promise<CategoryCode[]>;
  getCategoryStats(): Promise<CategoryStats>;
  createCategory(category: Category): Promise<Category>;
  updateCategory(id: string, category: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<boolean>;
  validateCategoryId(id: string): boolean;
  validateSearchTerm(searchTerm: string): boolean;
  filterCategoriesByType(categories: Category[], type: string): Category[];
  getUsageGuide(): CategoryUsageGuide;
  getCategoryFilters(): CategoryFilter[];
}
