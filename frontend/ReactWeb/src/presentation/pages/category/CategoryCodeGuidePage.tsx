import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getContainer } from '../../../app/di/container';
import { DI_TOKENS } from '../../../app/di/tokens';
import { useCategory } from '../../hooks/useCategory';
import { useToastContext } from '../../providers/ToastProvider';
import { LoadingSpinner } from '../../components/common';
import { CategoryCodeGrid, CategoryCodeModal } from '../../components/category';
import type { ICategoryUseCase } from '../../../application/usecases/CategoryUseCase';

const CategoryCodeGuidePage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToastContext();
  const container = getContainer();

  // Category Use Case 가져오기
  const [categoryUseCase] = useState<ICategoryUseCase>(() => 
    container.get<ICategoryUseCase>(DI_TOKENS.CATEGORY_USE_CASE)
  );

  // Category 상태 관리 훅
  const {
    state,
    categoryStats,
    selectCategoryCode,
    clearSelectedCode,
    updateSearchTerm,
    navigateToHome,
    clearError
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="카테고리 코드를 불러오는 중..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                카테고리 코드 가이드
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                대화 분석에 사용되는 카테고리 코드들을 확인하세요
              </p>
            </div>
            <button
              onClick={navigateToHome}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </div>

      {/* 검색 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <input
            type="text"
            value={state.searchTerm}
            onChange={(e) => updateSearchTerm(e.target.value)}
            placeholder="코드, 설명, 카테고리로 검색..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* 결과 */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {state.filteredCodes.length}개의 카테고리 코드를 찾았습니다.
          </p>
        </div>

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