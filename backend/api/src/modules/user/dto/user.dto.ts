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

    // (선택) birthDate도 프론트에서 입력받고 싶다면 아래 추가
    // @ApiProperty({ example: '1990-01-01', description: '생년월일(YYYY-MM-DD)' })
    // @IsString()
    // @IsNotEmpty()
    // birthDate: string;
}
