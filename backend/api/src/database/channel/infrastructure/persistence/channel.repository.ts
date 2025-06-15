import { Channel } from '../../domain/channel';

export abstract class ChannelRepository {
  abstract findById(id: string): Promise<Channel | null>;
  abstract findAll(): Promise<Channel[]>;
  abstract save(channel: Channel): Promise<Channel>;
  abstract delete(id: string): Promise<void>;
}
