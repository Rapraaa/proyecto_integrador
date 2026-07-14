import { Entity } from 'typeorm';
import { BaseCatalogEntity } from './base-catalog.entity';

@Entity('roles')
export class Role extends BaseCatalogEntity {}
