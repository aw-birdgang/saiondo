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