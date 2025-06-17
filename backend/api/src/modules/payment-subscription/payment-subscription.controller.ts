import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {PaymentSubscriptionService} from './payment-subscription.service';
import {BuyPointDto} from './dto/buy-point.dto';
import {SubscribeDto} from './dto/subscribe.dto';
import {PointProductDto} from "@modules/payment-subscription/dto/point-product.dto";
import {BuyPointResponseDto} from "@modules/payment-subscription/dto/buy-point-response.dto";
import {SubscriptionPlanDto} from "@modules/payment-subscription/dto/subscription-plan.dto";
import {SubscriptionHistoryDto} from './dto/subscription-history.dto';
import {SubscribeResponseDto} from "@modules/payment-subscription/dto/subscribe-response.dto";

@ApiTags('PaymentSubscription')
@Controller('payment-subscription')
export class PaymentSubscriptionController {
  constructor(private readonly service: PaymentSubscriptionService) {}

  // 1. 포인트 상품 관련
  @Get('point-products')
  @ApiOperation({ summary: '포인트 상품 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '포인트 상품 목록',
    type: PointProductDto,
    isArray: true,
  })
  async getPointProducts(): Promise<PointProductDto[]> {
    return this.service.getPointProducts();
  }

  @Post(':userId/buy-point')
  @ApiOperation({ summary: '포인트 상품 구매' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiBody({ type: BuyPointDto })
  @ApiResponse({
    status: 201,
    description: '포인트 상품 구매 성공',
    type: BuyPointResponseDto,
  })
  async buyPoint(
    @Param('userId') userId: string,
    @Body() dto: BuyPointDto,
  ): Promise<BuyPointResponseDto> {
    return this.service.buyPoint(userId, dto);
  }

  // 2. 구독 플랜 관련
  @Get('subscription-plans')
  @ApiOperation({ summary: '구독 플랜 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '구독 플랜 목록',
    type: SubscriptionPlanDto,
    isArray: true,
  })
  async getSubscriptionPlans(): Promise<SubscriptionPlanDto[]> {
    return this.service.getSubscriptionPlans();
  }

  @Post(':userId/subscribe')
  @ApiOperation({ summary: '구독 결제 및 활성화' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiBody({ type: SubscribeDto })
  @ApiResponse({
    status: 201,
    description: '구독 결제 성공',
    type: SubscribeResponseDto,
  })
  async subscribe(
    @Param('userId') userId: string,
    @Body() dto: SubscribeDto,
  ): Promise<SubscribeResponseDto> {
    return this.service.subscribe(userId, dto);
  }

  // 3. 구독 이력 관련
  @Get('subscription-histories')
  @ApiOperation({ summary: '전체 구독 신청 이력 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '구독 신청 이력 목록',
    type: SubscriptionHistoryDto,
    isArray: true,
  })
  async getAllSubscriptionHistories(): Promise<SubscriptionHistoryDto[]> {
    return this.service.getAllSubscriptionHistories();
  }

  @Get(':userId/subscription-histories')
  @ApiOperation({ summary: '특정 유저의 구독 신청 이력 목록 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiResponse({
    status: 200,
    description: '해당 유저의 구독 신청 이력 목록',
    type: SubscriptionHistoryDto,
    isArray: true,
  })
  async getSubscriptionHistoriesByUser(
    @Param('userId') userId: string,
  ): Promise<SubscriptionHistoryDto[]> {
    return this.service.getSubscriptionHistoriesByUser(userId);
  }

}
