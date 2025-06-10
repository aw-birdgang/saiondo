import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({
    example: {
      id: 'uuid-1234',
      email: 'kim@example.com',
      name: '홍길동',
      gender: 'MALE',
      birthDate: '1990-01-01T00:00:00.000Z',
      createdAt: '...',
      updatedAt: '...',
    },
  })
  user: Partial<User>;
}
