import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils/cn';
import type { CategoryCode } from '../../../domain/types/category';

interface CategoryCodeGridProps {
  codes: CategoryCode[];
  onCodeClick: (code: CategoryCode) => void;
  className?: string;
}

export const CategoryCodeGrid: React.FC<CategoryCodeGridProps> = ({
  codes,
  onCodeClick,
  className,
}) => {
  const { t } = useTranslation();

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'relationship':
        return 'bg-pink-100 text-pink-800';
      case 'topic':
        return 'bg-blue-100 text-blue-800';
      case 'emotion':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'relationship':
        return '💕';
      case 'topic':
        return '💬';
      case 'emotion':
        return '😊';
      default:
        return '📋';
    }
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        className
      )}
    >
      {codes.map(code => (
        <div
          key={code.id}
          className='p-4 border border-border rounded-lg cursor-pointer hover:shadow-md transition-shadow bg-surface'
          onClick={() => onCodeClick(code)}
        >
          {/* 헤더 */}
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center space-x-2'>
              <span className='text-lg'>{getCategoryIcon(code.category)}</span>
              <span
                className={cn(
                  'px-2 py-1 rounded text-xs font-medium',
                  getCategoryColor(code.category)
                )}
              >
                {code.category}
              </span>
            </div>
            <div className='text-sm font-mono text-txt-secondary'>
              {code.code}
            </div>
          </div>

          {/* 설명 */}
          <h3 className='font-medium text-txt mb-2'>{code.description}</h3>

          {/* 예시 */}
          {code.examples && code.examples.length > 0 && (
            <div className='space-y-1'>
              <p className='text-xs text-txt-secondary'>예시:</p>
              <div className='flex flex-wrap gap-1'>
                {code.examples.slice(0, 3).map((example, index) => (
                  <span
                    key={index}
                    className='px-2 py-1 bg-secondary text-xs rounded text-txt-secondary'
                  >
                    {example}
                  </span>
                ))}
                {code.examples.length > 3 && (
                  <span className='px-2 py-1 bg-secondary text-xs rounded text-txt-secondary'>
                    +{code.examples.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
