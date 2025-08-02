/**
 * UserPermission Use Case DTOs
 * 사용자 권한 관리 관련 Request/Response 인터페이스
 */

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

export interface GetUserPermissionsRequest {
  userId: string;
}

export interface GetUserPermissionsResponse {
  permissions: Permission[];
  roles: Role[];
}

export interface CanManageChannelRequest {
  userId: string;
  channelId: string;
}

export interface CanManageChannelResponse {
  canManage: boolean;
  reason?: string;
}

export interface CanDeleteMessageRequest {
  userId: string;
  messageId: string;
  channelId: string;
}

export interface CanDeleteMessageResponse {
  canDelete: boolean;
  reason?: string;
}

export interface GetAvailableRolesRequest {
  includePermissions?: boolean;
}

export interface GetAvailableRolesResponse {
  roles: Role[];
} 