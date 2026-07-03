import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobRole } from '../entities/job-role.entity';
import { BaseCatalogService } from '../base-catalog.service';

@Injectable()
export class JobRolesService extends BaseCatalogService<JobRole> {
  constructor(
    @InjectRepository(JobRole)
    repository: Repository<JobRole>,
  ) {
    super(repository, 'Rol objetivo');
  }
}
