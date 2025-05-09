import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  // Room은 특별히 수정할 필드가 없다면 비워둘 수 있음
}