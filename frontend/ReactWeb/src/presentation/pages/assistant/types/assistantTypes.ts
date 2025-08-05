export interface Assistant {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  lastUsed?: Date;
  messageCount: number;
}

export interface AssistantCategory {
  id: string;
  name: string;
  icon: string;
}

export interface AssistantState {
  assistants: Assistant[];
  searchTerm: string;
  selectedCategory: string;
  isLoading: boolean;
  error: string | null;
}

export interface AssistantFiltersProps {
  selectedCategory: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export interface AssistantGridProps {
  assistants: Assistant[];
  onAssistantSelect: (assistant: Assistant) => void;
}
