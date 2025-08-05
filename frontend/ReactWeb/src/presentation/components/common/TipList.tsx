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
      <h4 className='text-sm font-semibold text-txt mb-3'>팁</h4>
      <ul className='space-y-2'>
        {displayTips.map((tip, index) => (
          <li
            key={index}
            className='text-sm text-txt-secondary leading-relaxed'
          >
            • {tip}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TipList;
