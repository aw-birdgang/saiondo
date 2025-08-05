import { UserPermissionService } from '../services/UserPermissionService';
import type {
  Permission,
  CheckPermissionRequest,
  CheckPermissionResponse,
  AssignRoleRequest,
  AssignRoleResponse
} from '../dto/UserPermissionDto';
import type { IUseCase } from './interfaces/IUseCase';

export class UserPermissionUseCase implements IUseCase<CheckPermissionRequest, CheckPermissionResponse> {
  constructor(private readonly userPermissionService: UserPermissionService) {}

  async execute(request: CheckPermissionRequest): Promise<CheckPermissionResponse> {
    return this.checkPermission(request);
  }

  async checkPermission(request: CheckPermissionRequest): Promise<CheckPermissionResponse> {
    return await this.userPermissionService.checkPermission(request);
  }

  async assignRole(request: AssignRoleRequest): Promise<AssignRoleResponse> {
    return await this.userPermissionService.assignRole(request);
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    return await this.userPermissionService.getUserPermissions(userId);
  }

  async canManageChannel(userId: string, channelId: string): Promise<boolean> {
    return await this.userPermissionService.canManageChannel(userId, channelId);
  }

  async canDeleteMessage(userId: string, messageId: string, channelId: string): Promise<boolean> {
    return await this.userPermissionService.canDeleteMessage(userId, messageId, channelId);
  }
}