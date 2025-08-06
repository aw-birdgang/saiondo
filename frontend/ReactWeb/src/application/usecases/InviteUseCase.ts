import type { IInviteUseCase } from './interfaces/IInviteUseCase';
import type { Invite, InviteStats } from '@/domain/types/invite';

export class InviteUseCase implements IInviteUseCase {
  async createInvite(invite: Invite): Promise<Invite> {
    // 구현 예정
    throw new Error('Method not implemented.');
  }

  async getInvitesByUserId(userId: string): Promise<Invite[]> {
    // 구현 예정
    throw new Error('Method not implemented.');
  }

  async getInviteById(id: string): Promise<Invite | null> {
    // 구현 예정
    throw new Error('Method not implemented.');
  }

  async updateInvite(id: string, updates: Partial<Invite>): Promise<Invite> {
    // 구현 예정
    throw new Error('Method not implemented.');
  }

  async deleteInvite(id: string): Promise<boolean> {
    // 구현 예정
    throw new Error('Method not implemented.');
  }

  async getInviteStats(userId: string): Promise<InviteStats> {
    // 구현 예정
    throw new Error('Method not implemented.');
  }

  validateInvite(invite: Invite): boolean {
    // 구현 예정
    return invite.userId && invite.channelId ? true : false;
  }
} 