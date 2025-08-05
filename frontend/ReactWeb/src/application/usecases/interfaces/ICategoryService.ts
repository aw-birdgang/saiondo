import type { 
  Category, 
  CategoryCode, 
  CategoryRequest, 
  CategoryResponse,
  CategoryStats,
  CategoryUsageGuide,
  CategoryFilter
} from '../../../domain/types/category';

// Category Service 인터페이스 - 비즈니스 로직 담당
export interface ICategoryService {
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
  processCategoryData(category: Category): Category;
} 