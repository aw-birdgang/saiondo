import { CategoryCode } from '../../domain/category-code';

export abstract class CategoryCodeRepository {
  abstract findById(id: string): Promise<CategoryCode | null>;
  abstract findAll(): Promise<CategoryCode[]>;
  abstract save(channel: CategoryCode): Promise<CategoryCode>;
  abstract delete(id: string): Promise<void>;
}
