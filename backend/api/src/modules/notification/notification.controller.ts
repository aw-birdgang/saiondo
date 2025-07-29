import { Body, Controller, Get, Param, Post, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from '../../database/notification/dto/create-notification.dto';
import { QueryNotificationDto } from '../../database/notification/dto/query-notification.dto';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: '알림 생성' })
  @ApiResponse({ status: 201, description: '알림 생성 성공' })
  async create(@Body() dto: CreateNotificationDto) {
    // userId는 인증정보에서 가져오거나, dto에서 받음
    return this.notificationService.sendNotification(dto.userId, dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '특정 유저의 알림 목록 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getUserNotifications(
    @Param('userId') userId: string,
    @Query() query: QueryNotificationDto,
  ) {
    return this.notificationService.getNotificationsByUserId(userId, query);
  }

  @Get('user/:userId/unread')
  @ApiOperation({ summary: '특정 유저의 읽지 않은 알림 목록 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  async getUnreadNotifications(@Param('userId') userId: string) {
    return this.notificationService.getUnreadNotifications(userId);
  }

  @Get('user/:userId/unread/count')
  @ApiOperation({ summary: '특정 유저의 읽지 않은 알림 개수 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  async countUnread(@Param('userId') userId: string) {
    return this.notificationService.countUnreadNotifications(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: '알림 읽음 처리' })
  @ApiParam({ name: 'id', description: '알림 ID' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Patch('user/:userId/read-all')
  @ApiOperation({ summary: '특정 유저의 모든 알림 읽음 처리' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  async markAllAsRead(@Param('userId') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: '알림 삭제' })
  @ApiParam({ name: 'id', description: '알림 ID' })
  async remove(@Param('id') id: string) {
    return this.notificationService.removeNotification(id);
  }
}
