import { Point } from '../../domain/point';

export abstract class PointRepository {
  abstract findById(id: string): Promise<Point | null>;
  abstract findAll(): Promise<Point[]>;
  abstract save(point: Point): Promise<Point>;
  abstract delete(id: string): Promise<void>;
} 