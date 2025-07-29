import { NullableType } from '../../../../common/utils/types/nullable.type';
import { DeepPartial } from 'typeorm';
import { User } from '../../domain/user';

export abstract class UserRepository {
  abstract create(data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>): Promise<User>;
  abstract findById(id: User['id']): Promise<NullableType<User>>;
  abstract update(id: User['id'], payload: DeepPartial<User>): Promise<User | null>;
  abstract remove(id: User['id']): Promise<void>;
}
