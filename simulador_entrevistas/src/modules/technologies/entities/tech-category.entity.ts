import { Entity } from 'typeorm';
import { BaseCatalogEntity } from '../../catalogs/entities/base-catalog.entity';

//Categoría de tecnología: lenguaje, framework, base de datos, devops...
@Entity('tech_categories')
export class TechCategory extends BaseCatalogEntity {}
