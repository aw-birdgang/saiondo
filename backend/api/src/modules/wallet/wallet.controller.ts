import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { MnemonicResponseDto } from './dto/mnemonic-response.dto';

@ApiTags('Wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: '전체 지갑 목록 조회 (관리자용)' })
  @ApiResponse({ status: 200, description: '지갑 목록 반환' })
  getAllWallets() {
    return this.walletService.getAllWallets();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '특정 유저의 모든 지갑 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiResponse({ status: 200, description: '유저의 지갑 목록 반환' })
  getWalletsByUser(@Param('userId') userId: string) {
    return this.walletService.getWalletsByUser(userId);
  }

  @Get(':walletId')
  @ApiOperation({ summary: '단일 지갑 조회 (id 기준)' })
  @ApiParam({ name: 'walletId', description: '지갑 ID' })
  @ApiResponse({ status: 200, description: '지갑 정보 반환' })
  getWalletById(@Param('walletId') walletId: string) {
    return this.walletService.getWalletById(walletId);
  }

  @Post()
  @ApiOperation({ summary: '지갑 생성 (address, mnemonic 직접 입력)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: '유저 ID' },
        address: { type: 'string', description: '이더리움 주소' },
        mnemonic: { type: 'string', description: 'Mnemonic' },
      },
      required: ['userId', 'address', 'mnemonic'],
    },
  })
  @ApiResponse({ status: 201, description: '생성된 지갑 정보 반환' })
  createWallet(@Body() body: { userId: string; address: string; mnemonic: string }) {
    return this.walletService.createWallet(body.userId, body.address, body.mnemonic);
  }

  @Post('random')
  @ApiOperation({ summary: '랜덤 mnemonic 기반 지갑 생성' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: '유저 ID' },
      },
      required: ['userId'],
    },
  })
  @ApiResponse({ status: 201, description: '생성된 랜덤 지갑 정보 반환' })
  createRandomWallet(@Body() body: { userId: string }) {
    return this.walletService.createRandomWalletForUser(body.userId);
  }

  @Patch(':walletId')
  @ApiOperation({ summary: '지갑 정보 수정' })
  @ApiParam({ name: 'walletId', description: '지갑 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: '이더리움 주소' },
        mnemonic: { type: 'string', description: 'Mnemonic' },
      },
    },
  })
  @ApiResponse({ status: 200, description: '수정된 지갑 정보 반환' })
  updateWallet(
    @Param('walletId') walletId: string,
    @Body() body: { address?: string; mnemonic?: string },
  ) {
    return this.walletService.updateWallet(walletId, body);
  }

  @Delete(':walletId')
  @ApiOperation({ summary: '지갑 삭제' })
  @ApiParam({ name: 'walletId', description: '지갑 ID' })
  @ApiResponse({ status: 200, description: '삭제된 지갑 정보 반환' })
  deleteWallet(@Param('walletId') walletId: string) {
    return this.walletService.deleteWallet(walletId);
  }

  @Get('mnemonic/generate')
  @ApiOperation({ summary: '랜덤 mnemonic 생성' })
  @ApiResponse({
    status: 200,
    description: '랜덤 mnemonic 반환',
    schema: {
      type: 'object',
      properties: {
        mnemonic: { type: 'string', description: '랜덤 mnemonic' },
      },
    },
  })
  @ApiResponse({ status: 200, type: MnemonicResponseDto })
  generateMnemonic() {
    return this.walletService.generateMnemonic();
  }

  @Get(':userId/mnemonic')
  @ApiOperation({ summary: '유저의 mnemonic 복구' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiResponse({ status: 200, description: '복호화된 mnemonic 반환' })
  async getMnemonic(@Param('userId') userId: string) {
    return this.walletService.getMnemonic(userId);
  }

  @Get(':walletId/decrypted')
  @ApiOperation({ summary: '지갑 정보(복호화) 조회' })
  @ApiParam({ name: 'walletId', description: '지갑 ID' })
  @ApiResponse({
    status: 200,
    description: '복호화된 mnemonic, privateKey 포함 지갑 정보 반환',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        address: { type: 'string' },
        mnemonic: { type: 'string', description: '복호화된 mnemonic' },
        privateKey: { type: 'string', description: '복호화된 privateKey' },
        // ... 기타 필드 ...
      },
    },
  })
  async getDecryptedWallet(@Param('walletId') walletId: string) {
    return this.walletService.getDecryptedWallet(walletId);
  }
}
