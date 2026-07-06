import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationCriterion } from '../entities/evaluation-criterion.entity';
import { BaseCatalogService } from '../../catalogs/base-catalog.service';

@Injectable()
export class EvaluationCriteriaService extends BaseCatalogService<EvaluationCriterion> {
  constructor(
    @InjectRepository(EvaluationCriterion)
    repository: Repository<EvaluationCriterion>,
  ) {
    super(repository, 'Criterio de evaluación');
  }
}
