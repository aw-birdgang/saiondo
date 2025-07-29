import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PointService } from './point.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { EarnPointDto } from './dto/earn-point.dto';
import { UsePointDto } from './dto/use-point.dto';
import { AdjustPointDto } from './dto/adjust-point.dto';
import { ConvertPointDto } from './dto/convert-point.dto';
import { ConvertTokenDto } from './dto/convert-token.dto';

@ApiTags('Point')
@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post(':userId/earn')
  @ApiOperation({ summary: '포인트 획득(미션, 프로필 등)' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiBody({ type: EarnPointDto })
  @ApiResponse({ status: 201, description: '포인트 획득 성공' })
  async earnPoint(@Param('userId') userId: string, @Body() body: EarnPointDto) {
    return this.pointService.earnPoint(userId, body.amount, body.type, body.description);
  }

  @Post(':userId/use')
  @ApiOperation({ summary: '포인트 사용(AI 대화 등)' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiBody({ type: UsePointDto })
  @ApiResponse({ status: 201, description: '포인트 사용 성공' })
  async usePoint(@Param('userId') userId: string, @Body() body: UsePointDto) {
    return this.pointService.usePoint(userId, body.amount, body.type, body.description);
  }

  @Post(':userId/adjust')
  @ApiOperation({ summary: '포인트 관리자 조정(플러스/마이너스)' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiBody({ type: AdjustPointDto })
  @ApiResponse({ status: 201, description: '포인트 조정 성공' })
  async adjustPoint(@Param('userId') userId: string, @Body() body: AdjustPointDto) {
    return this.pointService.adjustPoint(userId, body.amount, body.description);
  }

  @Get(':userId/history')
  @ApiOperation({ summary: '포인트 이력 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiResponse({ status: 200, description: '포인트 이력 리스트 반환' })
  async getHistory(@Param('userId') userId: string) {
    return this.pointService.getPointHistory(userId);
  }

  @Post(':userId/convert-token')
  @ApiOperation({ summary: '포인트를 토큰으로 변환' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiBody({ type: ConvertPointDto })
  @ApiResponse({
    status: 200,
    description: '트랜잭션 해시 반환',
    schema: { type: 'object', properties: { txHash: { type: 'string' } } },
  })
  // @UseGuards(JwtAuthGuard) // 실제 서비스에서는 인증 필요
  async convertPointToToken(@Param('userId') userId: string, @Body() dto: ConvertPointDto) {
    return this.pointService.convertPointToToken(userId, dto.pointAmount);
  }

  @Post(':userId/convert-point')
  @ApiOperation({ summary: '토큰을 포인트로 변환' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiBody({ type: ConvertTokenDto })
  @ApiResponse({
    status: 200,
    description: '포인트 변환 결과',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        point: { type: 'number', description: '변환 후 포인트' },
      },
    },
  })
  async convertToPoint(@Param('userId') userId: string, @Body() body: ConvertTokenDto) {
    return this.pointService.convertTokenToPoint(userId, body.tokenAmount);
  }

  @Get('products')
  @ApiOperation({ summary: '포인트 상품 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '포인트 상품 목록',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'product-uuid' },
          name: { type: 'string', example: '1000포인트' },
          pointAmount: { type: 'number', example: 1000 },
          price: { type: 'number', example: 10000 },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getProducts() {
    return this.pointService.getPointProducts();
  }

  @Post(':userId/purchase')
  @ApiOperation({ summary: '포인트 상품 구매' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: 'product-uuid' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '포인트 상품 구매 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        pointAdded: { type: 'number', example: 1000 },
      },
    },
  })
  async purchasePoint(@Param('userId') userId: string, @Body() body: { productId: string }) {
    // 실제 결제 연동은 별도 구현 필요(이니시스, 카카오페이 등)
    return this.pointService.purchasePoint(userId, body.productId);
  }
}
