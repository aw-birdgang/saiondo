import type {
  ChannelInvitationItem,
  InviteRequest,
  InviteResponse,
  InvitationResponseRequest,
  InvitationResponseResponse,
  InviteValidationError,
  InviteStats,
} from '../../domain/types/invite';
import type { IInviteService } from './interfaces/IInviteService';
import type { IInviteUseCase } from './interfaces/IInviteUseCase';
import {
  createInviteUseCase,
  createMockInviteUseCase,
} from './factories/InviteUseCaseFactory';

// UseCase 구현체 - Service를 사용하여 애플리케이션 로직 조율
export class InviteUseCase implements IInviteUseCase {
  constructor(private inviteService: IInviteService) {}

  async sendInvitation(request: InviteRequest): Promise<InviteResponse> {
    return await this.inviteService.sendInvitation(request);
  }

  async getInvitations(userId: string): Promise<ChannelInvitationItem[]> {
    return await this.inviteService.getInvitations(userId);
  }

  async respondToInvitation(
    request: InvitationResponseRequest
  ): Promise<InvitationResponseResponse> {
    return await this.inviteService.respondToInvitation(request);
  }

  async getInvitationStats(userId: string): Promise<InviteStats> {
    return await this.inviteService.getInvitationStats(userId);
  }

  async cancelInvitation(invitationId: string): Promise<boolean> {
    return await this.inviteService.cancelInvitation(invitationId);
  }

  validateInviteRequest(request: InviteRequest): InviteValidationError[] {
    return this.inviteService.validateInviteRequest(request);
  }

  validateEmail(email: string): boolean {
    return this.inviteService.validateEmail(email);
  }

  formatInvitationMessage(email: string, message?: string): string {
    return this.inviteService.formatInvitationMessage(email, message);
  }
}

// Re-export factories for backward compatibility
export { createInviteUseCase, createMockInviteUseCase };
