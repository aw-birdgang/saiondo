export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
  tips: string[];
}

export interface CategoryCode {
  id: string;
  code: string;
  description: string;
  category: string;
  examples?: string[];
}

export interface CategoryState {
  isLoading: boolean;
  error: string | null;
  categories: Category[];
  categoryCodes: CategoryCode[];
  selectedCategory: Category | null;
  selectedCode: CategoryCode | null;
  searchTerm: string;
  filteredCategories: Category[];
  filteredCodes: CategoryCode[];
}

export interface CategoryRequest {
  categoryId?: string;
  searchTerm?: string;
  filterBy?: string;
}

export interface CategoryResponse {
  success: boolean;
  data: Category[] | CategoryCode[];
  message: string;
  error?: string;
}

export interface CategoryStats {
  totalCategories: number;
  totalCodes: number;
  byCategory: Record<string, number>;
  popularCategories: string[];
}

export interface CategoryUsageGuide {
  title: string;
  steps: {
    number: number;
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface CategoryFilter {
  id: string;
  name: string;
  isActive: boolean;
  count: number;
} 