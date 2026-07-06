import { Column, Entity } from 'typeorm';
import { BaseCatalogEntity } from '../../catalogs/entities/base-catalog.entity';

//Logros del dashboard (RF-06): primera entrevista, racha de 5, score > 80...
@Entity('achievements')
export class Achievement extends BaseCatalogEntity {
  //nombre de icono o emoji para el frontend
  @Column({ length: 50, nullable: true })
  icon: string | null;
}
