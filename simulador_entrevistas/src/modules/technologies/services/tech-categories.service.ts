import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechCategory } from '../entities/tech-category.entity';
import { BaseCatalogService } from '../../catalogs/base-catalog.service';

@Injectable()
export class TechCategoriesService extends BaseCatalogService<TechCategory> {
  constructor(
    @InjectRepository(TechCategory)
    repository: Repository<TechCategory>,
  ) {
    super(repository, 'Categoría de tecnología');
  }
}
