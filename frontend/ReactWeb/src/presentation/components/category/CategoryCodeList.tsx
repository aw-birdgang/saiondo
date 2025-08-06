import React from 'react';
import { EmptyState } from '@/presentation/components/common';

interface CategoryCode {
  id: string;
  code: string;
  description: string;
  category: string;
  examples?: string[];
}

interface CategoryCodeListProps {
  codes: CategoryCode[];
  onCodeClick?: (code: CategoryCode) => void;
  className?: string;
}

const CategoryCodeList: React.FC<CategoryCodeListProps> = ({
  codes,
  onCodeClick,
  className = '',
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'relationship':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200 border border-pink-200 dark:border-pink-800';
      case 'topic':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 border border-green-200 dark:border-green-800';
      case 'emotion':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200 border border-purple-200 dark:border-purple-800';
      default:
        return 'bg-secondary text-txt-secondary border border-border';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'relationship':
        return '👥';
      case 'topic':
        return '💬';
      case 'emotion':
        return '❤️';
      default:
        return '📝';
    }
  };

  if (codes.length === 0) {
    return (
      <EmptyState
        icon='🔍'
        title='검색 결과가 없습니다'
        description='다른 검색어를 시도해보세요.'
      />
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {codes.map(code => (
        <div
          key={code.id}
          className={`card p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] ${
            onCodeClick ? 'cursor-pointer' : ''
          }`}
          onClick={() => onCodeClick?.(code)}
        >
          <div className='flex items-start space-x-4'>
            {/* Code Icon */}
            <div className='w-14 h-14 bg-gradient-to-br from-primary/20 to-primary-container/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-md border-2 border-border'>
              <span className='text-xl font-bold text-primary'>
                {code.code[0]}
              </span>
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-center space-x-3 mb-3'>
                <h3 className='text-lg font-semibold text-txt leading-tight'>
                  {code.code}
                </h3>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(code.category)}`}
                >
                  {getCategoryIcon(code.category)} {code.category}
                </span>
              </div>

              <p className='text-txt-secondary mb-4 leading-relaxed'>
                {code.description}
              </p>

              {code.examples && code.examples.length > 0 && (
                <div className='flex flex-wrap gap-3'>
                  {code.examples.map((example, index) => (
                    <span
                      key={index}
                      className='px-3 py-1.5 bg-secondary text-txt-secondary rounded-lg text-xs font-medium border border-border'
                    >
                      {example}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCodeList;
