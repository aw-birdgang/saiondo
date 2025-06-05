import {Controller, Get, Param} from '@nestjs/common';
import {TokenTransferService} from './token-transfer.service';
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';

@ApiTags('TokenTransfer')
@Controller('token-transfer')
export class TokenTransferController {
  constructor(private readonly tokenTransferService: TokenTransferService) {}

  @Get('all')
  @ApiOperation({ summary: '전체 토큰 전송 내역 조회 (관리자용)' })
  @ApiResponse({ status: 200, type: [Object] })
  async getAllTransfers() {
    return this.tokenTransferService.getAllTransfers();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '특정 유저의 토큰 전송 내역 목록 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiResponse({ status: 200, type: [Object] })
  async userTransfers(@Param('userId') userId: string) {
    return this.tokenTransferService.getTransfersByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '토큰 전송 내역 상세 조회' })
  @ApiParam({ name: 'id', description: '전송 내역 ID' })
  @ApiResponse({ status: 200, type: Object })
  async getTransferById(@Param('id') id: string) {
    return this.tokenTransferService.getTransferById(id);
  }
}
