import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement CRUD operations for tickets
  // - create(eventId, createTicketDto)
  // - findAll(eventId)
  // - findOne(id)
  // - update(id, updateTicketDto)
  // - remove(id)
  // - checkAvailability(id)
}
