import type { IInviteRepository } from '../interfaces/IInviteRepository';
import type { IInviteUseCase } from '../interfaces/IInviteUseCase';
import type { ICache } from '../interfaces/ICache';
import { InviteService } from '../services/InviteService';
import { InviteUseCase } from '../InviteUseCase';

// 의존성 주입을 위한 팩토리 함수
export const createInviteUseCase = (
  repository: IInviteRepository, 
  cache?: ICache
): IInviteUseCase => {
  const service = new InviteService(repository, cache);
  return new InviteUseCase(service);
};

// 테스트를 위한 Mock 팩토리
export const createMockInviteUseCase = (): IInviteUseCase => {
  const mockRepository: IInviteRepository = {
    sendInvitation: async () => ({ success: false, message: 'Mock response' }),
    getInvitations: async () => [],
    respondToInvitation: async () => ({ success: false, message: 'Mock response' }),
    getInvitationStats: async () => ({ 
      totalInvitations: 0, 
      pendingInvitations: 0, 
      acceptedInvitations: 0, 
      rejectedInvitations: 0,
      totalSent: 0,
      accepted: 0,
      todaySent: 0
    }),
    cancelInvitation: async () => false,
  };
  
  return createInviteUseCase(mockRepository);
}; 