import React from 'react';

interface ActionCardProps {
  action: {
    id: string;
    title: string;
    description?: string;
    icon: string;
  };
  index: number;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ action, index, onClick }) => {
  const getActionColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600'
    ];
    return colors[index % colors.length];
  };

  const getActionBgColor = (index: number) => {
    const colors = [
      'bg-blue-50 dark:bg-blue-900/10',
      'bg-green-50 dark:bg-green-900/10',
      'bg-purple-50 dark:bg-purple-900/10',
      'bg-orange-50 dark:bg-orange-900/10',
      'bg-pink-50 dark:bg-pink-900/10',
      'bg-indigo-50 dark:bg-indigo-900/10'
    ];
    return colors[index % colors.length];
  };

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
      aria-label={action.title}
    >
      {/* 배경 그라데이션 */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${getActionBgColor(index)}`} />
      
      <div className="relative p-6 text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-2xl shadow-lg transition-all duration-200 group-hover:scale-110 ${getActionColor(index)}`}>
          {action.icon}
        </div>
        
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {action.title}
        </h4>
        
        {action.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {action.description}
          </p>
        )}
        
        {/* 호버 시 표시될 화살표 */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-xs">→</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ActionCard; 