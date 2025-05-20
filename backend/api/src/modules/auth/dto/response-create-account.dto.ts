import { ApiProperty } from '@nestjs/swagger';

export class ResponseCreateAccountDto {
  @ApiProperty({ description: '사용자 타입', default: 'user' })
  type: string;

  @ApiProperty({ description: '사용자 번호' })
  idx: number;

  @ApiProperty({ description: '사용자 아이디' })
  uuid: string;

  @ApiProperty({ description: '사용자 E-Mail' })
  email: string;

  @ApiProperty({ description: '사용자 이름' })
  name: string;
}
