import { UserService } from '../services/UserService';
import type { UpdateUserRequest, UpdateUserResponse } from '../dto/UpdateUserDto';

export class UpdateUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      if (!request.id || request.id.trim().length === 0) {
        throw new Error('User ID is required');
      }

      const updatedUser = await this.userService.updateUserProfile(request.id, request.updates);
      return { user: updatedUser };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update user');
    }
  }
}
