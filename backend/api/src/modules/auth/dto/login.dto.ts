import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'kim@example.com', description: '이메일' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password123', description: '비밀번호' })
  password: string;
}
