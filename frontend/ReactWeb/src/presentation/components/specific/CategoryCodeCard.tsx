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
      case 'relationship': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400 border border-pink-200 dark:border-pink-800';
      case 'topic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
      case 'emotion': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'communication': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-200 dark:border-purple-800';
      default: return 'bg-secondary text-txt-secondary border border-border';
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
    <div className={`card p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] ${className}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md ${getCategoryColor(code.category)}`}>
            {getCategoryIcon(code.category)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-txt leading-tight">
              {code.code}
            </h3>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(code.category)}`}>
              {getCategoryName(code.category)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-txt mb-3 leading-tight">
            설명
          </h4>
          <p className="text-txt-secondary text-sm leading-relaxed">
            {code.description}
          </p>
        </div>

        {code.examples && code.examples.length > 0 && (
          <div>
            <h4 className="font-semibold text-txt mb-3 leading-tight">
              예시
            </h4>
            <div className="flex flex-wrap gap-3">
              {code.examples.map((example, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-secondary text-txt-secondary rounded-lg text-xs font-medium border border-border"
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