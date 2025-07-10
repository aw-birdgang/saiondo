import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';
import { createWinstonLogger } from '@common/logger/winston.logger';

@Injectable()
export class AuthService {
  private readonly logger = createWinstonLogger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (exists) throw new BadRequestException('이미 가입된 이메일입니다.');
    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hash,
        name: data.name,
        gender: data.gender,
        birthDate: new Date(),
      },
    });
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const { password, ...userInfo } = user;
    return {
      accessToken,
      user: userInfo,
    };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const { password, ...userInfo } = user;
    return {
      accessToken,
      user: userInfo,
    };
  }
}
