import type {
  CreateUserRequest,
  CreateUserResponse,
  GetCurrentUserRequest,
  GetCurrentUserResponse,
  GetUserRequest,
  GetUserResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '../../dto/UserDto';

// User Service 인터페이스 - 비즈니스 로직 담당
export interface IUserService {
  createUser(request: CreateUserRequest): Promise<CreateUserResponse>;
  updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse>;
  getUser(request: GetUserRequest): Promise<GetUserResponse>;
  searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse>;
  getCurrentUser(
    request?: GetCurrentUserRequest
  ): Promise<GetCurrentUserResponse>;
  deleteUser(userId: string): Promise<boolean>;
  getUserById(userId: string): Promise<GetUserResponse>;
  updateUserStatus(userId: string, status: string): Promise<boolean>;
  validateUserRequest(request: CreateUserRequest | UpdateUserRequest): string[];
  validateEmail(email: string): boolean;
  validateUsername(username: string): boolean;
  checkUserPermissions(userId: string, operation: string): Promise<boolean>;
  processUserProfile(userData: any): any;
}
