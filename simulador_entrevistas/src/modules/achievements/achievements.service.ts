import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { BaseCatalogService } from '../catalogs/base-catalog.service';

@Injectable()
export class AchievementsService extends BaseCatalogService<Achievement> {
  constructor(
    @InjectRepository(Achievement)
    repository: Repository<Achievement>,
  ) {
    super(repository, 'Logro');
  }
}
