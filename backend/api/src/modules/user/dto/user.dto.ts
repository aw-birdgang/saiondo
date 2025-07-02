// api/src/modules/user/user.dto.ts
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class CreateUserDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '홍길동' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'MALE', enum: ['MALE', 'FEMALE', 'OTHER'] })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({ example: 'password1234' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'fcm_token_example', required: false })
  @IsOptional()
  @IsString()
  fcmToken?: string;
}