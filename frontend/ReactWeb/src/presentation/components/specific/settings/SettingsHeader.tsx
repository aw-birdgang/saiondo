import React from 'react';
import { Button } from '../../common';
import { cn } from '../../../../utils/cn';
import type { SettingsHeaderProps } from '../../../pages/settings/types/settingsTypes';

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onSave,
  onReset,
  isSaving,
  hasUnsavedChanges,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 bg-surface border-b border-border',
        className
      )}
    >
      <div>
        <h1 className='text-2xl font-bold text-txt'>설정</h1>
        <p className='text-sm text-txt-secondary'>앱 설정을 관리하세요</p>
      </div>

      <div className='flex items-center space-x-2'>
        <Button variant='outline' onClick={onReset} disabled={isSaving}>
          초기화
        </Button>
        <Button
          variant='primary'
          onClick={onSave}
          disabled={isSaving || !hasUnsavedChanges}
          loading={isSaving}
          loadingText='저장 중...'
        >
          저장
        </Button>
      </div>
    </div>
  );
};

export default SettingsHeader;
