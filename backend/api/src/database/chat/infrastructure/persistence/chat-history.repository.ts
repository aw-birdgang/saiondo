import {NullableType} from '../../../../common/utils/types/nullable.type';
import {DeepPartial, FindOptionsWhere} from 'typeorm';
import {Chat} from '../../domain/chat';
import {FilterChatDto, SortChatDto} from '../../dto/query-chat.dto';
import {ChatEntity} from './relational/entities/chat.entity';

export abstract class ChatRepository {
  abstract create(
    data: Omit<Chat, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Chat>;

  /******************************************************************
   * *****************************************************************/

  abstract findById(id: Chat['id']): Promise<NullableType<Chat>>;

  abstract findWithWhere({
    whereConditions,
    filterOptions,
    sortOptions,
    relations,
  }: {
    whereConditions?: FindOptionsWhere<ChatEntity>;
    filterOptions?: FilterChatDto | null;
    sortOptions?: SortChatDto[] | null;
    relations?: string[];
  }): Promise<Chat[]>;

  /******************************************************************
   * *****************************************************************/

  abstract update(
    id: Chat['id'],
    payload: DeepPartial<Chat>,
  ): Promise<Chat | null>;

  /******************************************************************
   * *****************************************************************/

  abstract remove(id: Chat['id']): Promise<void>;
}
