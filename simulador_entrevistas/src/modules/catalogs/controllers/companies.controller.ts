import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';
import { CompaniesService } from '../services/companies.service';
import { BaseCatalogController } from '../base-catalog.controller';

@ApiTags('Catálogos')
@Controller('catalogs/companies')
export class CompaniesController extends BaseCatalogController<Company> {
  constructor(service: CompaniesService) {
    super(service);
  }
}
