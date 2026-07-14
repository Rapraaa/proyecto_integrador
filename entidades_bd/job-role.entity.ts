import { Entity } from 'typeorm';
import { BaseCatalogEntity } from './base-catalog.entity';

@Entity('job_roles')
export class JobRole extends BaseCatalogEntity {}
