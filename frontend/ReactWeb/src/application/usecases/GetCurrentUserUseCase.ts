import { UserService } from '../services/UserService';
import type {
  GetCurrentUserRequest,
  GetCurrentUserResponse,
} from '../dto/GetCurrentUserDto';

export class GetCurrentUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(
    request?: GetCurrentUserRequest
  ): Promise<GetCurrentUserResponse> {
    try {
      const userProfile = await this.userService.getCurrentUser(
        request?.userId
      );
      return { user: userProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get current user');
    }
  }
}
