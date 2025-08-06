import type {
  SearchResult,
  SearchRequest,
  SearchResponse,
  SearchSuggestion,
  SearchHistoryItem,
  SearchTrendingItem,
} from '@/domain/types/search';
import type {
  SubscriptionProduct,
  PaymentMethod,
  Coupon,
  PaymentRequest,
  PaymentResponse,
} from '@/domain/types/payment';
import type {
  Category,
  CategoryCode,
  CategoryStats,
} from '@/domain/types/category';
import type {
  ChannelInvitationItem,
  InviteRequest,
  InviteResponse,
  InvitationResponseRequest,
  InvitationResponseResponse,
  InviteStats,
} from '@/domain/types/invite';

/**
 * SystemRepository - 시스템 관련 모든 기능을 통합한 Repository
 * 검색, 결제, 카테고리, 초대 기능을 포함
 */
export class SystemRepository {
  // ==================== 검색 관련 ====================

  private searchHistory: SearchHistoryItem[] = [
    {
      query: 'React Hooks',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      resultCount: 15,
    },
    {
      query: 'TypeScript',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      resultCount: 8,
    },
  ];

  async search(request: SearchRequest): Promise<SearchResponse> {
    // 검색 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock 검색 결과
    const mockResults: SearchResult[] = [
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
          relevance: 0.95,
        },
        highlights: {
          title: ['김철수'],
          description: ['개발자', 'React', 'TypeScript'],
        },
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
          relevance: 0.88,
        },
        highlights: {
          title: ['개발자 모임'],
          description: ['프론트엔드', '개발자', '기술공유'],
        },
      },
    ];

    return {
      results: mockResults,
      totalResults: mockResults.length,
      currentPage: 1,
      totalPages: 1,
      hasMore: false,
      searchTime: 500,
      suggestions: (await this.getSuggestions(request.query)).map(s => s.text),
    };
  }

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    const suggestions: SearchSuggestion[] = [
      { text: `${query} 사용법`, type: 'suggestion' },
      { text: `${query} 예제`, type: 'suggestion' },
      { text: `${query} 튜토리얼`, type: 'suggestion' },
    ];

    return suggestions.slice(0, 3);
  }

  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    return this.searchHistory;
  }

  async getTrendingSearches(): Promise<SearchTrendingItem[]> {
    return [
      { id: '1', query: 'React Hooks', count: 1250 },
      { id: '2', query: 'TypeScript', count: 980 },
      { id: '3', query: 'Clean Architecture', count: 750 },
    ];
  }

  async saveSearchHistory(query: string, resultCount: number): Promise<void> {
    const newHistory: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      resultCount,
    };

    this.searchHistory.unshift(newHistory);
    this.searchHistory = this.searchHistory.slice(0, 10); // 최근 10개만 유지
  }

  async clearSearchHistory(): Promise<void> {
    this.searchHistory = [];
  }

  // ==================== 결제 관련 ====================

  async getSubscriptionProducts(): Promise<SubscriptionProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
      {
        id: 'basic_monthly',
        title: '기본 월간 구독',
        description: '월 1,000포인트 제공',
        price: '₩9,900',
        originalPrice: '₩12,900',
        discount: '23% 할인',
        period: 'monthly',
        points: 1000,
        features: [
          '월 1,000포인트 제공',
          '기본 AI 상담 서비스',
          '채팅 히스토리 저장',
          '이메일 지원',
        ],
        popular: false,
      },
      {
        id: 'premium_monthly',
        title: '프리미엄 월간 구독',
        description: '월 3,000포인트 제공',
        price: '₩19,900',
        originalPrice: '₩29,900',
        discount: '33% 할인',
        period: 'monthly',
        points: 3000,
        features: [
          '월 3,000포인트 제공',
          '고급 AI 상담 서비스',
          '무제한 채팅',
          '우선 고객 지원',
          '고급 분석 기능',
          '개인화된 추천',
        ],
        popular: true,
      },
      {
        id: 'premium_yearly',
        title: '프리미엄 연간 구독',
        description: '연 36,000포인트 제공',
        price: '₩199,900',
        originalPrice: '₩358,800',
        discount: '44% 할인',
        period: 'yearly',
        points: 36000,
        features: [
          '연 36,000포인트 제공',
          '고급 AI 상담 서비스',
          '무제한 채팅',
          '우선 고객 지원',
          '고급 분석 기능',
          '개인화된 추천',
          '2개월 무료',
        ],
        popular: false,
      },
    ];
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return [
      {
        id: 'card',
        name: '신용카드',
        icon: '💳',
        description: 'Visa, Mastercard, Amex',
        isAvailable: true,
      },
      {
        id: 'bank',
        name: '계좌이체',
        icon: '🏦',
        description: '실시간 계좌이체',
        isAvailable: true,
      },
      {
        id: 'mobile',
        name: '휴대폰 결제',
        icon: '📱',
        description: '통신사 결제',
        isAvailable: true,
      },
      {
        id: 'crypto',
        name: '암호화폐',
        icon: '₿',
        description: 'Bitcoin, Ethereum',
        isAvailable: false,
      },
    ];
  }

  async validateCoupon(code: string): Promise<Coupon | null> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const validCoupons: Record<string, Coupon> = {
      'WELCOME10': {
        code: 'WELCOME10',
        discount: 10,
        type: 'percentage',
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30일 후
        minAmount: 10000,
        maxDiscount: 5000,
      },
      'SAVE5000': {
        code: 'SAVE5000',
        discount: 5000,
        type: 'fixed',
        validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7일 후
        minAmount: 20000,
        maxDiscount: 5000,
      },
    };

    return validCoupons[code] || null;
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: request.amount,
        currency: request.currency,
        timestamp: new Date(),
      };
    } else {
      return {
        success: false,
        error: 'PAYMENT_FAILED',
        message: '결제 처리에 실패했습니다.',
      };
    }
  }

  // ==================== 카테고리 관련 ====================

  private readonly categories: Category[] = [
    {
      id: 'relationship',
      name: '관계 개선',
      description: '파트너와의 관계를 더 깊고 건강하게 만들어가는 대화',
      icon: '💕',
      color: 'bg-pink-100 text-pink-800',
      examples: [
        '서로의 감정을 더 잘 이해하고 싶어요',
        '관계에서 개선하고 싶은 부분이 있어요',
        '파트너와 더 깊은 대화를 나누고 싶어요',
        '서로의 사랑 언어를 알아보고 싶어요',
      ],
      tips: [
        '정기적으로 관계에 대해 대화하는 시간을 가져보세요',
        '서로의 감정을 표현할 때 "나" 메시지를 사용하세요',
        '파트너의 관점을 이해하려고 노력하세요',
        '작은 것들에도 감사함을 표현하세요',
      ],
    },
    {
      id: 'communication',
      name: '소통 개선',
      description: '더 효과적이고 건강한 소통 방법을 배우는 대화',
      icon: '💬',
      color: 'bg-blue-100 text-blue-800',
      examples: [
        '대화할 때 자주 싸우게 돼요',
        '서로의 의견이 다를 때 어떻게 대화해야 할지 모르겠어요',
        '파트너의 말을 제대로 이해하지 못할 때가 있어요',
        '감정적인 대화를 할 때 어려움이 있어요',
      ],
      tips: [
        '듣기와 말하기의 균형을 맞추세요',
        '감정이 격해질 때는 잠시 휴식을 취하세요',
        '파트너의 말을 반복해서 확인해보세요',
        '비난보다는 요청의 형태로 말해보세요',
      ],
    },
    {
      id: 'conflict',
      name: '갈등 해결',
      description: '관계에서 발생하는 갈등을 건설적으로 해결하는 방법',
      icon: '🤝',
      color: 'bg-orange-100 text-orange-800',
      examples: [
        '자주 같은 문제로 다투게 돼요',
        '갈등이 생겼을 때 어떻게 해결해야 할지 모르겠어요',
        '서로의 입장이 다를 때 합의점을 찾기 어려워요',
        '과거의 상처가 현재 갈등에 영향을 미쳐요',
      ],
      tips: [
        '갈등의 원인을 함께 찾아보세요',
        '승리보다는 해결에 집중하세요',
        '과거의 일을 끌어오지 마세요',
        '서로의 감정을 인정하고 공감하세요',
      ],
    },
    {
      id: 'intimacy',
      name: '친밀감 증진',
      description: '파트너와의 정서적, 신체적 친밀감을 높이는 대화',
      icon: '💝',
      color: 'bg-red-100 text-red-800',
      examples: [
        '파트너와 더 가까워지고 싶어요',
        '서로의 취미와 관심사를 더 잘 알고 싶어요',
        '로맨틱한 시간을 더 많이 가져보고 싶어요',
        '서로의 꿈과 목표를 공유하고 싶어요',
      ],
      tips: [
        '매일 서로에 대해 새로운 것을 알아보세요',
        '함께 새로운 경험을 해보세요',
        '서로의 취미에 관심을 가져보세요',
        '정기적인 데이트 시간을 가져보세요',
      ],
    },
    {
      id: 'future',
      name: '미래 계획',
      description: '함께 미래를 계획하고 목표를 설정하는 대화',
      icon: '🎯',
      color: 'bg-green-100 text-green-800',
      examples: [
        '함께 미래 계획을 세우고 싶어요',
        '결혼이나 동거에 대해 이야기하고 싶어요',
        '경제적인 계획을 함께 세우고 싶어요',
        '가족 계획에 대해 이야기하고 싶어요',
      ],
      tips: [
        '서로의 가치관과 목표를 먼저 공유하세요',
        '단계별로 계획을 세워보세요',
        '현실적인 목표를 설정하세요',
        '정기적으로 계획을 점검하고 조정하세요',
      ],
    },
  ];

  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async getCategoryCodes(): Promise<CategoryCode[]> {
    return this.categories.map(category => ({
      id: category.id,
      code: category.id.toUpperCase(),
      name: category.name,
    }));
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categories.find(category => category.id === id) || null;
  }

  async getCategoryCodeById(id: string): Promise<CategoryCode | null> {
    const category = await this.getCategoryById(id);
    return category ? {
      id: category.id,
      code: category.id.toUpperCase(),
      name: category.name,
    } : null;
  }

  async searchCategories(searchTerm: string): Promise<Category[]> {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return this.categories.filter(category =>
      category.name.toLowerCase().includes(lowerSearchTerm) ||
      category.description.toLowerCase().includes(lowerSearchTerm)
    );
  }

  async searchCategoryCodes(searchTerm: string): Promise<CategoryCode[]> {
    const categories = await this.searchCategories(searchTerm);
    return categories.map(category => ({
      id: category.id,
      code: category.id.toUpperCase(),
      name: category.name,
    }));
  }

  async getCategoryStats(): Promise<CategoryStats> {
    return {
      totalCategories: this.categories.length,
      mostPopular: 'relationship',
      usageCount: {
        relationship: 1250,
        communication: 980,
        conflict: 750,
        intimacy: 650,
        future: 450,
      },
    };
  }

  // ==================== 초대 관련 ====================

  async sendInvitation(request: InviteRequest): Promise<InviteResponse> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      return {
        success: true,
        invitationId: `INV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: '초대가 성공적으로 발송되었습니다.',
      };
    } else {
      return {
        success: false,
        message: '초대 발송에 실패했습니다. 다시 시도해주세요.',
        error: 'SEND_FAILED',
      };
    }
  }

  async getInvitations(userId: string): Promise<ChannelInvitationItem[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockInvitations: ChannelInvitationItem[] = [
      {
        id: '1',
        inviterId: 'user1',
        inviteeId: userId,
        channelId: 'channel1',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        inviterName: '김철수',
        channelName: '우리만의 채널',
      },
      {
        id: '2',
        inviterId: 'user2',
        inviteeId: userId,
        channelId: 'channel2',
        status: 'accepted',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        inviterName: '이영희',
        channelName: '커플 채널',
      },
      {
        id: '3',
        inviterId: 'user3',
        inviteeId: userId,
        channelId: 'channel3',
        status: 'rejected',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        inviterName: '박민수',
        channelName: '친구 채널',
      },
    ];

    return mockInvitations;
  }

  async respondToInvitation(
    request: InvitationResponseRequest
  ): Promise<InvitationResponseResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      return {
        success: true,
        message: request.accepted
          ? '초대를 수락했습니다!'
          : '초대를 거절했습니다.',
      };
    } else {
      return {
        success: false,
        message: '초대 응답에 실패했습니다. 다시 시도해주세요.',
        error: 'RESPONSE_FAILED',
      };
    }
  }

  async getInvitationStats(userId: string): Promise<InviteStats> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      totalSent: 15,
      totalReceived: 8,
      pendingSent: 3,
      pendingReceived: 2,
      acceptedSent: 10,
      acceptedReceived: 5,
      rejectedSent: 2,
      rejectedReceived: 1,
    };
  }

  async cancelInvitation(invitationId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Math.random() > 0.1; // 90% 성공률
  }
} 