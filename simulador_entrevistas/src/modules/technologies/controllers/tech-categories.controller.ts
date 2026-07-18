import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TechCategory } from '../entities/tech-category.entity';
import { TechCategoriesService } from '../services/tech-categories.service';
import { BaseCatalogController } from '../../catalogs/base-catalog.controller';

@ApiTags('Tecnologías')
@Controller('tech-categories')
export class TechCategoriesController extends BaseCatalogController<TechCategory> {
  constructor(service: TechCategoriesService) {
    super(service);
  }
}
