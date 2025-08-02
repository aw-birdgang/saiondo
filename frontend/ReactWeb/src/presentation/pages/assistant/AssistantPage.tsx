import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-hot-toast';
import {ROUTES} from "../../../shared/constants/app";
import {EmptyState} from '../../components/common';
import {AssistantFilters, AssistantGrid, ErrorState, LoadingState} from '../../components/specific';
import {AssistantPageContainer, AssistantFiltersContainer, AssistantContentContainer} from '../../components/common';
import type {Assistant, AssistantCategory} from '../../../domain/types';

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



  const categories: AssistantCategory[] = [
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
      />
    );
  }

  return (
    <AssistantPageContainer>
      {/* Header */}
      <PageHeader
        title={t('ai_assistants') || 'AI 상담사'}
        subtitle={`${assistants.length}명의 상담사`}
        showBackButton
      />

      {/* Search and Filter */}
      <AssistantFiltersContainer>
        <AssistantFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          categories={categories}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />
      </AssistantFiltersContainer>

      {/* Content */}
      <AssistantContentContainer>
        {filteredAssistants.length === 0 ? (
          <EmptyState
            icon="🤖"
            title={t('no_assistants_found') || 'AI 상담사를 찾을 수 없습니다'}
            description={t('no_assistants_found_description') || '다른 검색어나 카테고리를 시도해보세요.'}
          />
        ) : (
          <AssistantGrid
            assistants={filteredAssistants}
            onAssistantSelect={handleAssistantSelect}
          />
        )}
      </AssistantContentContainer>
    </AssistantPageContainer>
  );
};

export default AssistantListScreen;
