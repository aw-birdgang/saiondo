import { ApiClient } from '../ApiClient';

const apiClient = new ApiClient();

export interface SearchResult {
  id: string;
  type: 'message' | 'channel' | 'user' | 'file';
  title: string;
  content: string;
  metadata?: Record<string, any>;
  score: number;
  createdAt: string;
}

export interface SearchRequest {
  query: string;
  type?: string;
  channelId?: string;
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}

export const searchService = {
  // 통합 검색
  search: async (request: SearchRequest): Promise<{
    results: SearchResult[];
    total: number;
    page: number;
    limit: number;
  }> => {
    return await apiClient.post<{
      results: SearchResult[];
      total: number;
      page: number;
      limit: number;
    }>('/search', request);
  },

  // 메시지 검색
  searchMessages: async (query: string, params?: {
    channelId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ results: SearchResult[]; total: number }> => {
    return await apiClient.get<{ results: SearchResult[]; total: number }>('/search/messages', {
      params: { query, ...params }
    });
  },

  // 채널 검색
  searchChannels: async (query: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{ results: SearchResult[]; total: number }> => {
    return await apiClient.get<{ results: SearchResult[]; total: number }>('/search/channels', {
      params: { query, ...params }
    });
  },

  // 사용자 검색
  searchUsers: async (query: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{ results: SearchResult[]; total: number }> => {
    return await apiClient.get<{ results: SearchResult[]; total: number }>('/search/users', {
      params: { query, ...params }
    });
  },

  // 검색 제안
  getSuggestions: async (query: string): Promise<string[]> => {
    return await apiClient.get<string[]>('/search/suggestions', {
      params: { query }
    });
  },

  // 인기 검색어
  getTrendingSearches: async (): Promise<string[]> => {
    return await apiClient.get<string[]>('/search/trending');
  },

  // 검색 기록
  getSearchHistory: async (): Promise<string[]> => {
    return await apiClient.get<string[]>('/search/history');
  },

  // 검색 기록 삭제
  clearSearchHistory: async (): Promise<{ success: boolean }> => {
    return await apiClient.delete<{ success: boolean }>('/search/history');
  }
}; 