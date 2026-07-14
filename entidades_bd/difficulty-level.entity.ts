import { Column, Entity } from 'typeorm';
import { BaseCatalogEntity } from './base-catalog.entity';

@Entity('difficulty_levels')
export class DifficultyLevel extends BaseCatalogEntity {
  //orden de menor a mayor dificultad (easy=1, medium=2, hard=3)
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;
}
