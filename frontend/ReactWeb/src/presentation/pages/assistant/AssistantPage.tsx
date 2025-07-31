import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from "../../../shared/constants/app";
import { 
  Header, 
  EmptyState 
} from '../../components/common';
import { 
  SearchBar, 
  CategoryFilter, 
  AssistantCard 
} from '../../components/specific/assistant';
import { 
  LoadingState, 
  ErrorState 
} from '../../components/specific/test';

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
      <LoadingState 
        message={t('loading_assistants') || 'AI 상담사를 불러오는 중...'}
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t('error_loading_assistants') || 'AI 상담사 로딩 오류'}
        message={error}
        onRetry={fetchAssistants}
        retryText={t('retry') || '다시 시도'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-surface">
      {/* Header */}
      <Header
        title={t('ai_assistants') || 'AI 상담사'}
        showBackButton
        className="max-w-4xl mx-auto"
      >
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {assistants.length}명의 상담사
        </div>
      </Header>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-dark-secondary-container border-b dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('search_assistants') || 'AI 상담사 검색...'}
            className="mb-4"
          />

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
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
              <AssistantCard
                key={assistant.id}
                assistant={assistant}
                categoryName={categories.find(c => c.id === assistant.category)?.name || assistant.category}
                categoryColor={getCategoryColor(assistant.category)}
                categoryIcon={getCategoryIcon(assistant.category)}
                onClick={handleAssistantSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantListScreen;
