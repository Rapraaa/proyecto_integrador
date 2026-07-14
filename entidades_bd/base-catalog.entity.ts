import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

//Clase base para todas las tablas de catálogo (roles, seniority, etc.)
//No lleva @Entity: cada catálogo concreto define su propia tabla.
export abstract class BaseCatalogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
