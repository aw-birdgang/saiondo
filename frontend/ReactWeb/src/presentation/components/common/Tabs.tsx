import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'pills':
        return {
          container: 'flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
          tab: 'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
          active: 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm',
          inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
          disabled: 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
        };
      case 'underline':
        return {
          container: 'border-b border-gray-200 dark:border-gray-700',
          tab: 'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
          active: 'border-blue-500 text-blue-600 dark:text-blue-400',
          inactive: 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600',
          disabled: 'text-gray-400 dark:text-gray-600 cursor-not-allowed border-transparent'
        };
      default:
        return {
          container: 'flex space-x-8',
          tab: 'px-1 py-2 text-sm font-medium border-b-2 transition-colors',
          active: 'border-blue-500 text-blue-600 dark:text-blue-400',
          inactive: 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600',
          disabled: 'text-gray-400 dark:text-gray-600 cursor-not-allowed border-transparent'
        };
    }
  };

  const classes = getVariantClasses();

  return (
    <div className={`${classes.container} ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isDisabled = tab.disabled;
        
        return (
          <button
            key={tab.id}
            onClick={() => !isDisabled && onTabChange(tab.id)}
            disabled={isDisabled}
            className={`
              ${classes.tab}
              ${isActive ? classes.active : ''}
              ${!isActive && !isDisabled ? classes.inactive : ''}
              ${isDisabled ? classes.disabled : ''}
            `}
          >
            <div className="flex items-center space-x-2">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs; 