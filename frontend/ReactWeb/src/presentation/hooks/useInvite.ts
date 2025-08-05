import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/app';
import { useToastContext } from '../providers/ToastProvider';
import type { 
  InviteState, 
  InviteRequest,
  InvitationResponseRequest,
  InviteStats
} from '../../domain/types/invite';
import type { IInviteUseCase } from '../../application/usecases/interfaces/IInviteUseCase';

export const useInvite = (inviteUseCase: IInviteUseCase, userId?: string) => {
  const navigate = useNavigate();
  const toast = useToastContext();

  const [state, setState] = useState<InviteState>({
    isLoading: false,
    isInviting: false,
    error: null,
    partnerEmail: '',
    invitations: [],
    currentInvitation: null
  });

  // 초대 통계 계산
  const inviteStats = useMemo((): InviteStats => {
    const stats: InviteStats = {
      totalInvitations: state.invitations.length,
      pendingInvitations: state.invitations.filter(inv => inv.status === 'pending').length,
      acceptedInvitations: state.invitations.filter(inv => inv.status === 'accepted').length,
      rejectedInvitations: state.invitations.filter(inv => inv.status === 'rejected').length,
      totalSent: state.invitations.length,
      accepted: state.invitations.filter(inv => inv.status === 'accepted').length,
      todaySent: state.invitations.filter(inv => {
        const today = new Date();
        const inviteDate = new Date(inv.createdAt);
        return inviteDate.toDateString() === today.toDateString();
      }).length,
    };
    return stats;
  }, [state.invitations]);

  // 파트너 이메일 업데이트
  const updatePartnerEmail = useCallback((email: string) => {
    setState(prev => ({
      ...prev,
      partnerEmail: email,
      error: null
    }));
  }, []);

  // 초대 발송
  const sendInvitation = useCallback(async (email: string, message?: string) => {
    if (!userId) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (!email.trim()) {
      toast.error('파트너의 이메일 주소를 입력해주세요.');
      return;
    }

    setState(prev => ({
      ...prev,
      isInviting: true,
      error: null
    }));

    try {
      const request: InviteRequest = {
        senderId: userId,
        partnerEmail: email.trim(),
        message
      };

      const response = await inviteUseCase.sendInvitation(request);

      if (response.success) {
        toast.success(response.message);
        setState(prev => ({
          ...prev,
          partnerEmail: '',
          isInviting: false
        }));
        
        // 홈으로 이동
        setTimeout(() => {
          navigate(ROUTES.HOME);
        }, 1500);
      } else {
        setState(prev => ({
          ...prev,
          error: response.message,
          isInviting: false
        }));
        toast.error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '초대 발송에 실패했습니다.';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isInviting: false
      }));
      toast.error(errorMessage);
    }
  }, [userId, inviteUseCase, toast, navigate]);

  // 초대장 목록 로드
  const loadInvitations = useCallback(async () => {
    if (!userId) {
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const invitations = await inviteUseCase.getInvitations(userId);
      setState(prev => ({
        ...prev,
        invitations,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '초대장을 불러오는데 실패했습니다.';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      toast.error(errorMessage);
    }
  }, [userId, inviteUseCase, toast]);

  // 초대 응답
  const respondToInvitation = useCallback(async (invitationId: string, accepted: boolean) => {
    try {
      const request: InvitationResponseRequest = {
        invitationId,
        accepted
      };

      const response = await inviteUseCase.respondToInvitation(request);

      if (response.success) {
        toast.success(response.message);
        
        // 초대장 목록 새로고침
        await loadInvitations();

        if (accepted) {
          // 채널로 이동
          setTimeout(() => {
            navigate(ROUTES.CHANNELS);
          }, 1000);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '초대 응답에 실패했습니다.';
      toast.error(errorMessage);
    }
  }, [inviteUseCase, loadInvitations, toast, navigate]);

  // 초대 취소
  const cancelInvitation = useCallback(async (invitationId: string) => {
    try {
      const success = await inviteUseCase.cancelInvitation(invitationId);
      
      if (success) {
        toast.success('초대가 취소되었습니다.');
        // 초대장 목록 새로고침
        await loadInvitations();
      } else {
        toast.error('초대 취소에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '초대 취소에 실패했습니다.';
      toast.error(errorMessage);
    }
  }, [inviteUseCase, loadInvitations, toast]);

  // 초대 통계 로드
  const loadInviteStats = useCallback(async () => {
    if (!userId) {
      return null;
    }

    try {
      return await inviteUseCase.getInvitationStats(userId);
    } catch (error) {
      console.error('Failed to load invite stats:', error);
      return null;
    }
  }, [userId, inviteUseCase]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  // 상태 초기화
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isInviting: false,
      error: null,
      partnerEmail: '',
      invitations: [],
      currentInvitation: null
    });
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (userId) {
      loadInvitations();
    }
  }, [userId, loadInvitations]);

  return {
    // State
    state,
    inviteStats,
    
    // Actions
    updatePartnerEmail,
    sendInvitation,
    loadInvitations,
    respondToInvitation,
    cancelInvitation,
    loadInviteStats,
    clearError,
    reset
  };
}; 