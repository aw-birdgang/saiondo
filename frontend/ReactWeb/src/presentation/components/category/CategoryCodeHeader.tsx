import React from 'react';

interface CategoryCodeHeaderProps {
  onNavigateBack: () => void;
}

const CategoryCodeHeader: React.FC<CategoryCodeHeaderProps> = ({
  onNavigateBack,
}) => {
  return (
    <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              카테고리 코드 가이드
            </h1>
            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              대화 분석에 사용되는 카테고리 코드들을 확인하세요
            </p>
          </div>
          <button
            onClick={onNavigateBack}
            className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600'
          >
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCodeHeader;
