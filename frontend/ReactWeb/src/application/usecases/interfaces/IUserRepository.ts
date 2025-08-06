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
} from '@/application/dto/UserDto';

// User Repository 인터페이스 - 데이터 접근만 담당
export interface IUserRepository {
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
}
