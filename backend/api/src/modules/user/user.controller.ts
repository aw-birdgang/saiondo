import { Body, Controller, Get, Post, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.services';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {CreateUserDto} from "@modules/user/dto/user.dto";

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: '모든 유저 조회' })
    @ApiResponse({ status: 200, description: '유저 목록 반환', type: [CreateUserDto] })
    async findAll() {
        return this.userService.findAll();
    }

    @Post()
    @ApiOperation({ summary: '유저 생성' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: '생성된 유저 반환', type: CreateUserDto })
    @ApiResponse({ status: 400, description: '잘못된 요청' })
    async create(@Body() body: CreateUserDto) {
        try {
            return await this.userService.createUser(body);
        } catch (e) {
            throw new HttpException(e.message || '유저 생성 실패', HttpStatus.BAD_REQUEST);
        }
    }
}
