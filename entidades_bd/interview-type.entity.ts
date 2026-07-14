import { Entity } from 'typeorm';
import { BaseCatalogEntity } from './base-catalog.entity';

@Entity('interview_types')
export class InterviewType extends BaseCatalogEntity {}
