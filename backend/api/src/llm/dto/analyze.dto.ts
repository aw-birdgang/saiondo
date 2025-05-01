import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeRequestDto {
    @ApiProperty()
    @IsString()
    user_prompt: string;

    @ApiProperty()
    @IsString()
    partner_prompt: string;

    @ApiProperty()
    @IsString()
    @IsIn(['male', 'female'])
    user_gender: 'male' | 'female';

    @ApiProperty()
    @IsString()
    @IsIn(['male', 'female'])
    partner_gender: 'male' | 'female';

    @ApiProperty()
    @IsString()
    @IsIn(['openai', 'claude'])
    model: 'openai' | 'claude';
}

export class AnalyzeResponseDto {
    @ApiProperty()
    user_traits: string;

    @ApiProperty()
    match_result: string;

    @ApiProperty()
    advice: string;
}
