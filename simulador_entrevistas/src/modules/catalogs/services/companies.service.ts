import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { BaseCatalogService } from '../base-catalog.service';

@Injectable()
export class CompaniesService extends BaseCatalogService<Company> {
  constructor(
    @InjectRepository(Company)
    repository: Repository<Company>,
  ) {
    super(repository, 'Empresa');
  }
}
