import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBasicAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}
