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
      <h4 className="text-sm font-semibold text-txt mb-3">
        예시 질문
      </h4>
      <ul className="space-y-2">
        {displayExamples.map((example, index) => (
          <li key={index} className="text-sm text-txt-secondary leading-relaxed">
            • {example}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExampleList; 