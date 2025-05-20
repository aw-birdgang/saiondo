import { PartialType } from '@nestjs/swagger';
import { CreateCategoryCodeDto } from './create-category-code.dto';

export class UpdateCategoryCodeDto extends PartialType(CreateCategoryCodeDto) {}
