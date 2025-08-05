import type {
  Category,
  CategoryCode,
  CategoryStats,
} from '../../../domain/types/category';

// Category Repository 인터페이스 - 데이터 접근만 담당
export interface ICategoryRepository {
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
}
