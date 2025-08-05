import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

interface Tab {
  key: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  variant = 'default',
  size = 'md'
}) => {
  const getTabClasses = (tab: Tab, isActive: boolean) => {
    const baseClasses = 'flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 font-medium';
    
    const sizeClasses = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3'
    };

    const variantClasses = {
      default: cn(
        baseClasses,
        isActive
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
        tab.disabled && 'opacity-50 cursor-not-allowed'
      ),
      pills: cn(
        baseClasses,
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
        tab.disabled && 'opacity-50 cursor-not-allowed'
      ),
      underline: cn(
        'flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors duration-200 font-medium',
        isActive
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300',
        tab.disabled && 'opacity-50 cursor-not-allowed'
      )
    };

    return cn(
      sizeClasses[size],
      variantClasses[variant]
    );
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        
        return (
          <button
            key={tab.key}
            onClick={() => !tab.disabled && onTabChange(tab.key)}
            className={getTabClasses(tab, isActive)}
            disabled={tab.disabled}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={cn(
                'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full',
                isActive
                  ? variant === 'pills' ? 'bg-blue-100 text-blue-700' : 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs; 