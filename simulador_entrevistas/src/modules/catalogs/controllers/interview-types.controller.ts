import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InterviewType } from '../entities/interview-type.entity';
import { InterviewTypesService } from '../services/interview-types.service';
import { BaseCatalogController } from '../base-catalog.controller';

@ApiTags('Catálogos')
@Controller('catalogs/interview-types')
export class InterviewTypesController extends BaseCatalogController<InterviewType> {
  constructor(service: InterviewTypesService) {
    super(service);
  }
}
