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
          container: 'flex space-x-1 bg-secondary p-1 rounded-lg',
          tab: 'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
          active: 'bg-surface text-primary shadow-sm',
          inactive: 'text-txt-secondary hover:text-txt hover:bg-secondary/50',
          disabled: 'text-txt-secondary/50 cursor-not-allowed'
        };
      case 'underline':
        return {
          container: 'border-b border-border',
          tab: 'px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200',
          active: 'border-primary text-primary',
          inactive: 'border-transparent text-txt-secondary hover:text-txt hover:border-border',
          disabled: 'text-txt-secondary/50 cursor-not-allowed border-transparent'
        };
      default:
        return {
          container: 'flex space-x-8',
          tab: 'px-1 py-3 text-sm font-medium border-b-2 transition-all duration-200',
          active: 'border-primary text-primary',
          inactive: 'border-transparent text-txt-secondary hover:text-txt hover:border-border',
          disabled: 'text-txt-secondary/50 cursor-not-allowed border-transparent'
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
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              <span>{tab.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs; 