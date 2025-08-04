import React from 'react';

interface CategoryCodeSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

const CategoryCodeSearch: React.FC<CategoryCodeSearchProps> = ({
  searchTerm,
  onSearchChange,
  resultCount,
}) => {
  return (
    <div className="mb-6">
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="코드, 설명, 카테고리로 검색..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          {resultCount}개의 카테고리 코드를 찾았습니다.
        </p>
      </div>
    </div>
  );
};

export default CategoryCodeSearch; 