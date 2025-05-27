import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ChatHistoryResponseDto {
    @ApiProperty({ example: '상담을 위해 최근 다툰 구체적인 예시를 말씀해주실 수 있나요?' })
    @IsString()
    response: string;
}
