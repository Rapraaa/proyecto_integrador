import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeniorityLevel } from '../entities/seniority-level.entity';
import { BaseCatalogService } from '../base-catalog.service';

@Injectable()
export class SeniorityLevelsService extends BaseCatalogService<SeniorityLevel> {
  constructor(
    @InjectRepository(SeniorityLevel)
    repository: Repository<SeniorityLevel>,
  ) {
    super(repository, 'Nivel de seniority');
  }
}
