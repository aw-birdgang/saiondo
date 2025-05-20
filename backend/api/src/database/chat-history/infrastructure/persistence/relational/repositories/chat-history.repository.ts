import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../../common/utils/types/nullable.type';
import { ChatHistoryRepository } from '../../chat-history.repository';
import { ChatHistoryEntity } from '../entities/chat-history.entity';
import { ChatHistory } from '../../../../domain/chat-history';
import { ChatHistoryMapper } from '../mappers/chat-history.mapper';
import { FilterChatHistoryDto, SortChatHistoryDto } from '../../../../dto/query-chat-history.dto';

@Injectable()
export class ChatHistoryRelationalRepository implements ChatHistoryRepository {
  constructor(
    @InjectRepository(ChatHistoryEntity)
    private readonly chatHistoryRepository: Repository<ChatHistoryEntity>,
  ) {}

  private readonly logger = new Logger(ChatHistoryRelationalRepository.name);

  async create(data: ChatHistory): Promise<ChatHistory> {
    const persistenceModel = ChatHistoryMapper.toPersistence(data);
    this.logger.log(`create>> persistenceModel.toString ::${persistenceModel.toString()}`);
    const newEntity = await this.chatHistoryRepository.save(
      this.chatHistoryRepository.create(persistenceModel),
    );
    return ChatHistoryMapper.toDomain(newEntity);
  }

  /******************************************************************
   * *****************************************************************/

  async findById(id: ChatHistory['id']): Promise<NullableType<ChatHistory>> {
    const entity = await this.chatHistoryRepository.findOne({
      where: { id: id },
    });
    return entity ? ChatHistoryMapper.toDomain(entity) : null;
  }

  async findWithWhere({
    whereConditions,
    filterOptions,
    sortOptions,
    relations = [],
  }: {
    whereConditions?: FindOptionsWhere<ChatHistoryEntity>;
    filterOptions?: FilterChatHistoryDto | null;
    sortOptions?: SortChatHistoryDto[] | null;
    relations?: string[];
  }): Promise<ChatHistory[]> {
    const where: FindOptionsWhere<ChatHistoryEntity> = whereConditions || {};
    this.logger.log(`findWithWhere >> where: ${JSON.stringify(where)}`);
    const order =
      sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ) || {};
    const entities = await this.chatHistoryRepository.find({
      where,
      order,
      relations,
    });
    return entities.map((entity) => ChatHistoryMapper.toDomain(entity));
  }

  /******************************************************************
   * *****************************************************************/

  async update(id: ChatHistory['id'], payload: Partial<ChatHistory>): Promise<ChatHistory> {
    const entity = await this.chatHistoryRepository.findOne({
      where: { id: id },
    });
    if (!entity) {
      throw new Error('User not found');
    }
    const updatedEntity = await this.chatHistoryRepository.save(
      this.chatHistoryRepository.create(
        ChatHistoryMapper.toPersistence({
          ...ChatHistoryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ChatHistoryMapper.toDomain(updatedEntity);
  }

  /******************************************************************
   * *****************************************************************/

  async remove(id: ChatHistory['id']): Promise<void> {
    await this.chatHistoryRepository.softDelete(id);
  }
}
