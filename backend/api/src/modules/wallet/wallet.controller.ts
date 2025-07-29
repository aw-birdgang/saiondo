import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { WalletDto } from './dto/wallet.dto';
import { MnemonicResponseDto } from './dto/mnemonic-response.dto';

@ApiTags('Wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: '전체 지갑 목록 조회 (관리자용)' })
  @ApiResponse({ status: 200, type: [WalletDto], description: '지갑 목록 반환' })
  getAllWallets() {
    return this.walletService.getAllWallets();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '유저의 지갑 + 토큰 잔액(DB값) 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID', type: 'string' })
  @ApiResponse({ status: 200, type: WalletDto, description: '유저의 지갑 정보 반환' })
  async getWalletsByUser(@Param('userId') userId: string) {
    return this.walletService.getWalletsByUser(userId);
  }

  @Get(':walletId')
  @ApiOperation({ summary: '단일 지갑 + 토큰 잔액(DB값) 조회' })
  @ApiParam({ name: 'walletId', description: '지갑 ID', type: 'string' })
  @ApiResponse({ status: 200, type: WalletDto, description: '지갑 정보 반환' })
  async getWalletById(@Param('walletId') walletId: string) {
    return this.walletService.getWalletById(walletId);
  }

  @Post('create')
  @ApiOperation({ summary: '지갑 생성 (HD mnemonic 기반, index 지정 가능)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: '유저 ID' },
        index: { type: 'number', description: 'HD 파생 인덱스', default: 0 },
      },
      required: ['userId'],
    },
  })
  @ApiResponse({ status: 201, type: WalletDto, description: '생성된 지갑 정보 반환' })
  async createWallet(@Body() body: { userId: string; index?: number }) {
    return this.walletService.createWalletForUser(body.userId);
  }

  @Post('random')
  @ApiOperation({ summary: '랜덤 mnemonic 기반 지갑 생성 (테스트용)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: '유저 ID' },
      },
      required: ['userId'],
    },
  })
  @ApiResponse({ status: 201, type: WalletDto, description: '생성된 랜덤 지갑 정보 반환' })
  createRandomWallet(@Body() body: { userId: string }) {
    return this.walletService.createWalletForUser(body.userId);
  }

  @Patch(':walletId')
  @ApiOperation({ summary: '지갑 정보 수정' })
  @ApiParam({ name: 'walletId', description: '지갑 ID', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: '이더리움 주소' },
        mnemonic: { type: 'string', description: 'Mnemonic' },
      },
    },
  })
  @ApiResponse({ status: 200, type: WalletDto, description: '수정된 지갑 정보 반환' })
  updateWallet(
    @Param('walletId') walletId: string,
    @Body() body: { address?: string; mnemonic?: string },
  ) {
    return this.walletService.updateWallet(walletId, body);
  }

  @Delete(':walletId')
  @ApiOperation({ summary: '지갑 삭제' })
  @ApiParam({ name: 'walletId', description: '지갑 ID', type: 'string' })
  @ApiResponse({ status: 200, type: WalletDto, description: '삭제된 지갑 정보 반환' })
  deleteWallet(@Param('walletId') walletId: string) {
    return this.walletService.deleteWallet(walletId);
  }

  @Get('mnemonic/:userId')
  @ApiOperation({ summary: '유저의 mnemonic 복구' })
  @ApiParam({ name: 'userId', description: '유저 ID', type: 'string' })
  @ApiResponse({ status: 200, type: MnemonicResponseDto, description: '복호화된 mnemonic 반환' })
  async getMnemonic(@Param('userId') userId: string) {
    return this.walletService.getMnemonic(userId);
  }

  @Get(':walletId/decrypted')
  @ApiOperation({ summary: '지갑 정보(복호화) 조회' })
  @ApiParam({ name: 'walletId', description: '지갑 ID', type: 'string' })
  @ApiResponse({
    status: 200,
    type: WalletDto,
    description: '복호화된 mnemonic, privateKey 포함 지갑 정보 반환',
  })
  async getDecryptedWallet(@Param('walletId') walletId: string) {
    return this.walletService.getDecryptedWallet(walletId);
  }

  @Post(':walletId/refresh-balance')
  @ApiOperation({ summary: '지갑 토큰 잔액 새로고침(Web3에서 조회 후 DB 반영)' })
  @ApiParam({ name: 'walletId', description: '지갑 ID', type: 'string' })
  @ApiResponse({ status: 200, type: WalletDto, description: '새로고침된 지갑 정보 반환' })
  async refreshWalletBalance(@Param('walletId') walletId: string) {
    return this.walletService.refreshWalletBalance(walletId);
  }
}
