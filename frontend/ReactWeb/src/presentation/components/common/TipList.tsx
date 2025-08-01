import React from 'react';

interface TipListProps {
  tips: string[];
  maxItems?: number;
  className?: string;
}

const TipList: React.FC<TipListProps> = ({
  tips,
  maxItems = 2,
  className = '',
}) => {
  const displayTips = tips.slice(0, maxItems);

  return (
    <div className={className}>
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        팁
      </h4>
      <ul className="space-y-1">
        {displayTips.map((tip, index) => (
          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
            • {tip}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TipList; 