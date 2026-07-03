import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeniorityLevel } from '../entities/seniority-level.entity';
import { SeniorityLevelsService } from '../services/seniority-levels.service';
import { BaseCatalogController } from '../base-catalog.controller';

@ApiTags('Catálogos')
@Controller('catalogs/seniority-levels')
export class SeniorityLevelsController extends BaseCatalogController<SeniorityLevel> {
  constructor(service: SeniorityLevelsService) {
    super(service);
  }
}
