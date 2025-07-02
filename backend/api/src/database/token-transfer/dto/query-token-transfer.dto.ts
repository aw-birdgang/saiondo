export class QueryTokenTransferDto {
  id: string;
  userId: string;
  toAddress: string;
  amount: string;
  txHash: string;
  status: string;
  createdAt: Date;
}
