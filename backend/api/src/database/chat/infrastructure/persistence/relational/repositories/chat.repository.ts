import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {FindOptionsWhere, Repository} from 'typeorm';
import {NullableType} from '../../../../../../common/utils/types/nullable.type';
import {ChatRepository} from '../../chat-history.repository';
import {ChatEntity} from '../entities/chat.entity';
import {Chat} from '../../../../domain/chat';
import {ChatMapper} from '../mappers/chat.mapper';
import {FilterChatDto, SortChatDto} from '../../../../dto/query-chat.dto';

@Injectable()
export class ChatRelationalRepository implements ChatRepository {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatHistoryRepository: Repository<ChatEntity>,
  ) {}

  private readonly logger = new Logger(ChatRelationalRepository.name);

  async create(data: Chat): Promise<Chat> {
    const persistenceModel = ChatMapper.toPersistence(data);
    this.logger.log(`create>> persistenceModel.toString ::${persistenceModel.toString()}`);
    const newEntity = await this.chatHistoryRepository.save(
      this.chatHistoryRepository.create(persistenceModel),
    );
    return ChatMapper.toDomain(newEntity);
  }

  /******************************************************************
   * *****************************************************************/

  async findById(id: Chat['id']): Promise<NullableType<Chat>> {
    const entity = await this.chatHistoryRepository.findOne({
      where: { id: id },
    });
    return entity ? ChatMapper.toDomain(entity) : null;
  }

  async findWithWhere({
    whereConditions,
    filterOptions,
    sortOptions,
    relations = [],
  }: {
    whereConditions?: FindOptionsWhere<ChatEntity>;
    filterOptions?: FilterChatDto | null;
    sortOptions?: SortChatDto[] | null;
    relations?: string[];
  }): Promise<Chat[]> {
    const where: FindOptionsWhere<ChatEntity> = whereConditions || {};
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
    return entities.map((entity) => ChatMapper.toDomain(entity));
  }

  /******************************************************************
   * *****************************************************************/

  async update(id: Chat['id'], payload: Partial<Chat>): Promise<Chat> {
    const entity = await this.chatHistoryRepository.findOne({
      where: { id: id },
    });
    if (!entity) {
      throw new Error('User not found');
    }
    const updatedEntity = await this.chatHistoryRepository.save(
      this.chatHistoryRepository.create(
        ChatMapper.toPersistence({
          ...ChatMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ChatMapper.toDomain(updatedEntity);
  }

  /******************************************************************
   * *****************************************************************/

  async remove(id: Chat['id']): Promise<void> {
    await this.chatHistoryRepository.softDelete(id);
  }
}
