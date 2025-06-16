import { NullableType } from '../../../../common/utils/types/nullable.type';
import { DeepPartial } from 'typeorm';
import { Wallet } from '../../domain/wallet';

export abstract class WalletRepository {
  abstract create(data: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wallet>;
  abstract findById(id: Wallet['id']): Promise<NullableType<Wallet>>;
  abstract update(id: Wallet['id'], payload: DeepPartial<Wallet>): Promise<Wallet | null>;
  abstract remove(id: Wallet['id']): Promise<void>;
}
