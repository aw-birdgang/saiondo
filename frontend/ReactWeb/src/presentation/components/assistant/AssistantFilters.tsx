import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/presentation/components/common';
import { cn } from '@/utils/cn';

interface AssistantFiltersExtendedProps {
  selectedCategory: string;
  categories: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
  onCategoryChange: (category: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const AssistantFilters: React.FC<AssistantFiltersExtendedProps> = ({
  selectedCategory,
  categories,
  onCategoryChange,
  searchTerm = '',
  onSearchChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-4'>
      {/* 검색 */}
      {onSearchChange && (
        <div className='flex items-center space-x-2'>
          <Input
            type='text'
            placeholder={t('search_assistants') || 'AI 상담사 검색...'}
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className='flex-1'
            leftIcon={
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            }
          />
        </div>
      )}

      {/* 카테고리 필터 */}
      <div className='flex flex-wrap gap-2'>
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'outline'}
            size='sm'
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'flex items-center space-x-2',
              selectedCategory === category.id && 'bg-primary text-on-primary'
            )}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AssistantFilters;
