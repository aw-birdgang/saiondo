import { NullableType } from '../../../../common/utils/types/nullable.type';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { User } from '../../domain/user';
import { FilterUserDto, SortUserDto } from '../../dto/query-user.dto';
import { UserEntity } from './relational/entities/user.entity';

export abstract class UserRepository {
  abstract create(data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>): Promise<User>;

  /******************************************************************
   * *****************************************************************/

  abstract findById(id: User['id']): Promise<NullableType<User>>;

  abstract findWithWhere({
    whereConditions,
    filterOptions,
    sortOptions,
    relations,
  }: {
    whereConditions?: FindOptionsWhere<UserEntity>;
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    relations?: string[];
  }): Promise<User[]>;

  /******************************************************************
   * *****************************************************************/

  abstract update(id: User['id'], payload: DeepPartial<User>): Promise<User | null>;

  /******************************************************************
   * *****************************************************************/

  abstract remove(id: User['id']): Promise<void>;
}
