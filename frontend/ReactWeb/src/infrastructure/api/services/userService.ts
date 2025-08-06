import { apiClient } from '@/infrastructure/api/ApiClient';
import { ENDPOINTS } from '@/infrastructure/api/endpoints';
import type {
  User,
  UserWithWallet,
  Assistant,
  PersonaProfile,
  PersonaProfileRequest,
} from '@/domain/types';

export class UserService {
  async fetchUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>(ENDPOINTS.USERS);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '사용자 목록 조회 실패';
      throw new Error(`사용자 목록 조회 실패: ${message}`);
    }
  }

  async fetchUserById(id: string): Promise<UserWithWallet> {
    try {
      const response = await apiClient.get<UserWithWallet>(
        ENDPOINTS.USER_BY_ID(id)
      );
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || '사용자 조회 실패';
      throw new Error(`사용자 조회 실패: ${message}`);
    }
  }

  async fetchCurrentUser(): Promise<UserWithWallet> {
    try {
      const response = await apiClient.get<UserWithWallet>(ENDPOINTS.USER_ME);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '현재 사용자 조회 실패';
      throw new Error(`현재 사용자 조회 실패: ${message}`);
    }
  }

  async fetchUserAssistants(userId: string): Promise<Assistant[]> {
    try {
      const response = await apiClient.get<{ assistants: Assistant[] }>(
        ENDPOINTS.USER_ASSISTANTS(userId)
      );
      return response.assistants;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '사용자 어시스턴트 조회 실패';
      throw new Error(`사용자 어시스턴트 조회 실패: ${message}`);
    }
  }

  async updateUser(user: Partial<User> & { id: string }): Promise<User> {
    try {
      const response = await apiClient.patch<User>(
        ENDPOINTS.USER_BY_ID(user.id),
        user
      );
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '사용자 업데이트 실패';
      throw new Error(`사용자 업데이트 실패: ${message}`);
    }
  }

  async fetchPersonaProfiles(userId: string): Promise<PersonaProfile[]> {
    try {
      const url = ENDPOINTS.PERSONA_PROFILES(userId);

      const response = await apiClient.get<PersonaProfile[]>(url);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '페르소나 프로필 조회 실패';
      throw new Error(`페르소나 프로필 조회 실패: ${message}`);
    }
  }

  async createPersonaProfile(
    userId: string,
    req: PersonaProfileRequest
  ): Promise<PersonaProfile> {
    try {
      const response = await apiClient.post<PersonaProfile>(
        ENDPOINTS.CREATE_PERSONA_PROFILE(userId),
        req
      );
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '페르소나 프로필 생성 실패';
      throw new Error(`페르소나 프로필 생성 실패: ${message}`);
    }
  }

  async updatePersonaProfile(
    userId: string,
    categoryCodeId: string,
    req: PersonaProfileRequest
  ): Promise<PersonaProfile> {
    try {
      const response = await apiClient.patch<PersonaProfile>(
        ENDPOINTS.UPDATE_PERSONA_PROFILE(userId, categoryCodeId),
        req
      );
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '페르소나 프로필 업데이트 실패';
      throw new Error(`페르소나 프로필 업데이트 실패: ${message}`);
    }
  }

  async deletePersonaProfile(
    userId: string,
    categoryCodeId: string
  ): Promise<void> {
    try {
      await apiClient.delete(
        ENDPOINTS.DELETE_PERSONA_PROFILE(userId, categoryCodeId)
      );
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        '페르소나 프로필 삭제 실패';
      throw new Error(`페르소나 프로필 삭제 실패: ${message}`);
    }
  }

  async updateFcmToken(userId: string, fcmToken: string): Promise<void> {
    try {
      await apiClient.patch(ENDPOINTS.USER_FCM_TOKEN(userId), { fcmToken });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'FCM 토큰 업데이트 실패';
      throw new Error(`FCM 토큰 업데이트 실패: ${message}`);
    }
  }
}

export const userService = new UserService();
