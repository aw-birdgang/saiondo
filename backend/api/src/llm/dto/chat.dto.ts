import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatRequestDto {
    @ApiProperty({ example: '안녕 GPT!', description: '보낼 프롬프트 메시지' })
    @IsString()
    prompt: string;
}

export class ChatResponseDto {
    @ApiProperty({ example: '안녕하세요! 무엇을 도와드릴까요?', description: 'LLM 응답 메시지' })
    response: string;
}
