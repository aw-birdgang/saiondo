import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryCodeDto {
  @ApiProperty()
  code: string;

  @ApiProperty({ required: false })
  description?: string;
}