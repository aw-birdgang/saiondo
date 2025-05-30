import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBasicQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsOptional()
  description?: string;
}
