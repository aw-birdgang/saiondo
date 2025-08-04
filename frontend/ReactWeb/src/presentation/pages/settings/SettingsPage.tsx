import React, { useState } from 'react';
import { LoadingSpinner } from '../../components/common';
import { ErrorState } from '../../components/specific';
import {
  SettingsHeader,
  SettingsSidebar,
  SettingsContent,
  SettingsContainer
} from '../../components/specific/settings';
import { useSettingsData } from './hooks/useSettingsData';

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  
  const {
    // 상태
    settings,
    isLoading,
    isSaving,
    error,
    hasUnsavedChanges,

    // 액션
    updateSetting,
    handleSave,
    handleReset,
    loadSettings
  } = useSettingsData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        title="설정 로드 실패"
        message={error}
        onRetry={loadSettings}
      />
    );
  }

  return (
    <SettingsContainer>
      {/* 헤더 */}
      <div className="w-full flex flex-col">
        <SettingsHeader
          onSave={handleSave}
          onReset={handleReset}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        
        {/* 메인 콘텐츠 */}
        <div className="flex flex-1">
          <SettingsSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <SettingsContent
            activeSection={activeSection}
            settings={settings}
            onSettingChange={updateSetting}
          />
        </div>
      </div>
    </SettingsContainer>
  );
};

export default SettingsPage; 