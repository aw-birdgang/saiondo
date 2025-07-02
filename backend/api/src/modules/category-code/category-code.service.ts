import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateCategoryCodeDto} from './dto/create-category-code.dto';
import {UpdateCategoryCodeDto} from './dto/update-category-code.dto';
import {
  RelationalCategoryCodeRepository
} from '../../database/category-code/infrastructure/persistence/relational/repositories/category-code.repository';
import {CategoryCode} from '../../database/category-code/domain/category-code';

@Injectable()
export class CategoryCodeService {
  constructor(
    private readonly categoryCodeRepo: RelationalCategoryCodeRepository,
  ) {}

  /** 카테고리 코드 생성 */
  async create(data: CreateCategoryCodeDto): Promise<CategoryCode> {
    const now = new Date();
    const categoryCode = new CategoryCode();
    categoryCode.id = crypto.randomUUID();
    categoryCode.code = data.code;
    categoryCode.description = data.description;
    categoryCode.createdAt = now;
    categoryCode.updatedAt = now;
    return this.categoryCodeRepo.save(categoryCode);
  }

  /** 전체 카테고리 코드 조회 */
  async findAll(): Promise<CategoryCode[]> {
    return this.categoryCodeRepo.findAll();
  }

  /** 단일 카테고리 코드 조회 */
  async findOne(id: string): Promise<CategoryCode | null> {
    return this.categoryCodeRepo.findById(id);
  }

  /** 카테고리 코드 수정 */
  async update(id: string, data: UpdateCategoryCodeDto): Promise<CategoryCode> {
    const existing = await this.categoryCodeRepo.findById(id);
    if (!existing) throw new NotFoundException('카테고리 코드를 찾을 수 없습니다.');
    // 변경 필드만 갱신
    existing.code = data.code ?? existing.code;
    existing.description = data.description ?? existing.description;
    existing.updatedAt = new Date();
    return this.categoryCodeRepo.save(existing);
  }

  /** 카테고리 코드 삭제 */
  async remove(id: string): Promise<void> {
    await this.categoryCodeRepo.delete(id);
  }
}
