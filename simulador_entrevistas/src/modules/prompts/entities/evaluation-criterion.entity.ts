import { Column, Entity } from 'typeorm';
import { BaseCatalogEntity } from '../../catalogs/entities/base-catalog.entity';

//Criterios con los que la IA genera el reporte final (claridad, correctitud...).
@Entity('evaluation_criteria')
export class EvaluationCriterion extends BaseCatalogEntity {
  //peso relativo del criterio en el score final
  @Column({ type: 'int', default: 1 })
  weight: number;
}
