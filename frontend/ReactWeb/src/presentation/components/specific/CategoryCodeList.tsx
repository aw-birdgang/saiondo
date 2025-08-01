import React from "react";
import { EmptyState } from "../common";

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
  className = "" 
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'relationship':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'topic':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'emotion':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
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
        icon="🔍"
        title="검색 결과가 없습니다"
        description="다른 검색어를 시도해보세요."
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {codes.map((code) => (
        <div
          key={code.id}
          className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 hover:shadow-md transition-shadow ${
            onCodeClick ? 'cursor-pointer' : ''
          }`}
          onClick={() => onCodeClick?.(code)}
        >
          <div className="flex items-start space-x-4">
            {/* Code Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                {code.code[0]}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {code.code}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(code.category)}`}>
                  {getCategoryIcon(code.category)} {code.category}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {code.description}
              </p>
              
              {code.examples && code.examples.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {code.examples.map((example, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs"
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