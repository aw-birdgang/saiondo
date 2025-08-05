import type {
  AddMemberRequest,
  AddMemberResponse,
  CreateChannelRequest,
  CreateChannelResponse,
  GetChannelRequest,
  GetChannelResponse,
  GetChannelsRequest,
  GetChannelsResponse,
  RemoveMemberRequest,
  RemoveMemberResponse,
  UpdateChannelRequest,
  UpdateChannelResponse
} from '../../dto/ChannelDto';
import type { IChannelRepository } from '../interfaces/IChannelRepository';
import type { IChannelService } from '../interfaces/IChannelService';
import type { ICache } from '../interfaces/ICache';
import { CHANNEL_TYPES, CHANNEL_STATUS, CHANNEL_LIMITS, CHANNEL_ERROR_MESSAGES, CHANNEL_CACHE_TTL } from '../constants/ChannelConstants';
import { MemoryCache } from '../cache/MemoryCache';
import { DomainErrorFactory } from '../../../domain/errors/DomainError';

// Channel Service 구현체
export class ChannelService implements IChannelService {
  private cache: ICache;

  constructor(
    private channelRepository: IChannelRepository,
    cache?: ICache
  ) {
    this.cache = cache || new MemoryCache();
  }

  async createChannel(request: CreateChannelRequest): Promise<CreateChannelResponse> {
    try {
      // 비즈니스 로직 검증
      const validationErrors = this.validateChannelRequest(request);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0]);
      }

      // 사용자 권한 확인
      const hasPermission = await this.checkChannelPermissions(request.ownerId, '', 'create_channel');
      if (!hasPermission) {
        throw new Error(CHANNEL_ERROR_MESSAGES.PERMISSION.ACCESS_DENIED);
      }

      const response = await this.channelRepository.createChannel(request);
      
      // 성공 시 캐시 무효화
      this.invalidateChannelCache(response.channel.id);
      
      return response;
    } catch (error) {
      console.error('Failed to create channel:', error);
      throw DomainErrorFactory.createChannelValidation(CHANNEL_ERROR_MESSAGES.OPERATION.CREATE_FAILED);
    }
  }

  async getChannel(request: GetChannelRequest): Promise<GetChannelResponse> {
    try {
      // 캐시 확인
      const cacheKey = `channel:${request.id}`;
      const cached = this.cache.get<GetChannelResponse>(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await this.channelRepository.getChannel(request);
      
      // 캐시 저장
      this.cache.set(cacheKey, response, CHANNEL_CACHE_TTL.CHANNEL_INFO);
      
      return response;
    } catch (error) {
      console.error('Failed to get channel:', error);
      throw DomainErrorFactory.createChannelValidation(CHANNEL_ERROR_MESSAGES.OPERATION.GET_FAILED);
    }
  }

  async getChannels(request: GetChannelsRequest): Promise<GetChannelsResponse> {
    try {
      if (!request.userId) {
        throw new Error(CHANNEL_ERROR_MESSAGES.VALIDATION.OWNER_REQUIRED);
      }

      // 캐시 확인
      const cacheKey = `channels:${request.userId}`;
      const cached = this.cache.get<GetChannelsResponse>(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await this.channelRepository.getChannels(request);
      
      // 캐시 저장
      this.cache.set(cacheKey, response, CHANNEL_CACHE_TTL.CHANNEL_LIST);
      
      return response;
    } catch (error) {
      console.error('Failed to get channels:', error);
      throw DomainErrorFactory.createChannelValidation(CHANNEL_ERROR_MESSAGES.OPERATION.GET_FAILED);
    }
  }

  async updateChannel(request: UpdateChannelRequest): Promise<UpdateChannelResponse> {
    try {
      // 비즈니스 로직 검증
      const validationErrors = this.validateChannelRequest(request);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0]);
      }

      // 사용자 권한 확인
      const hasPermission = await this.checkChannelPermissions('', request.id, 'update_channel');
      if (!hasPermission) {
        throw new Error(CHANNEL_ERROR_MESSAGES.PERMISSION.ACCESS_DENIED);
      }

      const response = await this.channelRepository.updateChannel(request);
      
      // 성공 시 캐시 무효화
      this.invalidateChannelCache(request.id);
      
      return response;
    } catch (error) {
      console.error('Failed to update channel:', error);
      throw DomainErrorFactory.createChannelValidation(CHANNEL_ERROR_MESSAGES.OPERATION.UPDATE_FAILED);
    }
  }

  async addMember(request: AddMemberRequest): Promise<AddMemberResponse> {
    try {
      // 사용자 권한 확인
      const hasPermission = await this.checkChannelPermissions(request.userId, request.channelId, 'add_member');
      if (!hasPermission) {
        throw new Error(CHANNEL_ERROR_MESSAGES.PERMISSION.ACCESS_DENIED);
      }

      // 이미 멤버인지 확인
      const isAlreadyMember = await this.isMember(request.channelId, request.userId);
      if (isAlreadyMember) {
        throw new Error(CHANNEL_ERROR_MESSAGES.OPERATION.ALREADY_MEMBER);
      }

      const response = await this.channelRepository.addMember(request);
      
      // 성공 시 캐시 무효화
      this.invalidateChannelCache(request.channelId);
      this.invalidateMemberCache(request.channelId);
      
      return response;
    } catch (error) {
      console.error('Failed to add member:', error);
      throw DomainErrorFactory.createChannelValidation(CHANNEL_ERROR_MESSAGES.OPERATION.ADD_MEMBER_FAILED);
    }
  }

  async removeMember(request: RemoveMemberRequest): Promise<RemoveMemberResponse> {
    try {
      // 사용자 권한 확인
      const hasPermission = await this.checkChannelPermissions(request.userId, request.channelId, 'remove_member');
      if (!hasPermission) {
        throw new Error(CHANNEL_ERROR_MESSAGES.PERMISSION.ACCESS_DENIED);
      }

      // 멤버인지 확인
      const isMember = await this.isMember(request.channelId, request.userId);
      if (!isMember) {
        throw new Error(CHANNEL_ERROR_MESSAGES.OPERATION.NOT_MEMBER);
      }

      const response = await this.channelRepository.removeMember(request);
      
      // 성공 시 캐시 무효화
      this.invalidateChannelCache(request.channelId);
      this.invalidateMemberCache(request.channelId);
      
      return response;
    } catch (error) {
      console.error('Failed to remove member:', error);
      throw DomainErrorFactory.createChannelValidation(CHANNEL_ERROR_MESSAGES.OPERATION.REMOVE_MEMBER_FAILED);
    }
  }

  async deleteChannel(channelId: string): Promise<boolean> {
    try {
      // 사용자 권한 확인
      const hasPermission = await this.checkChannelPermissions('', channelId, 'delete_channel');
      if (!hasPermission) {
        throw new Error(CHANNEL_ERROR_MESSAGES.PERMISSION.OWNER_ONLY);
      }

      const result = await this.channelRepository.deleteChannel(channelId);
      
      // 성공 시 캐시 무효화
      if (result) {
        this.invalidateChannelCache(channelId);
        this.invalidateMemberCache(channelId);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to delete channel:', error);
      throw DomainErrorFactory.createChannelValidation('Failed to delete channel');
    }
  }

  async getChannelMembers(channelId: string): Promise<string[]> {
    try {
      // 캐시 확인
      const cacheKey = `members:${channelId}`;
      const cached = this.cache.get<string[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const members = await this.channelRepository.getChannelMembers(channelId);
      
      // 캐시 저장
      this.cache.set(cacheKey, members, CHANNEL_CACHE_TTL.MEMBER_LIST);
      
      return members;
    } catch (error) {
      console.error('Failed to get channel members:', error);
      throw DomainErrorFactory.createChannelValidation('Failed to get channel members');
    }
  }

  async isMember(channelId: string, userId: string): Promise<boolean> {
    try {
      return await this.channelRepository.isMember(channelId, userId);
    } catch (error) {
      console.error('Failed to check if user is member:', error);
      return false;
    }
  }

  async updateChannelStatus(channelId: string, status: string): Promise<boolean> {
    try {
      // 상태값 검증
      if (!Object.values(CHANNEL_STATUS).includes(status as any)) {
        throw new Error('Invalid channel status');
      }

      const result = await this.channelRepository.updateChannelStatus(channelId, status);
      
      // 성공 시 캐시 무효화
      if (result) {
        this.invalidateChannelCache(channelId);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to update channel status:', error);
      throw DomainErrorFactory.createChannelValidation('Failed to update channel status');
    }
  }

  validateChannelRequest(request: CreateChannelRequest | UpdateChannelRequest): string[] {
    const errors: string[] = [];

    // 채널명 유효성 검사
    if ('name' in request && (!request.name || !this.validateChannelName(request.name))) {
      errors.push(CHANNEL_ERROR_MESSAGES.VALIDATION.NAME_REQUIRED);
    }

    // 채널명 길이 검사
    if ('name' in request && request.name) {
      if (request.name.length < CHANNEL_LIMITS.MIN_NAME_LENGTH) {
        errors.push(CHANNEL_ERROR_MESSAGES.VALIDATION.NAME_TOO_SHORT);
      }
      if (request.name.length > CHANNEL_LIMITS.MAX_NAME_LENGTH) {
        errors.push(CHANNEL_ERROR_MESSAGES.VALIDATION.NAME_TOO_LONG);
      }
    }

    // 설명 길이 검사
    if ('description' in request && request.description && request.description.length > CHANNEL_LIMITS.MAX_DESCRIPTION_LENGTH) {
      errors.push(CHANNEL_ERROR_MESSAGES.VALIDATION.DESCRIPTION_TOO_LONG);
    }

    // 타입 검증
    if ('type' in request && request.type && !Object.values(CHANNEL_TYPES).includes(request.type as any)) {
      errors.push(CHANNEL_ERROR_MESSAGES.VALIDATION.TYPE_INVALID);
    }

    return errors;
  }

  validateChannelName(name: string): boolean {
    return name.trim().length >= CHANNEL_LIMITS.MIN_NAME_LENGTH && 
           name.trim().length <= CHANNEL_LIMITS.MAX_NAME_LENGTH;
  }

  async checkChannelPermissions(userId: string, channelId: string, operation: string): Promise<boolean> {
    try {
      // 실제 권한 확인 로직 (예시)
      // 여기서는 간단히 true를 반환하지만, 실제로는 사용자 역할과 권한을 확인해야 함
      return true;
    } catch (error) {
      console.error('Failed to check channel permissions:', error);
      return false;
    }
  }

  processChannelData(channelData: any): any {
    // 채널 데이터 가공
    return {
      ...channelData,
      status: channelData.status || CHANNEL_STATUS.ACTIVE,
      createdAt: channelData.createdAt || new Date(),
      updatedAt: channelData.updatedAt || new Date(),
    };
  }

  // Private helper methods
  private invalidateChannelCache(channelId: string): void {
    this.cache.delete(`channel:${channelId}`);
    this.cache.delete(`channels:*`);
  }

  private invalidateMemberCache(channelId: string): void {
    this.cache.delete(`members:${channelId}`);
  }
} 