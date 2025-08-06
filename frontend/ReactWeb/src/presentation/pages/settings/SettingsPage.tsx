import React, { useState, useRef } from 'react';
import { LoadingSpinner } from '@/presentation/components/common';
import { ErrorState } from '@/presentation/components';
import {
  SettingsHeader,
  SettingsSidebar,
  SettingsContent,
  SettingsContainer,
} from '@/presentation/components/settings';
import { useSettingsData } from '@/presentation/pages/settings/hooks/useSettingsData';

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    loadSettings,
    exportSettings,
    importSettings,
  } = useSettingsData();

  // 파일 업로드 처리
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importSettings(file);
      // 파일 입력 초기화
      event.target.value = '';
    }
  };

  // 파일 선택 다이얼로그 열기
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        title='설정 로드 실패'
        message={error}
        onRetry={loadSettings}
      />
    );
  }

  return (
    <SettingsContainer>
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type='file'
        accept='.json'
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* 헤더 */}
      <div className='w-full flex flex-col'>
        <SettingsHeader
          onSave={handleSave}
          onReset={handleReset}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        {/* 메인 콘텐츠 */}
        <div className='flex flex-1'>
          <SettingsSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <SettingsContent
            activeSection={activeSection}
            settings={settings}
            onSettingChange={updateSetting}
            onExportSettings={exportSettings}
            onImportSettings={handleImportClick}
          />
        </div>
      </div>
    </SettingsContainer>
  );
};

export default SettingsPage;
