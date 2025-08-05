import React from 'react';
import type { CategoryCode } from '../../../domain/types';

interface CategoryCodeModalProps {
  code: CategoryCode | null;
  isOpen: boolean;
  onClose: () => void;
}

const CategoryCodeModal: React.FC<CategoryCodeModalProps> = ({
  code,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !code) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4'>
        <div className='flex justify-between items-start mb-4'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            {code.code}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              설명
            </h3>
            <p className='text-gray-600 dark:text-gray-300'>
              {code.description}
            </p>
          </div>

          <div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              카테고리
            </h3>
            <span className='inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200'>
              {code.category}
            </span>
          </div>

          {code.examples && code.examples.length > 0 && (
            <div>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                예시
              </h3>
              <div className='flex flex-wrap gap-2'>
                {code.examples.map((example, index) => (
                  <span
                    key={index}
                    className='px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm dark:bg-gray-700 dark:text-gray-300'
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='mt-6 flex justify-end'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCodeModal;
