import type { IChannelRepository } from '@/application/usecases/interfaces/IChannelRepository';
import type { IChannelUseCase } from '@/application/usecases/interfaces/IChannelUseCase';
import type { ICache } from '@/application/usecases/interfaces/ICache';
import { ChannelService } from '@/application/usecases/services/ChannelService';
import { ChannelUseCases } from '@/application/usecases/ChannelUseCases';

// 의존성 주입을 위한 팩토리 함수
export const createChannelUseCase = (
  repository: IChannelRepository,
  cache?: ICache
): IChannelUseCase => {
  const service = new ChannelService(repository, cache);
  return new ChannelUseCases(service);
};

// 테스트를 위한 Mock 팩토리
export const createMockChannelUseCase = (): IChannelUseCase => {
  const mockRepository: IChannelRepository = {
    createChannel: async () => ({
      channel: {
        id: 'mock-channel-id',
        name: 'Mock Channel',
        description: 'Mock channel description',
        type: 'public',
        ownerId: 'mock-owner-id',
        members: ['mock-owner-id'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    getChannel: async () => ({
      channel: {
        id: 'mock-channel-id',
        name: 'Mock Channel',
        description: 'Mock channel description',
        type: 'public',
        ownerId: 'mock-owner-id',
        members: ['mock-owner-id'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    getChannels: async () => ({
      channels: [],
      total: 0,
      hasMore: false,
    }),
    updateChannel: async () => ({
      channel: {
        id: 'mock-channel-id',
        name: 'Updated Mock Channel',
        description: 'Updated mock channel description',
        type: 'public',
        ownerId: 'mock-owner-id',
        members: ['mock-owner-id'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    addMember: async () => ({
      channel: {
        id: 'mock-channel-id',
        name: 'Mock Channel',
        description: 'Mock channel description',
        type: 'public',
        ownerId: 'mock-owner-id',
        members: ['mock-owner-id', 'new-member-id'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    removeMember: async () => ({
      channel: {
        id: 'mock-channel-id',
        name: 'Mock Channel',
        description: 'Mock channel description',
        type: 'public',
        ownerId: 'mock-owner-id',
        members: ['mock-owner-id'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    deleteChannel: async () => true,
    getChannelMembers: async () => ['mock-owner-id'],
    isMember: async () => true,
    updateChannelStatus: async () => true,
  };

  return createChannelUseCase(mockRepository);
};
