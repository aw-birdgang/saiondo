import type { 
  SearchResult, 
  SearchRequest, 
  SearchResponse,
  SearchSuggestion,
  SearchHistoryItem,
  SearchTrendingItem
} from '../../domain/types/search';
import type { ISearchRepository } from '../../application/usecases/SearchUseCase';

// Mock 데이터
const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: '1',
    type: 'user',
    title: '김철수',
    description: '개발자 김철수입니다. React와 TypeScript를 주로 사용합니다.',
    url: '/profile/user1',
    metadata: {
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      category: '개발자',
      tags: ['React', 'TypeScript', 'Frontend'],
      relevance: 0.95
    },
    highlights: {
      title: ['김철수'],
      description: ['개발자', 'React', 'TypeScript']
    }
  },
  {
    id: '2',
    type: 'channel',
    title: '개발자 모임',
    description: '프론트엔드 개발자들이 모여서 기술을 공유하는 채널입니다.',
    url: '/channel/dev-meeting',
    metadata: {
      category: '개발',
      tags: ['프론트엔드', '개발', '기술공유'],
      relevance: 0.88
    },
    highlights: {
      title: ['개발자 모임'],
      description: ['프론트엔드', '개발자', '기술공유']
    }
  },
  {
    id: '3',
    type: 'message',
    title: 'React Hooks 사용법',
    description: 'useState와 useEffect를 활용한 상태 관리 방법에 대해 설명드리겠습니다.',
    url: '/chat/room1/message123',
    metadata: {
      sender: '김철수',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: '개발',
      tags: ['React', 'Hooks', 'useState', 'useEffect'],
      relevance: 0.82
    },
    highlights: {
      title: ['React Hooks'],
      description: ['useState', 'useEffect', '상태관리']
    }
  },
  {
    id: '4',
    type: 'analysis',
    title: '김철수 & 이영희 관계 분석',
    description: '두 사람의 관계 호환성과 소통 패턴을 분석한 결과입니다.',
    url: '/analysis/result1',
    metadata: {
      category: '관계분석',
      tags: ['호환성', '소통', '관계'],
      relevance: 0.75
    },
    highlights: {
      title: ['김철수', '이영희', '관계 분석'],
      description: ['호환성', '소통', '패턴']
    }
  },
  {
    id: '5',
    type: 'assistant',
    title: '개발 도우미 AI',
    description: '코딩 관련 질문에 답변하고 코드 리뷰를 도와주는 AI 상담사입니다.',
    url: '/assistant/dev-helper',
    metadata: {
      category: 'AI 상담사',
      tags: ['코딩', '리뷰', '질문'],
      relevance: 0.70
    },
    highlights: {
      title: ['개발 도우미 AI'],
      description: ['코딩', '리뷰', '질문']
    }
  },
  {
    id: '6',
    type: 'category',
    title: '프로그래밍',
    description: '프로그래밍 언어와 개발 도구에 관한 대화 주제입니다.',
    url: '/category/programming',
    metadata: {
      category: '기술',
      tags: ['프로그래밍', '개발', '언어'],
      relevance: 0.65
    },
    highlights: {
      title: ['프로그래밍'],
      description: ['언어', '개발', '도구']
    }
  }
];

const SEARCH_SUGGESTIONS = [
  'React 개발',
  'TypeScript 튜토리얼',
  '프론트엔드 개발',
  '백엔드 개발',
  'AI 상담사',
  '관계 분석',
  '채팅 기능',
  '사용자 프로필',
  '개발자 모임',
  '코딩 팁'
];

const TRENDING_SEARCHES = [
  'React 18',
  'TypeScript',
  'Next.js',
  'Tailwind CSS',
  'AI 개발',
  '웹 개발',
  '모바일 앱',
  '데이터베이스',
  '클라우드',
  'DevOps'
];

export class SearchRepository implements ISearchRepository {
  private searchHistory: SearchHistoryItem[] = [
    {
      query: 'React 개발',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      resultCount: 5
    },
    {
      query: 'TypeScript',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      resultCount: 3
    }
  ];

  async search(request: SearchRequest): Promise<SearchResponse> {
    // 검색 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));

    const { query, filters = [], page = 1, limit = 10 } = request;

    // 검색어가 포함된 결과 필터링
    const searchResults = MOCK_SEARCH_RESULTS.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase()) ||
      result.metadata.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    // 필터 적용
    const filteredResults = filters.length > 0 && !filters.includes('all')
      ? searchResults.filter(result => filters.includes(result.type))
      : searchResults;

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    // 검색 히스토리에 저장
    await this.saveSearchHistory(query, filteredResults.length);

    const suggestions = await this.getSuggestions(query);
    
    return {
      results: paginatedResults,
      totalResults: filteredResults.length,
      currentPage: page,
      totalPages: Math.ceil(filteredResults.length / limit),
      hasMore: endIndex < filteredResults.length,
      searchTime: 500,
      suggestions: suggestions.map(s => s.text)
    };
  }

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (!query.trim()) {
      return [];
    }

    // 검색 제안 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 200));

    const filteredSuggestions = SEARCH_SUGGESTIONS.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );

    return filteredSuggestions.slice(0, 5).map(suggestion => ({
      text: suggestion,
      type: 'suggestion' as const,
      relevance: 0.8
    }));
  }

  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    // 검색 히스토리 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 100));

    return this.searchHistory.sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async getTrendingSearches(): Promise<SearchTrendingItem[]> {
    // 트렌딩 검색어 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 100));

    return TRENDING_SEARCHES.map((query, index) => ({
      query,
      count: Math.floor(Math.random() * 1000) + 100,
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
    }));
  }

  async saveSearchHistory(query: string, resultCount: number): Promise<void> {
    // 기존 히스토리에서 중복 제거
    this.searchHistory = this.searchHistory.filter(item => item.query !== query);

    // 새로운 검색을 맨 앞에 추가
    this.searchHistory.unshift({
      query,
      timestamp: new Date(),
      resultCount
    });

    // 최대 10개까지만 유지
    if (this.searchHistory.length > 10) {
      this.searchHistory = this.searchHistory.slice(0, 10);
    }
  }

  async clearSearchHistory(): Promise<void> {
    this.searchHistory = [];
  }
} 