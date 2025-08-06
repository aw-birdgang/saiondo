import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { getContainer } from '@/di/container';
import { DI_TOKENS } from '@/di/tokens';
import { useCategory } from '@/presentation/hooks/useCategory';
import { useToastContext } from '@/presentation/providers/ToastProvider';
import { LoadingSpinner } from '@/presentation/components/common';
import {
  CategoryCodeGrid,
  CategoryCodeModal,
  CategoryCodeHeader,
  CategoryCodeSearch,
} from '@/presentation/components/category';
import type { CategoryUseCase } from '@/application/usecases/CategoryUseCase';

const CategoryCodeGuidePage: React.FC = () => {
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
    selectCategoryCode,
    clearSelectedCode,
    updateSearchTerm,
    navigateToHome,
    clearError,
  } = useCategory(categoryUseCase);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 에러 처리
  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      clearError();
    }
  }, [state.error, toast, clearError]);

  // 카테고리 코드 클릭 핸들러
  const handleCodeClick = (code: any) => {
    selectCategoryCode(code.id);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    clearSelectedCode();
  };

  if (state.isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <LoadingSpinner size='lg' text='카테고리 코드를 불러오는 중...' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* 헤더 */}
      <CategoryCodeHeader onNavigateBack={navigateToHome} />

      {/* 검색 */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <CategoryCodeSearch
          searchTerm={state.searchTerm}
          onSearchChange={updateSearchTerm}
          resultCount={state.filteredCodes.length}
        />

        {/* 카테고리 코드 그리드 */}
        <CategoryCodeGrid
          codes={state.filteredCodes}
          onCodeClick={handleCodeClick}
        />

        {/* 모달 */}
        <CategoryCodeModal
          code={state.selectedCode}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default CategoryCodeGuidePage;
