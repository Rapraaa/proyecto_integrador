import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobRole } from '../entities/job-role.entity';
import { JobRolesService } from '../services/job-roles.service';
import { BaseCatalogController } from '../base-catalog.controller';

@ApiTags('Catálogos')
@Controller('catalogs/job-roles')
export class JobRolesController extends BaseCatalogController<JobRole> {
  constructor(service: JobRolesService) {
    super(service);
  }
}
