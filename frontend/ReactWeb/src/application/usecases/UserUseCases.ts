import type { IUserService } from './interfaces/IUserService';
import type { IUserUseCase } from './interfaces/IUserUseCase';
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
  UpdateUserResponse
} from '../dto/UserDto';

// User UseCase 구현체 - Service를 사용하여 애플리케이션 로직 조율
export class UserUseCases implements IUserUseCase {
  constructor(private readonly userService: IUserService) {}

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    return await this.userService.createUser(request);
  }

  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    return await this.userService.updateUser(request);
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    return await this.userService.getUser(request);
  }

  async searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse> {
    return await this.userService.searchUsers(request);
  }

  async getCurrentUser(request?: GetCurrentUserRequest): Promise<GetCurrentUserResponse> {
    return await this.userService.getCurrentUser(request);
  }

  async deleteUser(userId: string): Promise<boolean> {
    return await this.userService.deleteUser(userId);
  }

  async getUserById(userId: string): Promise<GetUserResponse> {
    return await this.userService.getUserById(userId);
  }

  async updateUserStatus(userId: string, status: string): Promise<boolean> {
    return await this.userService.updateUserStatus(userId, status);
  }

  validateUserRequest(request: CreateUserRequest | UpdateUserRequest): string[] {
    return this.userService.validateUserRequest(request);
  }

  validateEmail(email: string): boolean {
    return this.userService.validateEmail(email);
  }

  validateUsername(username: string): boolean {
    return this.userService.validateUsername(username);
  }
} 