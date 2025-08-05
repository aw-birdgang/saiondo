import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { settingsService } from '../../../../infrastructure/api/services';
import type { UserSettings, SettingsState } from '../types/settingsTypes';

export const useSettingsData = () => {
  const [state, setState] = useState<SettingsState>({
    isLoading: false,
    isSaving: false,
    error: null,
    settings: null,
    hasUnsavedChanges: false
  });

  // 설정 로딩
  const loadSettings = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const settings = await settingsService.getUserSettings();
      
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

  // 설정 저장
  const saveSettings = useCallback(async (settings: UserSettings) => {
    setState(prev => ({ ...prev, isSaving: true, error: null }));
    
    try {
      const updatedSettings = await settingsService.updateUserSettings(settings);
      
      setState(prev => ({
        ...prev,
        settings: updatedSettings,
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

  // 설정 변경
  const updateSetting = useCallback((key: string, value: any) => {
    if (!state.settings) return;

    setState(prev => {
      const newSettings = { ...prev.settings! };
      
      // 중첩된 객체 키 처리 (예: 'notifications.pushEnabled')
      const keys = key.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      return {
        ...prev,
        settings: newSettings,
        hasUnsavedChanges: true
      };
    });
  }, [state.settings]);

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

  // 설정 저장 처리
  const handleSave = useCallback(async () => {
    if (!state.settings) return;
    await saveSettings(state.settings);
  }, [state.settings, saveSettings]);

  // 설정 초기화 처리
  const handleReset = useCallback(() => {
    resetSettings();
  }, [resetSettings]);

  // 초기 로딩
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

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
    loadSettings
  };
}; 