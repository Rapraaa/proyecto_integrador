import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Achievement } from './entities/achievement.entity';
import { AchievementsService } from './achievements.service';
import { BaseCatalogController } from '../catalogs/base-catalog.controller';

@ApiTags('Logros')
@Controller('achievements')
export class AchievementsController extends BaseCatalogController<Achievement> {
  constructor(service: AchievementsService) {
    super(service);
  }
}
