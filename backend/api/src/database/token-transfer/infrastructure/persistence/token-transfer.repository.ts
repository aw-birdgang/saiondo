import { TokenTransfer } from '../../domain/token-transfer';

export abstract class TokenTransferRepository {
  abstract findById(id: string): Promise<TokenTransfer | null>;
  abstract findAll(): Promise<TokenTransfer[]>;
  abstract save(tokenTransfer: TokenTransfer): Promise<TokenTransfer>;
  abstract delete(id: string): Promise<void>;
  abstract findByUserId(userId: string): Promise<TokenTransfer[]>;
}
