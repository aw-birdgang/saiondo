import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany();
    }

    async createUser(data: { name: string; gender: string }) {
        return this.prisma.user.create({
            data: {
                name: data.name,
                gender: data.gender as any,
                birthDate: new Date(),
            },
        });
    }
}
