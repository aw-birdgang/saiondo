import type { IUserRepository } from '../repositories/IUserRepository';
import type { IChannelRepository } from '../repositories/IChannelRepository';
import { DomainErrorFactory } from '../errors/DomainError';

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy: string;
}

export interface CheckPermissionRequest {
  userId: string;
  resource: string;
  action: string;
  context?: Record<string, unknown>;
}

export interface CheckPermissionResponse {
  hasPermission: boolean;
  role?: string;
  reason?: string;
}

export interface AssignRoleRequest {
  userId: string;
  roleId: string;
  assignedBy: string;
}

export interface AssignRoleResponse {
  success: boolean;
  userRole: UserRole;
}

export class UserPermissionUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository
  ) {}

  async checkPermission(request: CheckPermissionRequest): Promise<CheckPermissionResponse> {
    try {
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
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to check permission');
    }
  }

  async assignRole(request: AssignRoleRequest): Promise<AssignRoleResponse> {
    try {
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

      // Assign role to user
      const userRole: UserRole = {
        userId: request.userId,
        roleId: request.roleId,
        assignedAt: new Date(),
        assignedBy: request.assignedBy,
      };

      await this.saveUserRole(userRole);

      return {
        success: true,
        userRole,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to assign role');
    }
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      const userRoles = await this.getUserRoles(userId);
      const permissions: Permission[] = [];

      for (const role of userRoles) {
        const rolePermissions = await this.getRolePermissions(role.id);
        permissions.push(...rolePermissions);
      }

      return permissions;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get user permissions');
    }
  }

  async canManageChannel(userId: string, channelId: string): Promise<boolean> {
    try {
      const channel = await this.channelRepository.findById(channelId);
      if (!channel) {
        return false;
      }

      // Channel owner can always manage the channel
      if (channel.isOwner(userId)) {
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
      // Check if user is message owner
      // This would require getting the message first
      // For now, we'll check channel management permissions

      const channel = await this.channelRepository.findById(channelId);
      if (!channel) {
        return false;
      }

      // Channel owner can delete any message
      if (channel.isOwner(userId)) {
        return true;
      }

      // Check if user has message management permission
      const messagePermission = await this.checkPermission({
        userId,
        resource: 'message',
        action: 'delete',
      });

      return messagePermission.hasPermission;
    } catch (error) {
      return false;
    }
  }

  private async getUserRoles(userId: string): Promise<Role[]> {
    // In real implementation, this would query the database
    // For now, we'll return default roles based on user properties
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return [];
    }

    // Mock roles - in real implementation, this would come from database
    const roles: Role[] = [
      {
        id: 'user',
        name: 'User',
        description: 'Regular user',
        permissions: [
          {
            id: 'send_message',
            name: 'Send Message',
            description: 'Can send messages in channels',
            resource: 'message',
            action: 'send',
          },
        ],
      },
    ];

    // Add admin role for certain users (mock logic)
    if (user.email?.includes('admin')) {
      roles.push({
        id: 'admin',
        name: 'Admin',
        description: 'Administrator',
        permissions: [
          {
            id: 'manage_users',
            name: 'Manage Users',
            description: 'Can manage users',
            resource: 'user',
            action: 'manage',
          },
          {
            id: 'manage_channels',
            name: 'Manage Channels',
            description: 'Can manage channels',
            resource: 'channel',
            action: 'manage',
          },
        ],
      });
    }

    return roles;
  }

  private async getRole(roleId: string): Promise<Role | null> {
    // In real implementation, this would query the database
    const roles = await this.getAvailableRoles();
    return roles.find(role => role.id === roleId) || null;
  }

  private async getRolePermissions(roleId: string): Promise<Permission[]> {
    const role = await this.getRole(roleId);
    return role?.permissions || [];
  }

  private async getAvailableRoles(): Promise<Role[]> {
    // In real implementation, this would query the database
    return [
      {
        id: 'user',
        name: 'User',
        description: 'Regular user',
        permissions: [
          {
            id: 'send_message',
            name: 'Send Message',
            description: 'Can send messages in channels',
            resource: 'message',
            action: 'send',
          },
        ],
      },
      {
        id: 'admin',
        name: 'Admin',
        description: 'Administrator',
        permissions: [
          {
            id: 'manage_users',
            name: 'Manage Users',
            description: 'Can manage users',
            resource: 'user',
            action: 'manage',
          },
          {
            id: 'manage_channels',
            name: 'Manage Channels',
            description: 'Can manage channels',
            resource: 'channel',
            action: 'manage',
          },
        ],
      },
    ];
  }

  private hasPermission(permissions: Permission[], resource: string, action: string): boolean {
    return permissions.some(
      permission => permission.resource === resource && permission.action === action
    );
  }

  private async checkContextPermission(
    userId: string,
    resource: string,
    action: string,
    context?: Record<string, unknown>
  ): Promise<boolean> {
    // In real implementation, this would check context-specific permissions
    // For example, a user might be able to edit their own messages but not others'
    return true;
  }

  private async saveUserRole(userRole: UserRole): Promise<void> {
    // In real implementation, this would save to database
    console.log('Saving user role:', userRole);
  }
} 