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
                email: data.email,
                password: data.password,
            },
        });
    }

    async getRoomsByUserId(userId: string) {
        // user가 user1 또는 user2인 모든 relationship 조회
        const relationships = await this.prisma.relationship.findMany({
            where: {
                OR: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            },
            include: { room: true }
        });

        // room이 연결된 relationship만 필터링
        return relationships
            .filter(r => r.room)
            .map(r => r.room);
    }

    async findById(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }
}
