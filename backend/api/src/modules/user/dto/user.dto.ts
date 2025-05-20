// api/src/modules/user/user.dto.ts
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

export class CreateUserDto {
    @ApiProperty({ example: '홍길동', description: '유저 이름' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'MALE', description: '성별(MALE/FEMALE/OTHER)' })
    @IsEnum(Gender)
    gender: Gender;

    @ApiProperty({ example: 'test@example.com', description: '이메일' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: '비밀번호' })
    @IsString()
    @IsNotEmpty()
    password: string;

}
