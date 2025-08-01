import React from "react";

interface CategoryCode {
  id: string;
  code: string;
  description: string;
  category: string;
  examples?: string[];
}

interface CategoryCodeCardProps {
  code: CategoryCode;
  className?: string;
}

const CategoryCodeCard: React.FC<CategoryCodeCardProps> = ({ 
  code, 
  className = "" 
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'relationship': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      case 'topic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'emotion': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'communication': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'relationship': return '💕';
      case 'topic': return '💬';
      case 'emotion': return '😊';
      case 'communication': return '🗣️';
      default: return '📝';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'relationship': return '관계';
      case 'topic': return '주제';
      case 'emotion': return '감정';
      case 'communication': return '소통';
      default: return '기타';
    }
  };

  return (
    <div className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getCategoryColor(code.category)}`}>
            {getCategoryIcon(code.category)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {code.code}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(code.category)}`}>
              {getCategoryName(code.category)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            설명
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {code.description}
          </p>
        </div>

        {code.examples && code.examples.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              예시
            </h4>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCodeCard; 