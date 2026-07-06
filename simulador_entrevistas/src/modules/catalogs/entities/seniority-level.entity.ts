import { Column, Entity } from 'typeorm';
import { BaseCatalogEntity } from './base-catalog.entity';

@Entity('seniority_levels')
export class SeniorityLevel extends BaseCatalogEntity {
  //orden de menor a mayor experiencia (trainee=1 ... lead=5)
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;
}
