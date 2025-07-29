import { PointType } from '@prisma/client';

export class Point {
  public id: string;
  public userId: string;
  public amount: number;
  public type: PointType;
  public description?: string | null | undefined;
  public createdAt?: Date;
}
