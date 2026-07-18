import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DifficultyLevel } from '../entities/difficulty-level.entity';
import { DifficultyLevelsService } from '../services/difficulty-levels.service';
import { BaseCatalogController } from '../base-catalog.controller';

@ApiTags('Catálogos')
@Controller('catalogs/difficulty-levels')
export class DifficultyLevelsController extends BaseCatalogController<DifficultyLevel> {
  constructor(service: DifficultyLevelsService) {
    super(service);
  }
}
