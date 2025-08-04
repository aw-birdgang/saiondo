import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MOCK_USER_SETTINGS, SETTINGS_SAVE_TIME, SETTINGS_LOAD_TIME } from '../constants/settingsData';
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
      // TODO: Implement actual API call
      // const response = await settingsService.getUserSettings();
      // return response.data;

      // Mock 데이터 로딩 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, SETTINGS_LOAD_TIME));
      
      setState(prev => ({
        ...prev,
        settings: MOCK_USER_SETTINGS,
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
      // TODO: Implement actual API call
      // await settingsService.updateUserSettings(settings);
      
      // Mock 설정 저장 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, SETTINGS_SAVE_TIME));
      
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
  const resetSettings = useCallback(() => {
    setState(prev => ({
      ...prev,
      settings: MOCK_USER_SETTINGS,
      hasUnsavedChanges: false
    }));
    toast.success('설정이 초기화되었습니다.');
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