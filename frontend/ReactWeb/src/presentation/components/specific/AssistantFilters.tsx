import React from 'react';

interface AssistantFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const AssistantFilters: React.FC<AssistantFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className='mb-6'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
        Filter by Category
      </h3>
      <div className='flex flex-wrap gap-2'>
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssistantFilters;
