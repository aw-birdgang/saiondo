import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {ChannelService} from './channel.service';
import {AssistantService} from '../assistant/assistant.service';
import {PrismaService} from "@common/prisma/prisma.service";
import {InviteChannelDto} from "@modules/channel/dto/invite-channel.dto";

@Controller('channels')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly assistantService: AssistantService,
    private readonly prisma: PrismaService,
  ) {}

  // 전체 채널 조회
  @Get()
  async findAll() {
    return this.channelService.findAll();
  }

  // 채널 단건 조회
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.channelService.getChannelById(id);
  }

  // 채널 생성 (테스트용, 실제로는 RelationshipService에서 생성)
  @Post()
  async create(@Body() body: { user1Id: string; user2Id: string }) {
    return this.channelService.createChannel(body.user1Id, body.user2Id);
  }

  // 채널 삭제
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.channelService.remove(id);
  }

  @Post('invite')
  async invite(@Body() dto: InviteChannelDto) {
    return this.channelService.invite(dto);
  }

  @Post(':id/accept')
  async accept(@Param('id') id: string) {
    return this.channelService.accept(id);
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string) {
    return this.channelService.reject(id);
  }
}
