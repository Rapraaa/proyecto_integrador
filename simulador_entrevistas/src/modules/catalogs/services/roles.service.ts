import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { BaseCatalogService } from '../base-catalog.service';

@Injectable()
export class RolesService extends BaseCatalogService<Role> {
  constructor(
    @InjectRepository(Role)
    repository: Repository<Role>,
  ) {
    super(repository, 'Rol');
  }
}
