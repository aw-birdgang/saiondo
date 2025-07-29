import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { EventService } from '@modules/event/event.service';

@Injectable()
export class EventOwnerGuard implements CanActivate {
  constructor(private readonly eventService: EventService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const eventId = request.params.id;

    // GET /events (목록) 등에는 id가 없으므로, id 없으면 통과
    if (!eventId) return true;

    const event = await this.eventService.findRawById(eventId);
    if (!event) throw new NotFoundException('Event not found');
    if (event.userId !== user.id) throw new ForbiddenException('No permission for this event');

    return true;
  }
}
