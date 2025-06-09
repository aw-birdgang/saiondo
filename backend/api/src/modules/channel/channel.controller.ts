import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {ChannelService} from './channel.service';
import {InviteCodeChannelDto} from '@modules/channel/dto/invite-code-channel.dto';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {JoinByInviteDto} from './dto/join-by-invite.dto';

@ApiTags('Channel')
@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

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

  @Post()
  @ApiOperation({ summary: '채널 생성' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user1Id: { type: 'string', description: '유저1 ID' },
        user2Id: { type: 'string', description: '유저2 ID' },
      },
      required: ['user1Id', 'user2Id'],
    },
  })
  @ApiResponse({ status: 201, description: '채널 생성 성공' })
  async create(@Body() body: { user1Id: string; user2Id: string }) {
    return this.channelService.createChannel(body.user1Id, body.user2Id);
  }

  @Post(':id/inviteCode')
  @ApiOperation({ summary: '채널 초대 코드 생성' })
  @ApiBody({ type: InviteCodeChannelDto })
  @ApiResponse({ status: 201, description: '채널 초대 코드 성공' })
  async inviteCode(@Body() dto: InviteCodeChannelDto) {
    return this.channelService.inviteCode(dto);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: '채널 초대 수락' })
  @ApiParam({ name: 'id', description: '채널 ID' })
  @ApiResponse({ status: 200, description: '초대 수락 성공' })
  async accept(@Param('id') id: string) {
    return this.channelService.accept(id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: '채널 초대 거절' })
  @ApiParam({ name: 'id', description: '채널 ID' })
  @ApiResponse({ status: 200, description: '초대 거절 성공' })
  async reject(@Param('id') id: string) {
    return this.channelService.reject(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '채널 삭제' })
  @ApiParam({ name: 'id', description: '채널 ID' })
  @ApiResponse({ status: 200, description: '채널 삭제 성공' })
  async remove(@Param('id') id: string) {
    return this.channelService.remove(id);
  }

  @Post(':id/join-by-invite')
  @ApiOperation({ summary: '초대코드로 채널 매칭(가입)' })
  @ApiBody({ type: JoinByInviteDto })
  @ApiResponse({ status: 200, description: '채널 매칭 성공' })
  async joinByInvite(@Body() dto: JoinByInviteDto) {
    return this.channelService.joinByInviteCode(dto.inviteCode, dto.userId);
  }

  @Get(':channelId/members/:userId')
  @ApiOperation({ summary: '채널 멤버십 확인' })
  async isMember(@Param('channelId') channelId: string, @Param('userId') userId: string) {
    return this.channelService.isMember(channelId, userId);
  }

  @Post(':channelId/members')
  @ApiOperation({ summary: '채널에 멤버 추가' })
  async addMember(@Param('channelId') channelId: string, @Body() body: { userId: string }) {
    return this.channelService.addMember(channelId, body.userId);
  }

  @Delete('cleanup')
  @ApiOperation({ summary: '멤버 없는 채널 정리' })
  async cleanup() {
    return this.channelService.cleanupEmptyChannels();
  }
}
