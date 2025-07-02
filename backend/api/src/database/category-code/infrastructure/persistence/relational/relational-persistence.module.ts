import { Module } from '@nestjs/common';
import { RelationalCategoryCodeRepository } from './repositories/category-code.repository';
import { PrismaService } from '@common/prisma/prisma.service';

@Module({
  providers: [RelationalCategoryCodeRepository, PrismaService],
  exports: [RelationalCategoryCodeRepository],
})
export class CategoryCodeRelationalPersistenceModule {}
