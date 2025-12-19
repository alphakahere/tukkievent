import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // TODO: Implement endpoints
  // - POST /events/:eventId/tickets (create ticket)
  // - GET /events/:eventId/tickets (get event tickets)
  // - GET /:id (get ticket details)
  // - PATCH /:id (update ticket)
  // - DELETE /:id (delete ticket)
  // - GET /:id/availability (check ticket availability)
}
