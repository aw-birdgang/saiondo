import React from 'react';
import { cn } from '@/utils/cn';
import { SETTINGS_SECTIONS } from '@/presentation/pages/settings/constants/settingsData';
import type { SettingsSidebarProps } from '@/presentation/pages/settings/types/settingsTypes';

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSectionChange,
  className,
}) => {
  return (
    <div className={cn('w-64 bg-surface border-r border-border', className)}>
      <div className='p-4'>
        <h2 className='text-lg font-semibold text-txt mb-4'>설정 메뉴</h2>
        <nav className='space-y-1'>
          {SETTINGS_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
                'hover:bg-focus',
                activeSection === section.id
                  ? 'bg-primary text-white'
                  : 'text-txt hover:text-txt'
              )}
            >
              <span className='text-lg'>{section.icon}</span>
              <div>
                <div className='font-medium'>{section.title}</div>
                <div
                  className={cn(
                    'text-xs',
                    activeSection === section.id
                      ? 'text-white/80'
                      : 'text-txt-secondary'
                  )}
                >
                  {section.description}
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SettingsSidebar;
