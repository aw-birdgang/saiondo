import React from 'react';

interface ProgressItemProps {
  id: string;
  label: string;
  color: 'green' | 'yellow' | 'red';
  index: number;
}

const ProgressItem: React.FC<ProgressItemProps> = ({ label, color, index }) => {
  const getColorClass = (color: 'green' | 'yellow' | 'red') => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
    }
  };

  return (
    <div
      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-600`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div
        className={`w-3 h-3 rounded-full flex-shrink-0 ${getColorClass(color)}`}
      />
      <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
        {label}
      </span>
    </div>
  );
};

export default ProgressItem;
