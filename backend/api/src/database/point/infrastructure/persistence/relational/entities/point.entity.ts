import { PointType } from '@prisma/client';

export class PointEntity {
  id: string;
  userId: string;
  amount: number;
  type: PointType;
  description?: string | null;
  createdAt: Date;
} 