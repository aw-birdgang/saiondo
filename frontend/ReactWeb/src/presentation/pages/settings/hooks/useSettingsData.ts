import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { settingsService } from '../../../../infrastructure/api/services';
import type { UserSettings, SettingsState } from '../types/settingsTypes';

// 자동 저장 지연 시간 (ms)
const AUTO_SAVE_DELAY = 2000;

export const useSettingsData = () => {
  const [state, setState] = useState<SettingsState>({
    isLoading: false,
    isSaving: false,
    error: null,
    settings: null,
    hasUnsavedChanges: false
  });

  // 자동 저장 타이머 ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 설정 로딩 (로컬 캐시에서 즉시 로드)
  const loadSettings = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // 로컬 캐시에서 동기적으로 로드
      const settings = settingsService.getSettingsSync();
      
      setState(prev => ({
        ...prev,
        settings,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to load settings:', error);
      setState(prev => ({
        ...prev,
        error: '설정을 불러오는데 실패했습니다.',
        isLoading: false
      }));
      toast.error('설정을 불러오는데 실패했습니다.');
    }
  }, []);

  // 설정 저장 (로컬 캐시에 즉시 저장)
  const saveSettings = useCallback(async (settings: UserSettings) => {
    setState(prev => ({ ...prev, isSaving: true, error: null }));
    
    try {
      // 로컬 캐시에 동기적으로 저장
      settingsService.saveSettingsSync(settings);
      
      setState(prev => ({
        ...prev,
        settings,
        isSaving: false,
        hasUnsavedChanges: false
      }));
      
      toast.success('설정이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save settings:', error);
      setState(prev => ({
        ...prev,
        error: '설정 저장에 실패했습니다.',
        isSaving: false
      }));
      toast.error('설정 저장에 실패했습니다.');
    }
  }, []);

  // 자동 저장 스케줄링
  const scheduleAutoSave = useCallback((settings: UserSettings) => {
    // 기존 타이머 취소
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // 새로운 자동 저장 타이머 설정
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        settingsService.saveSettingsSync(settings);
        setState(prev => ({
          ...prev,
          hasUnsavedChanges: false
        }));
        console.log('Settings auto-saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, AUTO_SAVE_DELAY);
  }, []);

  // 설정 변경
  const updateSetting = useCallback((key: string, value: any) => {
    if (!state.settings) return;

    setState(prev => {
      const newSettings = { ...prev.settings! };
      
      // 중첩된 객체 키 처리 (예: 'notifications.pushEnabled')
      const keys = key.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      // 자동 저장 스케줄링
      scheduleAutoSave(newSettings);
      
      return {
        ...prev,
        settings: newSettings,
        hasUnsavedChanges: true
      };
    });
  }, [state.settings, scheduleAutoSave]);

  // 설정 초기화
  const resetSettings = useCallback(async () => {
    try {
      const defaultSettings = await settingsService.resetUserSettings();
      
      setState(prev => ({
        ...prev,
        settings: defaultSettings,
        hasUnsavedChanges: false
      }));
      
      toast.success('설정이 초기화되었습니다.');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      toast.error('설정 초기화에 실패했습니다.');
    }
  }, []);

  // 설정 백업 (JSON 파일로 내보내기)
  const exportSettings = useCallback(() => {
    try {
      const jsonString = settingsService.exportSettings();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `saiondo-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('설정이 내보내기되었습니다.');
    } catch (error) {
      console.error('Failed to export settings:', error);
      toast.error('설정 내보내기에 실패했습니다.');
    }
  }, []);

  // 설정 복원 (JSON 파일에서 가져오기)
  const importSettings = useCallback((file: File) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const jsonString = e.target?.result as string;
        const importedSettings = settingsService.importSettings(jsonString);
        
        setState(prev => ({
          ...prev,
          settings: importedSettings,
          hasUnsavedChanges: false
        }));
        
        toast.success('설정이 가져와졌습니다.');
      } catch (error) {
        console.error('Failed to import settings:', error);
        toast.error('설정 가져오기에 실패했습니다.');
      }
    };
    
    reader.readAsText(file);
  }, []);

  // 설정 저장 처리 (수동 저장)
  const handleSave = useCallback(async () => {
    if (!state.settings) return;
    
    // 자동 저장 타이머 취소
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    
    await saveSettings(state.settings);
  }, [state.settings, saveSettings]);

  // 설정 초기화 처리
  const handleReset = useCallback(() => {
    resetSettings();
  }, [resetSettings]);

  // 초기 로딩 (컴포넌트 마운트 시)
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // 설정 변경 리스너 등록 (다른 탭에서의 변경 감지)
  useEffect(() => {
    const unsubscribe = settingsService.onSettingsChange((newSettings) => {
      setState(prev => ({
        ...prev,
        settings: newSettings,
        hasUnsavedChanges: false
      }));
    });

    return unsubscribe;
  }, []);

  // 변경사항이 있을 때 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.hasUnsavedChanges]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return {
    // 상태
    settings: state.settings,
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    error: state.error,
    hasUnsavedChanges: state.hasUnsavedChanges,

    // 액션
    updateSetting,
    handleSave,
    handleReset,
    loadSettings,
    exportSettings,
    importSettings
  };
}; 