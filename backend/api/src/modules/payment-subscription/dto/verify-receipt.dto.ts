import { IsString, IsIn } from 'class-validator';

export class VerifyReceiptDto {
  @IsString()
  receipt: string;

  @IsIn(['apple', 'google'])
  platform: 'apple' | 'google';
}
