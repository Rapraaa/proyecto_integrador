import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EvaluationCriterion } from '../entities/evaluation-criterion.entity';
import { EvaluationCriteriaService } from '../services/evaluation-criteria.service';
import { BaseCatalogController } from '../../catalogs/base-catalog.controller';

@ApiTags('Criterios de evaluación')
@Controller('evaluation-criteria')
export class EvaluationCriteriaController extends BaseCatalogController<EvaluationCriterion> {
  constructor(service: EvaluationCriteriaService) {
    super(service);
  }
}
