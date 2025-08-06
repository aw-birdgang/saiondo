import type { IInviteRepository } from '@/application/usecases/interfaces/IInviteRepository';
import type { IInviteUseCase } from '@/application/usecases/interfaces/IInviteUseCase';
import type { ICache } from '@/application/usecases/interfaces/ICache';
import { InviteUseCase } from '@/application/usecases/InviteUseCase';

// 의존성 주입을 위한 팩토리 함수
export const createInviteUseCase = (
  repository: IInviteRepository,
  cache?: ICache
): IInviteUseCase => {
  // InviteService가 삭제되었으므로 직접 repository를 사용
  const mockService: any = {
    sendInvitation: repository.sendInvitation,
    getInvitations: repository.getInvitations,
    respondToInvitation: repository.respondToInvitation,
    getInvitationStats: repository.getInvitationStats,
    cancelInvitation: repository.cancelInvitation,
    validateInviteRequest: () => [],
    validateEmail: () => true,
    formatInvitationMessage: (email: string, message?: string) => message || `Invitation for ${email}`,
  };
  return new InviteUseCase(mockService);
};

// 테스트를 위한 Mock 팩토리
export const createMockInviteUseCase = (): IInviteUseCase => {
  const mockRepository: IInviteRepository = {
    sendInvitation: async () => ({ success: false, message: 'Mock response' }),
    getInvitations: async () => [],
    respondToInvitation: async () => ({
      success: false,
      message: 'Mock response',
    }),
    getInvitationStats: async () => ({
      totalInvitations: 0,
      pendingInvitations: 0,
      acceptedInvitations: 0,
      rejectedInvitations: 0,
      totalSent: 0,
      accepted: 0,
      todaySent: 0,
    }),
    cancelInvitation: async () => false,
  };

  return createInviteUseCase(mockRepository);
};
