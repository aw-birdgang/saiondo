import { ApiProperty } from '@nestjs/swagger';

export class BuyPointDto {
  @ApiProperty({ example: 'product-uuid', description: '포인트 상품 ID' })
  productId: string;
}
