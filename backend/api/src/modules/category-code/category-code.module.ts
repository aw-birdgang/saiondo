import { Module } from '@nestjs/common';
import { CategoryCodeService } from './category-code.service';
import { CategoryCodeController } from './category-code.controller';

@Module({
  controllers: [CategoryCodeController],
  providers: [CategoryCodeService],
  exports: [CategoryCodeService],
})
export class CategoryCodeModule {}