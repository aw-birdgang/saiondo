import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../../common/utils/types/nullable.type';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../../user.repository';
import { User } from '../../../../domain/user';
import { UserMapper } from '../mappers/user.mapper';
import { FilterUserDto, SortUserDto } from '../../../../dto/query-user.dto';

@Injectable()
export class UserRelationalRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private readonly logger = new Logger(UserRelationalRepository.name);

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    this.logger.log(
      `create>> persistenceModel.toString ::${persistenceModel.toString()}`,
    );
    const newEntity = await this.userRepository.save(
      this.userRepository.create(persistenceModel),
    );
    return UserMapper.toDomain(newEntity);
  }

  /******************************************************************
   * *****************************************************************/

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: { id: id },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findWithWhere({
    whereConditions,
    filterOptions,
    sortOptions,
    relations = [],
  }: {
    whereConditions?: FindOptionsWhere<UserEntity>;
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    relations?: string[];
  }): Promise<User[]> {
    const where: FindOptionsWhere<UserEntity> = whereConditions || {};
    this.logger.log(`findWithWhere >> where: ${JSON.stringify(where)}`);
    const order =
      sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ) || {};
    const entities = await this.userRepository.find({
      where,
      order,
      relations,
    });
    return entities.map((entity) => UserMapper.toDomain(entity));
  }

  /******************************************************************
   * *****************************************************************/

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!entity) {
      throw new Error('User not found');
    }
    const updatedEntity = await this.userRepository.save(
      this.userRepository.create(
        UserMapper.toPersistence({
          ...UserMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  /******************************************************************
   * *****************************************************************/

  async remove(id: User['id']): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
