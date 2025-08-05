import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils/cn';
import type { Category } from '../../../domain/types/category';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  className?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
    >
      {categories.map(category => (
        <div
          key={category.id}
          className={cn(
            'p-6 border border-border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md',
            selectedCategory === category.id
              ? 'border-primary bg-primary/5 shadow-md'
              : 'bg-surface hover:bg-secondary/50'
          )}
          onClick={() => onCategorySelect(category.id)}
        >
          {/* 아이콘 */}
          <div className='flex items-center space-x-3 mb-4'>
            <div
              className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
                category.color
              )}
            >
              {category.icon}
            </div>
            <div>
              <h3 className='text-lg font-semibold text-txt'>
                {category.name}
              </h3>
            </div>
          </div>

          {/* 설명 */}
          <p className='text-txt-secondary text-sm mb-4 line-clamp-2'>
            {category.description}
          </p>

          {/* 예시 */}
          <div className='space-y-2'>
            <h4 className='text-sm font-medium text-txt'>예시 대화</h4>
            <ul className='space-y-1'>
              {category.examples.slice(0, 2).map((example, index) => (
                <li
                  key={index}
                  className='text-xs text-txt-secondary flex items-start'
                >
                  <span className='text-primary mr-1'>•</span>
                  {example}
                </li>
              ))}
            </ul>
            {category.examples.length > 2 && (
              <p className='text-xs text-txt-secondary'>
                +{category.examples.length - 2}개 더 보기
              </p>
            )}
          </div>

          {/* 선택 표시 */}
          {selectedCategory === category.id && (
            <div className='mt-4 flex items-center justify-center'>
              <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center'>
                <svg
                  className='w-4 h-4 text-white'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
