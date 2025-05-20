import { Controller, Post, Body } from '@nestjs/common';
import { PushScheduleService } from './push-schedule.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

class ScheduleQuestionDto {
  userId: string;
  questionId: string;
  scheduledAt: Date;
}

@ApiTags('PushSchedule')
@Controller('push-schedules')
export class PushScheduleController {
  constructor(private readonly service: PushScheduleService) {}

  @Post()
  @ApiOperation({ summary: '질문 푸시 스케줄 생성' })
  @ApiBody({ type: ScheduleQuestionDto })
  @ApiResponse({ status: 201, description: '생성된 푸시 스케줄 반환' })
  schedule(@Body() dto: ScheduleQuestionDto) {
    return this.service.scheduleQuestion(dto.userId, dto.questionId, dto.scheduledAt);
  }
}
