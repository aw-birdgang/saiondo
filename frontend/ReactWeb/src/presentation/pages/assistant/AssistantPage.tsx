import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from "../../../shared/constants/app";
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

interface Assistant {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  category: string;
  isActive: boolean;
  lastUsed?: Date;
  messageCount: number;
}

const AssistantListScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: 실제 API 호출로 대체
      // const response = await getAssistants();

      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock 데이터
      const mockAssistants: Assistant[] = [
        {
          id: 'assistant_001',
          name: '연애 상담사',
          description: '연인 관계와 데이트에 대한 조언을 제공합니다.',
          category: 'relationship',
          isActive: true,
          lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
          messageCount: 45,
        },
        {
          id: 'assistant_002',
          name: '감정 분석가',
          description: '대화의 감정을 분석하고 개선 방안을 제시합니다.',
          category: 'emotion',
          isActive: true,
          lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
          messageCount: 23,
        },
        {
          id: 'assistant_003',
          name: '커뮤니케이션 전문가',
          description: '효과적인 의사소통 방법을 가르쳐줍니다.',
          category: 'communication',
          isActive: false,
          messageCount: 12,
        },
        {
          id: 'assistant_004',
          name: '갈등 해결사',
          description: '관계에서 발생하는 갈등을 해결하는 방법을 제시합니다.',
          category: 'conflict',
          isActive: true,
          lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3일 전
          messageCount: 8,
        },
        {
          id: 'assistant_005',
          name: '미래 계획가',
          description: '관계의 미래를 계획하고 목표를 설정하는 것을 도와줍니다.',
          category: 'planning',
          isActive: false,
          messageCount: 5,
        },
      ];

      setAssistants(mockAssistants);
    } catch (err) {
      console.error('Failed to fetch assistants:', err);
      setError('AI 상담사를 불러오는데 실패했습니다.');
      toast.error('AI 상담사를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAssistants = assistants.filter(assistant => {
    const matchesSearch = assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assistant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || assistant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAssistantSelect = (assistant: Assistant) => {
    // TODO: 실제 채팅 화면으로 이동
    navigate(`${ROUTES.CHAT}?assistantId=${assistant.id}`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'relationship':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200';
      case 'emotion':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      case 'communication':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'conflict':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'planning':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'relationship':
        return '💕';
      case 'emotion':
        return '❤️';
      case 'communication':
        return '💬';
      case 'conflict':
        return '⚡';
      case 'planning':
        return '🎯';
      default:
        return '🤖';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString();
  };

  const categories = [
    { id: 'all', name: t('all_categories') || '전체', icon: '📋' },
    { id: 'relationship', name: t('relationship') || '관계', icon: '💕' },
    { id: 'emotion', name: t('emotion') || '감정', icon: '❤️' },
    { id: 'communication', name: t('communication') || '소통', icon: '💬' },
    { id: 'conflict', name: t('conflict') || '갈등', icon: '⚡' },
    { id: 'planning', name: t('planning') || '계획', icon: '🎯' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('loading_assistants') || 'AI 상담사를 불러오는 중...'}
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
            {t('error_loading_assistants') || 'AI 상담사 로딩 오류'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={fetchAssistants}
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
                <span className="text-2xl">🤖</span>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('ai_assistants') || 'AI 상담사'}
                </h1>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {assistants.length}명의 상담사
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-dark-secondary-container border-b dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search_assistants') || 'AI 상담사 검색...'}
              className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-surface dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredAssistants.length === 0 ? (
          <EmptyState
            icon="🤖"
            title={t('no_assistants_found') || 'AI 상담사를 찾을 수 없습니다'}
            description={t('no_assistants_found_description') || '다른 검색어나 카테고리를 시도해보세요.'}
          />
        ) : (
          <div className="space-y-4">
            {filteredAssistants.map((assistant) => (
              <div
                key={assistant.id}
                onClick={() => handleAssistantSelect(assistant)}
                className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">
                      {assistant.avatar || getCategoryIcon(assistant.category)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {assistant.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(assistant.category)}`}>
                          <span className="mr-1">{getCategoryIcon(assistant.category)}</span>
                          {categories.find(c => c.id === assistant.category)?.name || assistant.category}
                        </span>
                        {assistant.isActive && (
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {assistant.messageCount} {t('messages') || '메시지'}
                        </div>
                        {assistant.lastUsed && (
                          <div className="text-xs text-gray-400">
                            {formatTime(assistant.lastUsed)}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {assistant.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {t('start_chat') || '채팅 시작'}
                        </span>
                      </div>

                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantListScreen;
