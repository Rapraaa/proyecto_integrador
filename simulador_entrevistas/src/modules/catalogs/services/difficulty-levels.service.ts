import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DifficultyLevel } from '../entities/difficulty-level.entity';
import { BaseCatalogService } from '../base-catalog.service';

@Injectable()
export class DifficultyLevelsService extends BaseCatalogService<DifficultyLevel> {
  constructor(
    @InjectRepository(DifficultyLevel)
    repository: Repository<DifficultyLevel>,
  ) {
    super(repository, 'Nivel de dificultad');
  }
}
