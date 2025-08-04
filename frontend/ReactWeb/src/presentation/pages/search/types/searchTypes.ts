export interface SearchResult {
  id: string;
  type: 'user' | 'channel' | 'message' | 'analysis' | 'assistant' | 'category';
  title: string;
  description: string;
  url: string;
  metadata: {
    avatar?: string;
    sender?: string;
    timestamp?: Date;
    category?: string;
    tags?: string[];
    relevance?: number;
  };
  highlights?: {
    title?: string[];
    description?: string[];
  };
}

export interface SearchFilter {
  type: string;
  label: string;
  count: number;
  isActive: boolean;
}

export interface SearchState {
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  query: string;
  results: SearchResult[];
  filters: SearchFilter[];
  selectedFilters: string[];
  searchHistory: string[];
  recentSearches: string[];
  suggestions: string[];
  totalResults: number;
  currentPage: number;
  hasMore: boolean;
}

export interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isSearching: boolean;
  totalResults: number;
  className?: string;
}

export interface SearchFiltersProps {
  filters: SearchFilter[];
  selectedFilters: string[];
  onFilterChange: (filterType: string) => void;
  onClearFilters: () => void;
  className?: string;
}

export interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onResultClick: (result: SearchResult) => void;
  className?: string;
}

export interface SearchResultItemProps {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
  className?: string;
}

export interface SearchSuggestionsProps {
  suggestions: string[];
  recentSearches: string[];
  onSuggestionClick: (suggestion: string) => void;
  onRecentSearchClick: (search: string) => void;
  onClearHistory: () => void;
  className?: string;
}

export interface SearchEmptyStateProps {
  query: string;
  className?: string;
}

export interface SearchContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface SearchHistoryProps {
  searches: string[];
  onSearchClick: (search: string) => void;
  onClearHistory: () => void;
  className?: string;
}

export interface SearchTrendingProps {
  trendingSearches: string[];
  onTrendingClick: (search: string) => void;
  className?: string;
}

export interface SearchStats {
  totalResults: number;
  byType: Record<string, number>;
  searchTime: number;
  query: string;
}

export interface SearchSuggestion {
  text: string;
  type: 'history' | 'trending' | 'suggestion';
  relevance?: number;
} 