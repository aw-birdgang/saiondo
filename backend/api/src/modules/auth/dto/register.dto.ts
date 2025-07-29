import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'test@example.com', description: '이메일' })
  email: string;

  @ApiProperty({ example: 'password123', description: '비밀번호' })
  password: string;

  @ApiProperty({ example: '홍길동', description: '이름' })
  name: string;

  @ApiProperty({ example: 'MALE', enum: Gender })
  gender: Gender;

  @ApiProperty({ example: '1990-01-01', description: '생년월일' })
  birthDate: string;
}
