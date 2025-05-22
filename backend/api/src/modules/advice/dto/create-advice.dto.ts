import { IsString } from 'class-validator';

export class CreateAdviceDto {
  @IsString()
  channelId: string;

  @IsString()
  advice: string;
}
