import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.services';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@modules/user/dto/user.dto';
import { UpdateFcmTokenDto } from '@modules/user/dto/update-fcm-token.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '모든 유저 조회' })
  @ApiResponse({
    status: 200,
    description: '유저 목록 반환',
    type: [CreateUserDto],
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: '유저 생성' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: '생성된 유저 반환',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async create(@Body() body: CreateUserDto) {
    try {
      return await this.userService.createUser(body);
    } catch (e) {
      throw new HttpException(e.message || '유저 생성 실패', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'userId로 유저 단건 조회' })
  @ApiParam({ name: 'id', description: '유저 ID' })
  @ApiResponse({
    status: 200,
    description: '유저 정보 반환',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: '유저를 찾을 수 없음' })
  async findById(@Param('id') userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Get(':id/assistants')
  @ApiOperation({ summary: 'userId로 해당 유저의 Assistant 목록 조회' })
  @ApiParam({ name: 'id', description: '유저 ID' })
  @ApiResponse({
    status: 200,
    description: 'Assistant 목록 반환',
    type: Object /* 실제 AssistantDto로 교체 가능 */,
  })
  async findAssistantsByUserId(@Param('id') userId: string) {
    const assistants = await this.userService.findAssistantsByUserId(userId);
    return assistants;
  }

  @Patch(':id/fcm-token')
  @ApiOperation({ summary: '유저의 FCM 토큰 업데이트' })
  @ApiParam({ name: 'id', description: '유저 ID' })
  @ApiBody({ type: UpdateFcmTokenDto })
  @ApiResponse({ status: 200, description: '업데이트된 유저 정보 반환' })
  async updateFcmToken(@Param('id') userId: string, @Body() body: UpdateFcmTokenDto) {
    return this.userService.updateFcmToken(userId, body.fcmToken);
  }
}
