import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {ChannelService} from './channel.service';
import {InviteChannelDto} from "@modules/channel/dto/invite-channel.dto";
import {ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam} from "@nestjs/swagger";

@ApiTags('Channel')
@Controller('channels')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
  ) {}

  // 전체 채널 조회
  @Get()
  @ApiOperation({summary: '전체 채널 조회'})
  @ApiResponse({status: 200, description: '채널 목록 반환'})
  async findAll() {
    return this.channelService.findAll();
  }

  // 채널 단건 조회
  @Get(':id')
  @ApiOperation({summary: '채널 단건 조회'})
  @ApiParam({name: 'id', description: '채널 ID'})
  @ApiResponse({status: 200, description: '채널 정보 반환'})
  async findOne(@Param('id') id: string) {
    return this.channelService.getChannelById(id);
  }

  @Post()
  @ApiOperation({summary: '채널 생성'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user1Id: {type: 'string', description: '유저1 ID'},
        user2Id: {type: 'string', description: '유저2 ID'},
      },
      required: ['user1Id', 'user2Id'],
    },
  })
  @ApiResponse({status: 201, description: '채널 생성 성공'})
  async create(@Body() body: {user1Id: string; user2Id: string}) {
    return this.channelService.createChannel(body.user1Id, body.user2Id);
  }

  @Post('invite')
  @ApiOperation({summary: '채널 초대'})
  @ApiBody({type: InviteChannelDto})
  @ApiResponse({status: 201, description: '채널 초대 성공'})
  async invite(@Body() dto: InviteChannelDto) {
    return this.channelService.invite(dto);
  }

  @Post(':id/accept')
  @ApiOperation({summary: '채널 초대 수락'})
  @ApiParam({name: 'id', description: '채널 ID'})
  @ApiResponse({status: 200, description: '초대 수락 성공'})
  async accept(@Param('id') id: string) {
    return this.channelService.accept(id);
  }

  @Post(':id/reject')
  @ApiOperation({summary: '채널 초대 거절'})
  @ApiParam({name: 'id', description: '채널 ID'})
  @ApiResponse({status: 200, description: '초대 거절 성공'})
  async reject(@Param('id') id: string) {
    return this.channelService.reject(id);
  }

  @Delete(':id')
  @ApiOperation({summary: '채널 삭제'})
  @ApiParam({name: 'id', description: '채널 ID'})
  @ApiResponse({status: 200, description: '채널 삭제 성공'})
  async remove(@Param('id') id: string) {
    return this.channelService.remove(id);
  }
}
