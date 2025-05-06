import { ApiProperty } from '@nestjs/swagger';

export class CreateAdviceReportDto {
  @ApiProperty()
  relationshipId: string;

  @ApiProperty()
  generatedById: string;

  @ApiProperty()
  reportDate: Date;

  @ApiProperty()
  summary: string;

  @ApiProperty()
  adviceForUser1: string;

  @ApiProperty()
  adviceForUser2: string;
}
