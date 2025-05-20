import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'kim@example.com', description: '이메일' })
  email: string;

  @ApiProperty({ example: 'password123', description: '비밀번호' })
  password: string;
}
