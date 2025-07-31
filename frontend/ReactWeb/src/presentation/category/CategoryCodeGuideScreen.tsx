import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

interface CategoryCode {
  id: string;
  code: string;
  description: string;
  category: string;
  examples?: string[];
}

const CategoryCodeGuideScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [codes, setCodes] = useState<CategoryCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategoryCodes();
  }, []);

  const fetchCategoryCodes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: 실제 API 호출로 대체
      // const response = await getCategoryCodes();
      
      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock 데이터
      const mockCodes: CategoryCode[] = [
        {
          id: '1',
          code: 'REL001',
          description: '연인 관계',
          category: 'relationship',
          examples: ['남자친구', '여자친구', '연인', '애인'],
        },
        {
          id: '2',
          code: 'REL002',
          description: '부부 관계',
          category: 'relationship',
          examples: ['남편', '아내', '배우자', '부부'],
        },
        {
          id: '3',
          code: 'REL003',
          description: '가족 관계',
          category: 'relationship',
          examples: ['부모', '자녀', '형제', '자매'],
        },
        {
          id: '4',
          code: 'REL004',
          description: '친구 관계',
          category: 'relationship',
          examples: ['친구', '동료', '지인', '알고 지내는 사람'],
        },
        {
          id: '5',
          code: 'TOP001',
          description: '일상 대화',
          category: 'topic',
          examples: ['날씨', '음식', '취미', '일상'],
        },
        {
          id: '6',
          code: 'TOP002',
          description: '감정 공유',
          category: 'topic',
          examples: ['기쁨', '슬픔', '화남', '불안'],
        },
        {
          id: '7',
          code: 'TOP003',
          description: '문제 해결',
          category: 'topic',
          examples: ['갈등', '의사결정', '계획', '목표'],
        },
        {
          id: '8',
          code: 'TOP004',
          description: '미래 계획',
          category: 'topic',
          examples: ['결혼', '취업', '이사', '여행'],
        },
        {
          id: '9',
          code: 'EMO001',
          description: '긍정적 감정',
          category: 'emotion',
          examples: ['행복', '설렘', '감사', '희망'],
        },
        {
          id: '10',
          code: 'EMO002',
          description: '부정적 감정',
          category: 'emotion',
          examples: ['우울', '분노', '불안', '실망'],
        },
      ];
      
      setCodes(mockCodes);
    } catch (err) {
      console.error('Failed to fetch category codes:', err);
      setError('카테고리 코드를 불러오는데 실패했습니다.');
      toast.error('카테고리 코드를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCodes = codes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'relationship':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'topic':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'emotion':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'relationship':
        return '👥';
      case 'topic':
        return '💬';
      case 'emotion':
        return '❤️';
      default:
        return '📝';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('loading_category_codes') || '카테고리 코드를 불러오는 중...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('error_loading_codes') || '코드 로딩 오류'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={fetchCategoryCodes}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('retry') || '다시 시도'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-surface">
      {/* Header */}
      <div className="bg-white dark:bg-dark-secondary-container shadow-sm border-b dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📋</span>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('category_code_guide') || '카테고리 코드 안내'}
                </h1>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              총 {codes.length}개 코드
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-dark-secondary-container border-b dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search_codes') || '코드, 설명, 카테고리로 검색...'}
              className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-surface dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredCodes.length === 0 ? (
          <EmptyState
            icon="🔍"
            title={t('no_codes_found') || '검색 결과가 없습니다'}
            description={t('no_codes_found_description') || '다른 검색어를 시도해보세요.'}
          />
        ) : (
          <div className="space-y-4">
            {filteredCodes.map((code) => (
              <div
                key={code.id}
                className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  {/* Code Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      {code.code[0]}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {code.code}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(code.category)}`}>
                        <span className="mr-1">{getCategoryIcon(code.category)}</span>
                        {code.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {code.description}
                    </p>
                    
                    {code.examples && code.examples.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {t('examples') || '예시'}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {code.examples.map((example, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-white dark:bg-dark-secondary-container border-t dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t('category_code_info') || '카테고리 코드는 대화 분석과 AI 상담에 사용됩니다.'}
            </p>
            <div className="flex justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <span className="mr-1">👥</span>
                {t('relationship') || '관계'}
              </span>
              <span className="flex items-center">
                <span className="mr-1">💬</span>
                {t('topic') || '주제'}
              </span>
              <span className="flex items-center">
                <span className="mr-1">❤️</span>
                {t('emotion') || '감정'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCodeGuideScreen; 