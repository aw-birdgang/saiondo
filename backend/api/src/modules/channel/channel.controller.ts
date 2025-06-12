import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { InviteCodeChannelDto } from '@modules/channel/dto/invite-code-channel.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JoinByInviteDto } from './dto/join-by-invite.dto';
import { CreateChannelDto } from './dto/create-channel.dto';

@ApiTags('Channel')
@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // =========================
  // ======= 조회 (READ) ======
  // =========================

  // 전체 채널 조회
  @Get()
  @ApiOperation({ summary: '전체 채널 조회' })
  @ApiResponse({ status: 200, description: '채널 목록 반환' })
  async findAll() {
    return this.channelService.findAll();
  }

  // 채널 단건 조회
  @Get(':id')
  @ApiOperation({ summary: '채널 단건 조회' })
  @ApiParam({ name: 'id', description: '채널 ID' })
  @ApiResponse({ status: 200, description: '채널 정보 반환' })
  async findOne(@Param('id') id: string) {
    return this.channelService.getChannelById(id);
  }

  // inviteCode로 채널 조회
  @Get('by-invite-code/:inviteCode')
  @ApiOperation({ summary: '초대코드로 채널 조회' })
  @ApiParam({ name: 'inviteCode', description: '채널 초대 코드' })
  @ApiResponse({ status: 200, description: '채널 정보 반환' })
  async getByInviteCode(@Param('inviteCode') inviteCode: string) {
    return this.channelService.getChannelByInviteCode(inviteCode);
  }

  // 채널 멤버십 확인
  @Get(':channelId/members/:userId')
  @ApiOperation({ summary: '채널 멤버십 확인' })
  @ApiParam({ name: 'channelId', description: '채널 ID' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiResponse({ status: 200, description: '멤버 여부 반환' })
  async isMember(
    @Param('channelId') channelId: string,
    @Param('userId') userId: string,
  ) {
    return this.channelService.isMember(channelId, userId);
  }

  // 현재 참여 채널 조회
  @Get('current')
  @ApiOperation({ summary: '현재 참여 채널 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID', required: true })
  @ApiResponse({ status: 200, description: '참여 채널 반환' })
  async getCurrentChannel(@Query('userId') userId: string) {
    return this.channelService.getCurrentChannel(userId);
  }

  // 참여 가능한 채널 목록
  @Get('available')
  @ApiOperation({ summary: '참여 가능한 채널 목록' })
  @ApiResponse({ status: 200, description: '채널 목록 반환' })
  async getAvailableChannels() {
    return this.channelService.getAvailableChannels();
  }

  // userId로 참여 중인 모든 채널 조회
  @Get('by-user/:userId')
  @ApiOperation({ summary: 'userId로 참여 중인 모든 채널 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiResponse({ status: 200, description: '참여 채널 목록 반환' })
  async getChannelsByUser(
      @Param('userId') userId: string
  ) {
    return this.channelService.getChannelByUserId(userId);
  }

  // =========================
  // === 생성/참여/초대 (CREATE/JOIN/INVITE) ===
  // =========================

  // 채널 생성
  @Post()
  @ApiOperation({ summary: '채널 생성' })
  @ApiBody({ type: CreateChannelDto })
  @ApiResponse({ status: 201, description: '채널 생성 성공' })
  async create(@Body() dto: CreateChannelDto) {
    return this.channelService.createChannel(dto);
  }

  // 초대코드로 채널 참여 (실제 멤버 추가 및 상태 변경)
  @Post('join-by-invite')
  @ApiOperation({ summary: '초대코드로 채널 참여' })
  @ApiBody({ type: JoinByInviteDto })
  @ApiResponse({ status: 200, description: '채널 참여 성공' })
  async joinByInvite(@Body() dto: JoinByInviteDto) {
    return this.channelService.joinByInviteCode(dto.inviteCode, dto.userId);
  }

  // 채널 ID로 참여 (MEMBER로 추가)
  @Post('join-by-id')
  @ApiOperation({ summary: '채널 ID로 참여' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: '유저 ID' },
        channelId: { type: 'string', description: '채널 ID' },
      },
      required: ['userId', 'channelId'],
    },
  })
  @ApiResponse({ status: 200, description: '채널 참여 성공' })
  async joinChannelById(@Body() body: { userId: string; channelId: string }) {
    return this.channelService.joinChannelById(body.userId, body.channelId);
  }

  // 채널에 유저 초대
  @Post(':id/invite')
  @ApiOperation({ summary: '채널에 유저 초대' })
  @ApiParam({ name: 'id', description: '채널 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        inviterId: { type: 'string', description: '초대한 유저 ID' },
        inviteeId: { type: 'string', description: '초대받을 유저 ID' },
      },
      required: ['inviterId', 'inviteeId'],
    },
  })
  @ApiResponse({ status: 201, description: '초대장 생성 성공' })
  async invite(
    @Param('id') channelId: string,
    @Body('inviterId') inviterId: string,
    @Body('inviteeId') inviteeId: string,
  ) {
    return this.channelService.invite(channelId, inviterId, inviteeId);
  }

  // =========================
  // === 상태변경/삭제 (UPDATE/DELETE) ===
  // =========================

  // 채널 초대 코드 재발급
  @Post(':id/inviteCode')
  @ApiOperation({ summary: '채널 초대 코드 재발급' })
  @ApiBody({ type: InviteCodeChannelDto })
  @ApiResponse({ status: 201, description: '채널 초대 코드 성공' })
  async inviteCode(@Body() dto: InviteCodeChannelDto) {
    return this.channelService.inviteCode(dto);
  }

  // 채널 초대 거절
  @Post(':id/reject')
  @ApiOperation({ summary: '채널 초대 거절' })
  @ApiParam({ name: 'id', description: '채널 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: '유저 ID' },
      },
      required: ['userId'],
    },
  })
  @ApiResponse({ status: 200, description: '초대 거절 성공' })
  async reject(@Param('id') id: string, @Body('userId') userId: string) {
    return this.channelService.reject(id, userId);
  }

  // 채널 나가기
  @Post('leave')
  @ApiOperation({ summary: '채널 나가기' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: '유저 ID' },
      },
      required: ['userId'],
    },
  })
  @ApiResponse({ status: 200, description: '채널 나가기 성공' })
  async leaveChannel(@Body() body: { userId: string }) {
    return this.channelService.leaveChannel(body.userId);
  }

  // 채널 삭제
  @Delete(':id')
  @ApiOperation({ summary: '채널 삭제' })
  @ApiParam({ name: 'id', description: '채널 ID' })
  @ApiResponse({ status: 200, description: '채널 삭제 성공' })
  async remove(@Param('id') id: string) {
    return this.channelService.remove(id);
  }

  // 멤버 없는 채널 정리
  @Delete('cleanup')
  @ApiOperation({ summary: '멤버 없는 채널 정리' })
  @ApiResponse({ status: 200, description: '정리 성공' })
  async cleanup() {
    return this.channelService.cleanupEmptyChannels();
  }
}
