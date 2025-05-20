import {Body, Controller, Param, Post} from '@nestjs/common';
import {PushService} from './push.service';
import {ApiBody, ApiOperation, ApiTags} from '@nestjs/swagger';
import {SendPushToUserDto} from "@modules/push-schedule/dto/send-push-to-user.dto";
import {SendPushDto} from "@modules/push-schedule/dto/send-push.dto";


@ApiTags('Push')
@Controller('push')
export class PushController {
  constructor(
    private readonly pushService: PushService,
  ) {}

  @Post('send')
  @ApiOperation({ summary: 'FCM 푸시 발송' })
  @ApiBody({ type: SendPushDto })
  async sendPush(@Body() dto: SendPushDto) {
    return this.pushService.sendPush(dto.token, dto.title, dto.body, dto.data);
  }

  @Post('user/:userId/send-push')
  @ApiOperation({ summary: '특정 유저에게 FCM 푸시 발송' })
  @ApiBody({ type: SendPushToUserDto })
  async sendPushToUser(
    @Param('userId') userId: string,
    @Body() dto: SendPushToUserDto,
  ) {
    return this.pushService.sendPushToUser(userId, dto.title, dto.body, dto.data);
  }
}
