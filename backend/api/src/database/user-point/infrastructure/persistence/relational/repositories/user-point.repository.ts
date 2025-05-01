import {Injectable, Logger, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";

import {FindOptionsWhere, Repository} from "typeorm";
import {UserPointMapper} from "../mappers/user-point.mapper";
import {UserPointRepository} from "../../user-point.repository";
import {UserPoint} from "../../../../domain/user-point";
import {NullableType} from "../../../../../../common/utils/types/nullable.type";
import {IPaginationOptions} from "../../../../../../common/utils/types/pagination-options";
import {UserPointEntity} from "../entities/user-point.entity";
import {FilterUserDto, SortUserDto} from "../../../../dto/query-user-point.dto";


@Injectable()
export class UserPointRelationalRepository implements UserPointRepository {
  constructor(
    @InjectRepository(UserPointEntity)
    private readonly userRepository: Repository<UserPointEntity>,
  ) {}

  private readonly logger = new Logger(UserPointRelationalRepository.name);

  async create(data: UserPoint): Promise<UserPoint> {
    this.logger.log(`create>> data.toString ::${data.toString()}`)
    const persistenceModel = UserPointMapper.toPersistence(data);
    this.logger.log(`create>> persistenceModel.toString ::${persistenceModel.toString()}`)

    const newEntity = await this.userRepository.save(
      this.userRepository.create(persistenceModel),
    );
    return UserPointMapper.toDomain(newEntity);
  }


  /******************************************************************
   * *****************************************************************/


  async findOneWithWhere({
                             filterOptions,
                             sortOptions,
                             whereConditions,
                             relations,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    whereConditions?: FindOptionsWhere<UserPointEntity>;
    relations?: string[];
  }): Promise<NullableType<UserPoint>> {
    const where: FindOptionsWhere<UserPointEntity> = whereConditions || {};
    const order = sortOptions && Array.isArray(sortOptions) ? sortOptions.reduce(
      (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
      }),
      {},
    ) : {};
    const entity = await this.userRepository.findOne({
        where,
        order,
        relations,
    });
    return entity ? UserPointMapper.toDomain(entity) : null;
  }


  async findWithWhere({
    sortOptions,
    where,
  }: {
    sortOptions?: SortUserDto[] | null,
    where: FindOptionsWhere<UserPointEntity>,
  }): Promise<UserPoint[]> {
    this.logger.log(`findWithWhere >> where: ${JSON.stringify(where)}`);
    const entities = await this.userRepository.find({ where });
    return entities.map((entity) => UserPointMapper.toDomain(entity));
  }


  async findMany({
    sortOptions,
   }: {
    sortOptions?: SortUserDto[] | null;
  }): Promise<UserPoint[]> {
      const order = sortOptions && Array.isArray(sortOptions) ? sortOptions.reduce(
          (accumulator, sort) => ({
              ...accumulator,
              [sort.orderBy]: sort.order,
          }),
          {},
      ) : {};
    const entities = await this.userRepository.find({
      order: order,
    });
    return entities.map((ticket) => UserPointMapper.toDomain(ticket));
  }


    async findManyWithPagination({
         filterOptions,
         sortOptions,
         paginationOptions,
     }: {
        filterOptions?: FilterUserDto | null;
        sortOptions?: SortUserDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResult<UserPoint>> {
        const where: FindOptionsWhere<UserPointEntity> = {};
        const order = sortOptions && Array.isArray(sortOptions) ? sortOptions.reduce(
            (accumulator, sort) => ({
                ...accumulator,
                [sort.orderBy]: sort.order,
            }),
            {},
        ) : {};
        const skip = ((paginationOptions.page ?? 1) - 1) * (paginationOptions.limit ?? 10);
        const take = paginationOptions.limit ?? 10;
        const [entities, totalCount] = await this.userRepository.findAndCount({
            skip,
            take,
            where,
            order,
        });
        const items = entities.map((result) => UserPointMapper.toDomain(result));
        return {
            totalCount,
            items,
        };
    }


  async findManyWithWhereAndPagination({
     filterOptions,
     sortOptions,
     paginationOptions,
   }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<UserPoint[]> {
    const where: FindOptionsWhere<UserPointEntity> = {};
    this.logger.log(`findManyWithWhereAndPagination >> where: ${JSON.stringify(where)}`);
    const order = sortOptions && Array.isArray(sortOptions) ? sortOptions.reduce(
          (accumulator, sort) => ({
              ...accumulator,
              [sort.orderBy]: sort.order,
          }),
          {},
    ) : {};

    // 페이징 처리 설정
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    const entities = await this.userRepository.find({
      skip,
      take: limit,
      where,
      order,
    });

    return entities.map((entity) => UserPointMapper.toDomain(entity));
  }


  async findById(id: UserPoint['id']): Promise<NullableType<UserPoint>> {
    const entity = await this.userRepository.findOne({
      where: { id: id },
    });
    return entity ? UserPointMapper.toDomain(entity) : null;
  }


  async findWithPaginationByQueryBuilder({
     filterOptions,
     sortOptions = [],
     whereConditions,
     selectFields = ['address.*'],
     joins = [],
     paginationOptions,
   }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    whereConditions?: FindOptionsWhere<UserPointEntity>;
    selectFields?: string[];
    joins?: {
      type: 'innerJoin' | 'leftJoin' | 'innerJoinAndSelect' | 'leftJoinAndSelect';
      entity: string;
      alias: string;
      condition?: string;
    }[];
    paginationOptions?: IPaginationOptions;
  }): Promise<PaginationResult<UserPoint>> {
    const queryBuilder = this.userRepository.createQueryBuilder('address');
    // 필드 선택
    queryBuilder.select(selectFields);
    // 조건 추가
    if (whereConditions) {
      queryBuilder.where(whereConditions);
    }
    // 정렬 옵션 추가
    (sortOptions ?? []).forEach(({ orderBy, order }) => {
      queryBuilder.addOrderBy(orderBy, order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
    });
    // 조인 추가
    joins.forEach(({ type, entity, alias, condition }) =>
      condition
        ? queryBuilder[type](`address.${entity}`, alias, condition)
        : queryBuilder[type](`address.${entity}`, alias)
    );
    // 페이지네이션 처리
    if (paginationOptions) {
      const { limit, page } = paginationOptions;
      queryBuilder.skip(limit * (page - 1)).take(limit);
    }

    const [entities, totalCount] = await queryBuilder.getManyAndCount();
    const items = entities.map((result) => UserPointMapper.toDomain(result));

    return { totalCount, items };
  }


  /******************************************************************
   * *****************************************************************/


  async update(id: UserPoint['id'], payload: Partial<UserPoint>): Promise<UserPoint> {
    const entity = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!entity) {
      throw new NotFoundException('UserPoint not found');
    }
    const updatedEntity = await this.userRepository.save(
      this.userRepository.create(
          UserPointMapper.toPersistence({
          ...UserPointMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );
    return UserPointMapper.toDomain(updatedEntity);
  }

  async remove(id: UserPoint['id'],): Promise<void> {
    await this.userRepository.softDelete(id);
  }

}
