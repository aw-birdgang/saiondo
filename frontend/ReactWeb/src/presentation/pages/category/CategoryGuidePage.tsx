import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { getContainer } from '@/di/container';
import { DI_TOKENS } from '@/di/tokens';
import { useCategory } from '@/presentation/hooks/useCategory';
import { useToastContext } from '@/presentation/providers/ToastProvider';
import {
  PageWrapper,
  PageContainer,
  PageHeader,
} from '@/presentation/components/layout';
import { SectionHeader, ActionButtons } from '@/presentation/components/common';
import {
  CategoryGrid,
  CategoryDetailCard,
  UsageGuide,
} from '@/presentation/components/category';
import type { CategoryUseCase } from '@/application/usecases/CategoryUseCase';

const CategoryGuidePage: React.FC = () => {
  // const { t } = useTranslation();
  const toast = useToastContext();
  const container = getContainer();

  // Category Use Case 가져오기
      const [categoryUseCase] = useState<CategoryUseCase>(() =>
    container.get<CategoryUseCase>(DI_TOKENS.CATEGORY_USE_CASE)
  );

  // Category 상태 관리 훅
  const {
    state,
    // categoryStats,
    selectCategory,
    clearSelectedCategory,
    getUsageGuide,
    navigateToChat,
    navigateToHome,
    clearError,
  } = useCategory(categoryUseCase);

  // 에러 처리
  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      clearError();
    }
  }, [state.error, toast, clearError]);

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title='대화 카테고리 가이드'
        showBackButton
        onBackClick={navigateToHome}
      />

      {/* Main Content */}
      <PageContainer maxWidth='6xl' padding='lg'>
        <div className='space-y-8'>
          {/* Header Section */}
          <SectionHeader
            title='대화 카테고리 가이드'
            description='Saiondo에서 제공하는 다양한 대화 카테고리를 통해 더 의미 있는 대화를 나누어보세요. 각 카테고리는 특정 주제에 집중하여 더 깊이 있는 소통을 도와줍니다.'
            centered
          />

          {/* Categories Grid */}
          <CategoryGrid
            categories={state.filteredCategories}
            selectedCategory={state.selectedCategory?.id || null}
            onCategorySelect={selectCategory}
          />

          {/* Selected Category Details */}
          {state.selectedCategory && (
            <CategoryDetailCard
              category={state.selectedCategory}
              onClose={clearSelectedCategory}
              onStartChat={navigateToChat}
            />
          )}

          {/* How to Use */}
          <UsageGuide guide={getUsageGuide()} />

          {/* Action Buttons */}
          <ActionButtons
            actions={[
              {
                label: '대화 시작하기',
                onClick: navigateToChat,
                variant: 'primary',
              },
              {
                label: '홈으로 가기',
                onClick: navigateToHome,
                variant: 'secondary',
              },
            ]}
          />
        </div>
      </PageContainer>
    </PageWrapper>
  );
};

export default CategoryGuidePage;
