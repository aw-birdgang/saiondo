import { UserPermissionService } from '../services/UserPermissionService';
import type {
  Permission,
  Role,
  UserRole,
  CheckPermissionRequest,
  CheckPermissionResponse,
  AssignRoleRequest,
  AssignRoleResponse
} from '../dto/UserPermissionDto';

export class UserPermissionUseCase {
  constructor(private readonly userPermissionService: UserPermissionService) {}

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