import React from 'react';

export interface SettingsOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface SettingsCardProps {
  option: SettingsOption;
  onClick: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ option, onClick }) => (
  <button
    onClick={onClick}
    className={`group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-left`}
  >
    {/* 배경 그라데이션 */}
    <div className={`absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${option.bgColor}`} />
    
    <div className="relative p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xl shadow-lg transition-all duration-200 group-hover:scale-110 ${option.color}`}>
          {option.icon}
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {option.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {option.description}
          </p>
        </div>
        
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-xs">→</span>
          </div>
        </div>
      </div>
    </div>
  </button>
);

export default SettingsCard; 