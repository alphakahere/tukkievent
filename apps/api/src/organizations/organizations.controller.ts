import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  // TODO: Implement endpoints
  // - POST / (create organization)
  // - GET / (get user's organizations)
  // - GET /:id (get organization details)
  // - PATCH /:id (update organization)
  // - DELETE /:id (delete organization)
  // - POST /:id/members (invite member)
  // - PATCH /:id/members/:userId (update member role)
  // - DELETE /:id/members/:userId (remove member)
}
