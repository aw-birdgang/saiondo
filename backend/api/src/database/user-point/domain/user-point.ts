import {ApiProperty} from "@nestjs/swagger";
import {CreateDateColumn, UpdateDateColumn} from "typeorm";


export class UserPoint {
    @ApiProperty({
        type: String,
        description: '고유 아이디',
    })
    id: string;

    @ApiProperty({
        type: String,
        description: 'userId',
    })
    userId: string;

    @ApiProperty({
        type: String,
        description: 'activityType',
    })
    activityType: string; // e.g., 'comment', 'like', 'share'

    @ApiProperty({
        type: Number,
        description: 'points',
    })
    points: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
