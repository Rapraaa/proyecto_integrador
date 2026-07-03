import { Column, Entity } from 'typeorm';
import { BaseCatalogEntity } from './base-catalog.entity';

//Empresa objetivo de la práctica: permite que la IA adapte el estilo de la
//entrevista (startup, banca, big tech...) vía prompt.
@Entity('companies')
export class Company extends BaseCatalogEntity {
  @Column({ length: 100, nullable: true })
  industry: string | null;
}
