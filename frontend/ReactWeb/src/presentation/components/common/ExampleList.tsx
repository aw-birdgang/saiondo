import React from 'react';

interface ExampleListProps {
  examples: string[];
  maxItems?: number;
  className?: string;
}

const ExampleList: React.FC<ExampleListProps> = ({
  examples,
  maxItems = 2,
  className = '',
}) => {
  const displayExamples = examples.slice(0, maxItems);

  return (
    <div className={className}>
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        예시 질문
      </h4>
      <ul className="space-y-1">
        {displayExamples.map((example, index) => (
          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
            • {example}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExampleList; 