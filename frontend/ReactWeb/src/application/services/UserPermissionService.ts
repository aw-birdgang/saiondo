import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  Permission,
  Role,
  UserRole,
  CheckPermissionRequest,
  CheckPermissionResponse,
  AssignRoleRequest,
  AssignRoleResponse
} from '../dto/UserPermissionDto';

export class UserPermissionService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository
  ) {}

  async checkPermission(request: CheckPermissionRequest): Promise<CheckPermissionResponse> {
    // Validate request
    if (!request.userId || request.userId.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('User ID is required');
    }

    if (!request.resource || request.resource.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('Resource is required');
    }

    if (!request.action || request.action.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('Action is required');
    }

    // Check if user exists
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw DomainErrorFactory.createUserNotFound(request.userId);
    }

    // Get user roles and permissions
    const userRoles = await this.getUserRoles(request.userId);
    const permissions = await this.getUserPermissions(request.userId);

    // Check if user has the required permission
    const hasPermission = this.hasPermission(permissions, request.resource, request.action);

    // Check context-specific permissions
    const contextPermission = await this.checkContextPermission(
      request.userId,
      request.resource,
      request.action,
      request.context
    );

    return {
      hasPermission: hasPermission && contextPermission,
      role: userRoles.length > 0 ? userRoles[0].name : undefined,
      reason: hasPermission && contextPermission ? undefined : 'Insufficient permissions',
    };
  }

  async assignRole(request: AssignRoleRequest): Promise<AssignRoleResponse> {
    // Validate request
    if (!request.userId || request.userId.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('User ID is required');
    }

    if (!request.roleId || request.roleId.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('Role ID is required');
    }

    if (!request.assignedBy || request.assignedBy.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('Assigned by user ID is required');
    }

    // Check if user exists
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw DomainErrorFactory.createUserNotFound(request.userId);
    }

    // Check if assigner has permission to assign roles
    const assignerPermission = await this.checkPermission({
      userId: request.assignedBy,
      resource: 'user',
      action: 'assign_role',
    });

    if (!assignerPermission.hasPermission) {
      throw DomainErrorFactory.createUserValidation('Insufficient permissions to assign roles');
    }

    // Check if role exists
    const role = await this.getRole(request.roleId);
    if (!role) {
      throw DomainErrorFactory.createUserValidation('Role not found');
    }

    // Create user role
    const userRole: UserRole = {
      userId: request.userId,
      roleId: request.roleId,
      assignedBy: request.assignedBy,
      assignedAt: new Date(),
    };

    // Save user role
    await this.saveUserRole(userRole);

    return {
      success: true,
      userRole,
    };
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const userRoles = await this.getUserRoles(userId);
    const permissions: Permission[] = [];

    for (const userRole of userRoles) {
      const rolePermissions = await this.getRolePermissions(userRole.id);
      permissions.push(...rolePermissions);
    }

    // Remove duplicates
    return permissions.filter((permission, index, self) =>
      index === self.findIndex(p => p.id === permission.id)
    );
  }

  async canManageChannel(userId: string, channelId: string): Promise<boolean> {
    try {
      // Check if user is channel owner
      const channel = await this.channelRepository.findById(channelId);
      if (channel && channel.ownerId === userId) {
        return true;
      }

      // Check if user has admin role
      const adminPermission = await this.checkPermission({
        userId,
        resource: 'channel',
        action: 'manage',
      });

      return adminPermission.hasPermission;
    } catch (error) {
      return false;
    }
  }

  async canDeleteMessage(userId: string, messageId: string, channelId: string): Promise<boolean> {
    try {
      // Check if user is message sender
      // In real implementation, you would get the message and check sender
      const isMessageSender = true; // Placeholder

      if (isMessageSender) {
        return true;
      }

      // Check if user can manage channel
      const canManage = await this.canManageChannel(userId, channelId);
      if (canManage) {
        return true;
      }

      // Check if user has message moderation permission
      const moderationPermission = await this.checkPermission({
        userId,
        resource: 'message',
        action: 'delete',
      });

      return moderationPermission.hasPermission;
    } catch (error) {
      return false;
    }
  }

  private async getUserRoles(userId: string): Promise<Role[]> {
    // In real implementation, this would query the database
    // For now, return mock data
    const mockRoles: Role[] = [
      {
        id: 'role_user',
        name: 'user',
        description: 'Regular user',
        permissions: [
          { id: 'perm_read_channel', name: 'read_channel', description: 'Read channel', resource: 'channel', action: 'read' },
          { id: 'perm_send_message', name: 'send_message', description: 'Send message', resource: 'message', action: 'send' },
          { id: 'perm_upload_file', name: 'upload_file', description: 'Upload file', resource: 'file', action: 'upload' }
        ],
      },
      {
        id: 'role_moderator',
        name: 'moderator',
        description: 'Channel moderator',
        permissions: [
          { id: 'perm_read_channel', name: 'read_channel', description: 'Read channel', resource: 'channel', action: 'read' },
          { id: 'perm_send_message', name: 'send_message', description: 'Send message', resource: 'message', action: 'send' },
          { id: 'perm_upload_file', name: 'upload_file', description: 'Upload file', resource: 'file', action: 'upload' },
          { id: 'perm_delete_message', name: 'delete_message', description: 'Delete message', resource: 'message', action: 'delete' },
          { id: 'perm_manage_channel', name: 'manage_channel', description: 'Manage channel', resource: 'channel', action: 'manage' }
        ],
      },
      {
        id: 'role_admin',
        name: 'admin',
        description: 'System administrator',
        permissions: [
          { id: 'perm_all', name: '*', description: 'All permissions', resource: '*', action: '*' }
        ],
      },
    ];

    // Mock user roles - in real implementation, this would be from database
    const userRoleIds = ['role_user']; // Default role for all users
    
    return mockRoles.filter(role => userRoleIds.includes(role.id));
  }

  private async getRole(roleId: string): Promise<Role | null> {
    const roles = await this.getAvailableRoles();
    return roles.find(role => role.id === roleId) || null;
  }

  private async getRolePermissions(roleId: string): Promise<Permission[]> {
    const role = await this.getRole(roleId);
    if (!role) return [];

    // Return role permissions directly since they're already Permission objects
    return role.permissions;
  }

  private async getAvailableRoles(): Promise<Role[]> {
    return [
      {
        id: 'role_user',
        name: 'user',
        description: 'Regular user',
        permissions: [
          { id: 'perm_read_channel', name: 'read_channel', description: 'Read channel', resource: 'channel', action: 'read' },
          { id: 'perm_send_message', name: 'send_message', description: 'Send message', resource: 'message', action: 'send' },
          { id: 'perm_upload_file', name: 'upload_file', description: 'Upload file', resource: 'file', action: 'upload' }
        ],
      },
      {
        id: 'role_moderator',
        name: 'moderator',
        description: 'Channel moderator',
        permissions: [
          { id: 'perm_read_channel', name: 'read_channel', description: 'Read channel', resource: 'channel', action: 'read' },
          { id: 'perm_send_message', name: 'send_message', description: 'Send message', resource: 'message', action: 'send' },
          { id: 'perm_upload_file', name: 'upload_file', description: 'Upload file', resource: 'file', action: 'upload' },
          { id: 'perm_delete_message', name: 'delete_message', description: 'Delete message', resource: 'message', action: 'delete' },
          { id: 'perm_manage_channel', name: 'manage_channel', description: 'Manage channel', resource: 'channel', action: 'manage' }
        ],
      },
      {
        id: 'role_admin',
        name: 'admin',
        description: 'System administrator',
        permissions: [
          { id: 'perm_all', name: '*', description: 'All permissions', resource: '*', action: '*' }
        ],
      },
    ];
  }

  private hasPermission(permissions: Permission[], resource: string, action: string): boolean {
    return permissions.some(permission => {
      // Check for wildcard permission
      if (permission.name === '*') return true;
      
      // Check for specific permission
      if (permission.name === `${action}_${resource}`) return true;
      
      // Check for resource-level permission
      if (permission.name === `manage_${resource}`) return true;
      
      return false;
    });
  }

  private async checkContextPermission(
    userId: string,
    resource: string,
    action: string,
    context?: Record<string, unknown>
  ): Promise<boolean> {
    // Context-specific permission checks
    if (resource === 'channel' && context?.channelId) {
      const channelId = context.channelId as string;
      return await this.canManageChannel(userId, channelId);
    }

    if (resource === 'message' && context?.messageId && context?.channelId) {
      const messageId = context.messageId as string;
      const channelId = context.channelId as string;
      return await this.canDeleteMessage(userId, messageId, channelId);
    }

    return true; // Default to true if no context-specific checks
  }

  private async saveUserRole(userRole: UserRole): Promise<void> {
    // In real implementation, this would save to database
    // console.log('Saving user role:', userRole);
  }

  private generateUserRoleId(): string {
    return `user_role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 