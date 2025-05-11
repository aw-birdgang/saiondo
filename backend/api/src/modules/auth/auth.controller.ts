import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: '회원가입' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: '회원가입 성공, 유저 정보 반환' })
    @ApiResponse({ status: 400, description: '잘못된 요청' })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({ summary: '로그인' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: '로그인 성공, accessToken과 유저 정보 반환',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 'uuid-1234',
                    email: 'kim@example.com',
                    name: '홍길동',
                    gender: 'MALE',
                    birthDate: '1990-01-01T00:00:00.000Z',
                    createdAt: '...',
                    updatedAt: '...'
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: '인증 실패' })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
