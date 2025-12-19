import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Events')
@Controller('events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // TODO: Implement endpoints
  // - POST / (create event)
  // - GET / (get all events with filters)
  // - GET /:id (get event details)
  // - GET /slug/:slug (get event by slug)
  // - PATCH /:id (update event)
  // - DELETE /:id (delete event)
  // - POST /:id/publish (publish event)
  // - POST /:id/unpublish (unpublish event)
  // - GET /:id/stats (get event statistics)
}
