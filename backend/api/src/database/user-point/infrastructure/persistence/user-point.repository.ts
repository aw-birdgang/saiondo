import {IPaginationOptions} from "../../../../common/utils/types/pagination-options";
import {NullableType} from "../../../../common/utils/types/nullable.type";
import {DeepPartial, FindOptionsWhere} from "typeorm";
import {UserPoint} from "../../domain/user-point";
import {UserPointEntity} from "./relational/entities/user-point.entity";
import {FilterUserDto, SortUserDto} from "../../dto/query-user-point.dto";

export abstract class UserPointRepository {
  abstract create(
    data: Omit<UserPoint, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<UserPoint>;

  /******************************************************************
   * *****************************************************************/

  abstract findMany({
    sortOptions,
  }: {
    sortOptions?: SortUserDto[] | null;
  }): Promise<UserPoint[]>;


  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResult<UserPoint>>;


  abstract findById(id: UserPoint['id']): Promise<NullableType<UserPoint>>;


  abstract findWithWhere({
   sortOptions,
   whereConditions
   }: {
    sortOptions?: SortUserDto[] | null;
    whereConditions?: FindOptionsWhere<UserPoint>
  }): Promise<UserPoint[]>;


  abstract findOneWithWhere({
    filterOptions,
    sortOptions,
    whereConditions,
    relations,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    whereConditions?: FindOptionsWhere<UserPointEntity>;
    relations?: string[];
  }): Promise<UserPoint>;


  abstract findManyWithWhereAndPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    whereConditions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
    whereConditions?: FindOptionsWhere<UserPoint>;
  }): Promise<UserPoint[]>;


  /******************************************************************
   * *****************************************************************/

  abstract update(
    id: UserPoint['id'],
    payload: DeepPartial<UserPoint>,
  ): Promise<UserPoint | null>;


  /******************************************************************
   * *****************************************************************/

  abstract remove(id: UserPoint['id']): Promise<void>;
}
