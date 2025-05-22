import {Body, Controller, Delete, Get, Param, Post, Put,} from '@nestjs/common';
import {EventService} from './event.service';
import {CreateEventDto} from './dto/create-event.dto';
import {UpdateEventDto} from './dto/update-event.dto';
import {ApiBody, ApiOperation, ApiResponse, ApiTags,} from '@nestjs/swagger';
// import {AuthGuard} from "@nestjs/passport";
// import {EventOwnerGuard} from '../../common/guards/event-owner.guard';

@ApiTags('Event')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: '이벤트(일정) 생성' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: '생성된 이벤트 반환' })
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateEventDto,
  ) {
    return this.eventService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '내 이벤트(일정) 전체 조회' })
  @ApiResponse({ status: 200, description: '이벤트 목록 반환',})
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '이벤트(일정) 단건 조회' })
  @ApiResponse({ status: 200, description: '이벤트 반환',})
  findOne(
      @Param('id') id: string,
  ) {
    return this.eventService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '내 이벤트(일정) 전체 조회' })
  @ApiResponse({ status: 200, description: '이벤트 목록 반환',})
  findAllByUserId(
      @Param('userId') userId: string,
  ) {
    return this.eventService.findAllByUser(userId);
  }

  @Get(':id/user/:userId')
  @ApiOperation({ summary: '이벤트(일정) 단건 조회' })
  @ApiResponse({ status: 200, description: '이벤트 반환',})
  findOneByUserId(
      @Param('userId') userId: string,
      @Param('id') id: string,
  ) {
    return this.eventService.findOneByUser(userId, id);
  }

  // @UseGuards(AuthGuard, EventOwnerGuard)
  @Put(':id')
  @ApiOperation({ summary: '이벤트(일정) 수정' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: '수정된 이벤트 반환',})
  update(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventService.update(userId, id, dto);
  }

  // @UseGuards(AuthGuard, EventOwnerGuard)
  @Delete(':id')
  @ApiOperation({ summary: '이벤트(일정) 삭제' })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  remove(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.eventService.remove(userId, id);
  }
}
