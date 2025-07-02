import { Module } from '@nestjs/common';
import { CategoryCodeService } from './category-code.service';
import { CategoryCodeController } from './category-code.controller';
import { CategoryCodeRelationalPersistenceModule } from '../../database/category-code/infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [CategoryCodeRelationalPersistenceModule],
  controllers: [CategoryCodeController],
  providers: [CategoryCodeService],
  exports: [CategoryCodeService],
})
export class CategoryCodeModule {}
