export class WalletEntity {
  id: string;
  address: string;
  mnemonic: string;
  privateKey: string;
  tokenBalance: string;
  derivationIndex: number;
  user?: any;
  createdAt: Date;
  updatedAt: Date;
}
