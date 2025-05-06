import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import {CreateUserDto} from "@modules/user/dto/user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany();
    }

    async createUser(data: CreateUserDto) {
        if (!data.name || !data.gender) {
            throw new BadRequestException('이름과 성별은 필수 입니다.');
        }
        return this.prisma.user.create({
            data: {
                name: data.name,
                gender: data.gender,
                birthDate: new Date(),
            },
        });
    }
}
