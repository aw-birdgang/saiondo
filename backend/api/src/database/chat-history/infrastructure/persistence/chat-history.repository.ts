import {NullableType} from "../../../../common/utils/types/nullable.type";
import {DeepPartial, FindOptionsWhere} from "typeorm";
import {ChatHistory} from "../../domain/chat-history";
import {FilterChatHistoryDto, SortChatHistoryDto} from "../../dto/query-chat-history.dto";
import {ChatHistoryEntity} from "./relational/entities/chat-history.entity";

export abstract class ChatHistoryRepository {
  abstract create(
    data: Omit<ChatHistory, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<ChatHistory>;

  /******************************************************************
   * *****************************************************************/

  abstract findById(id: ChatHistory['id']): Promise<NullableType<ChatHistory>>;


  abstract findWithWhere({
    whereConditions,
    filterOptions,
    sortOptions,
    relations,
  }: {
    whereConditions?: FindOptionsWhere<ChatHistoryEntity>;
    filterOptions?: FilterChatHistoryDto | null;
    sortOptions?: SortChatHistoryDto[] | null;
    relations?: string[];
  }): Promise<ChatHistory[]>;


  /******************************************************************
   * *****************************************************************/

  abstract update(
    id: ChatHistory['id'],
    payload: DeepPartial<ChatHistory>,
  ): Promise<ChatHistory | null>;

  /******************************************************************
   * *****************************************************************/

  abstract remove(id: ChatHistory['id']): Promise<void>;
}
