// api/src/modules/user/user.dto.ts
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

export class CreateUserDto {
    @ApiProperty({ example: '홍길동' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'MALE', enum: Gender })
    @IsEnum(Gender)
    gender: Gender;
}
