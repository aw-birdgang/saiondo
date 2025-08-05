import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../../shared/constants/app';
import { EmptyState, LoadingState } from '../../components/common';
import { ErrorState, PageHeader } from '../../components/specific';
import {
  AssistantContainer,
  AssistantFilters,
  AssistantGrid,
} from '../../components/specific/assistant';
import { useAssistantData } from './hooks/useAssistantData';
import type { Assistant } from './types/assistantTypes';

const AssistantListScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 커스텀 훅으로 데이터 관리
  const {
    filteredAssistants,
    categories,
    searchTerm,
    selectedCategory,
    isLoading,
    error,
    setSearchTerm,
    setSelectedCategory,
  } = useAssistantData();

  // 어시스턴트 선택 처리
  const handleAssistantSelect = (assistant: Assistant) => {
    try {
      // 채팅 페이지로 이동하면서 AI 상담사 정보를 전달
      const chatParams = new URLSearchParams({
        assistantId: assistant.id,
        assistantName: assistant.name,
        assistantCategory: assistant.category,
        assistantDescription: assistant.description,
      });

      navigate(`${ROUTES.CHAT}?${chatParams.toString()}`);

      // 성공 메시지 표시
      toast.success(
        t('chat.started_with_assistant') ||
          `${assistant.name}와 대화를 시작합니다.`
      );
    } catch (error) {
      console.error('Failed to navigate to chat:', error);
      toast.error(
        t('chat.navigation_error') ||
          '채팅 페이지로 이동하는 중 오류가 발생했습니다.'
      );
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <LoadingState
        message={t('loading_assistants') || 'AI 상담사를 불러오는 중...'}
      />
    );
  }

  // 에러 상태
  if (error) {
    return (
      <ErrorState
        title={t('error_loading_assistants') || 'AI 상담사 로딩 오류'}
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <AssistantContainer>
      {/* Header */}
      <div className='mb-6'>
        <PageHeader
          title={t('ai_assistants') || 'AI 상담사'}
          subtitle={`${filteredAssistants.length}명의 상담사`}
          showBackButton
        />
      </div>

      {/* Search and Filter */}
      <div className='mb-6'>
        <AssistantFilters
          selectedCategory={selectedCategory}
          categories={categories}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Content */}
      <div>
        {filteredAssistants.length === 0 ? (
          <EmptyState
            icon='🤖'
            title={t('no_assistants_found') || 'AI 상담사를 찾을 수 없습니다'}
            description={
              t('no_assistants_found_description') ||
              '다른 검색어나 카테고리를 시도해보세요.'
            }
          />
        ) : (
          <AssistantGrid
            assistants={filteredAssistants}
            onAssistantSelect={handleAssistantSelect}
          />
        )}
      </div>
    </AssistantContainer>
  );
};

export default AssistantListScreen;
