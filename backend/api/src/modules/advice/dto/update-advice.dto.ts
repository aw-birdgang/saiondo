import { IsString } from 'class-validator';

export class UpdateAdviceDto {
  @IsString()
  advice: string;
}
