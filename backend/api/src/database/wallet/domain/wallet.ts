import { User } from '../../user/domain/user';

export class Wallet {
  public id?: string;
  public address: string;
  public mnemonic: string;
  public privateKey: string;
  public tokenBalance: string;
  public derivationIndex: number;
  public user?: User | null;
  public createdAt: Date;
  public updatedAt: Date;
}
