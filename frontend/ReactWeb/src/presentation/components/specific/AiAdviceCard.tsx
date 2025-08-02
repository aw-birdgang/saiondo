import React from 'react';

interface AiAdviceCardProps {
  title: string;
  content: string;
  category: string;
  timestamp: Date;
}

export const AiAdviceCard: React.FC<AiAdviceCardProps> = ({ 
  title, 
  content, 
  category, 
  timestamp 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
            {category}
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {timestamp.toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {content}
      </p>
    </div>
  );
}; 