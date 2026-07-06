import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';
import { RolesService } from '../services/roles.service';
import { BaseCatalogController } from '../base-catalog.controller';

@ApiTags('Catálogos')
@Controller('catalogs/roles')
export class RolesController extends BaseCatalogController<Role> {
  constructor(service: RolesService) {
    super(service);
  }
}
