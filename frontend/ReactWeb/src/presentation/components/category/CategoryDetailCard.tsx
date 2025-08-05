import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../common';
import { cn } from '../../../utils/cn';
import type { Category } from '../../../domain/types/category';

interface CategoryDetailCardProps {
  category: Category;
  onClose: () => void;
  onStartChat?: () => void;
  className?: string;
}

export const CategoryDetailCard: React.FC<CategoryDetailCardProps> = ({
  category,
  onClose,
  onStartChat,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-lg p-6',
        className
      )}
    >
      {/* 헤더 */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-3'>
          <div
            className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
              category.color
            )}
          >
            {category.icon}
          </div>
          <div>
            <h2 className='text-xl font-bold text-txt'>{category.name}</h2>
            <p className='text-txt-secondary'>{category.description}</p>
          </div>
        </div>
        <Button
          variant='ghost'
          size='sm'
          onClick={onClose}
          className='text-txt-secondary hover:text-txt'
        >
          <svg
            className='w-5 h-5'
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
        </Button>
      </div>

      {/* 예시 대화 */}
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-txt mb-3'>예시 대화</h3>
        <div className='space-y-2'>
          {category.examples.map((example, index) => (
            <div
              key={index}
              className='p-3 bg-secondary/30 rounded-lg border-l-4 border-primary'
            >
              <p className='text-sm text-txt'>{example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 팁 */}
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-txt mb-3'>💡 활용 팁</h3>
        <div className='space-y-2'>
          {category.tips.map((tip, index) => (
            <div key={index} className='flex items-start space-x-2'>
              <div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0'></div>
              <p className='text-sm text-txt-secondary'>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className='flex space-x-3'>
        {onStartChat && (
          <Button variant='primary' onClick={onStartChat} className='flex-1'>
            이 카테고리로 대화 시작하기
          </Button>
        )}
        <Button variant='outline' onClick={onClose} className='flex-1'>
          닫기
        </Button>
      </div>
    </div>
  );
};
