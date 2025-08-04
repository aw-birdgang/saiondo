import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MOCK_USER_PROFILE, PROFILE_SAVE_TIME, PROFILE_LOAD_TIME, PROFILE_COMPLETION_CRITERIA } from '../constants/profileData';
import type { UserProfile, ProfileState } from '../types/profileTypes';

export const useProfileData = () => {
  const [state, setState] = useState<ProfileState>({
    isLoading: false,
    isEditing: false,
    isSaving: false,
    error: null,
    profile: null,
    hasUnsavedChanges: false
  });

  // 프로필 완성도 계산
  const calculateProfileCompletion = useCallback((profile: UserProfile): number => {
    let totalScore = 0;
    let maxScore = 0;

    PROFILE_COMPLETION_CRITERIA.forEach(criteria => {
      maxScore += criteria.weight;
      
      const fieldValue = profile[criteria.field as keyof UserProfile];
      if (fieldValue && String(fieldValue).trim() !== '') {
        totalScore += criteria.weight;
      }
    });

    return Math.round((totalScore / maxScore) * 100);
  }, []);

  // 프로필 로딩
  const loadProfile = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: Implement actual API call
      // const response = await profileService.getUserProfile();
      // return response.data;

      // Mock 데이터 로딩 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, PROFILE_LOAD_TIME));
      
      setState(prev => ({
        ...prev,
        profile: MOCK_USER_PROFILE,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to load profile:', error);
      setState(prev => ({
        ...prev,
        error: '프로필을 불러오는데 실패했습니다.',
        isLoading: false
      }));
      toast.error('프로필을 불러오는데 실패했습니다.');
    }
  }, []);

  // 프로필 저장
  const saveProfile = useCallback(async (profile: UserProfile) => {
    setState(prev => ({ ...prev, isSaving: true, error: null }));
    
    try {
      // TODO: Implement actual API call
      // await profileService.updateUserProfile(profile);
      
      // Mock 프로필 저장 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, PROFILE_SAVE_TIME));
      
      const updatedProfile = {
        ...profile,
        updatedAt: new Date()
      };
      
      setState(prev => ({
        ...prev,
        profile: updatedProfile,
        isSaving: false,
        hasUnsavedChanges: false,
        isEditing: false
      }));
      
      toast.success('프로필이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save profile:', error);
      setState(prev => ({
        ...prev,
        error: '프로필 저장에 실패했습니다.',
        isSaving: false
      }));
      toast.error('프로필 저장에 실패했습니다.');
    }
  }, []);

  // 프로필 필드 변경
  const updateProfileField = useCallback((field: string, value: any) => {
    if (!state.profile) return;

    setState(prev => {
      const updatedProfile = {
        ...prev.profile!,
        [field]: value
      };
      
      return {
        ...prev,
        profile: updatedProfile,
        hasUnsavedChanges: true
      };
    });
  }, [state.profile]);

  // 소셜 링크 변경
  const updateSocialLink = useCallback((platform: string, value: string) => {
    if (!state.profile) return;

    setState(prev => {
      const updatedProfile = {
        ...prev.profile!,
        socialLinks: {
          ...prev.profile!.socialLinks,
          [platform]: value
        }
      };
      
      return {
        ...prev,
        profile: updatedProfile,
        hasUnsavedChanges: true
      };
    });
  }, [state.profile]);

  // 선호도 변경
  const updatePreference = useCallback((key: string, value: any) => {
    if (!state.profile) return;

    setState(prev => {
      const updatedProfile = {
        ...prev.profile!,
        preferences: {
          ...prev.profile!.preferences,
          [key]: value
        }
      };
      
      return {
        ...prev,
        profile: updatedProfile,
        hasUnsavedChanges: true
      };
    });
  }, [state.profile]);

  // 아바타 변경
  const updateAvatar = useCallback(async (file: File) => {
    if (!state.profile) return;

    try {
      // TODO: Implement actual file upload
      // const uploadedUrl = await uploadService.uploadAvatar(file);
      
      // Mock 파일 업로드 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUrl = URL.createObjectURL(file);
      
      setState(prev => {
        const updatedProfile = {
          ...prev.profile!,
          profileUrl: mockUrl
        };
        
        return {
          ...prev,
          profile: updatedProfile,
          hasUnsavedChanges: true
        };
      });
      
      toast.success('프로필 사진이 업로드되었습니다.');
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast.error('프로필 사진 업로드에 실패했습니다.');
    }
  }, [state.profile]);

  // 편집 모드 전환
  const handleEdit = useCallback(() => {
    setState(prev => ({ ...prev, isEditing: true }));
  }, []);

  // 편집 취소
  const handleCancel = useCallback(() => {
    setState(prev => ({
      ...prev,
      isEditing: false,
      hasUnsavedChanges: false,
      profile: MOCK_USER_PROFILE // 원래 데이터로 복원
    }));
    toast.success('편집이 취소되었습니다.');
  }, []);

  // 프로필 저장 처리
  const handleSave = useCallback(async () => {
    if (!state.profile) return;
    await saveProfile(state.profile);
  }, [state.profile, saveProfile]);

  // 초기 로딩
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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
    profile: state.profile,
    isLoading: state.isLoading,
    isEditing: state.isEditing,
    isSaving: state.isSaving,
    error: state.error,
    hasUnsavedChanges: state.hasUnsavedChanges,
    profileCompletion: state.profile ? calculateProfileCompletion(state.profile) : 0,

    // 액션
    updateProfileField,
    updateSocialLink,
    updatePreference,
    updateAvatar,
    handleEdit,
    handleCancel,
    handleSave,
    loadProfile
  };
}; 