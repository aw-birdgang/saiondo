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

export interface SearchRequest {
  query: string;
  filters?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  searchTime: number;
  suggestions: string[];
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

export interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  resultCount: number;
}

export interface SearchTrendingItem {
  query: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}
