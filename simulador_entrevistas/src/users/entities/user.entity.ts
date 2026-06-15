import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RoleOptions } from '../enums/user-roles.enum';
import { SeniorityLevels } from '../enums/user-seniority.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash', length: 255 }) //En SQL se usa snake_case, en JavaScriot se usa camelCase
  passwordHash: string;

  @Column({ name: 'first_name', length: 255, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 255, nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: RoleOptions,
    default: RoleOptions.USER,
  })
  role: RoleOptions;

  @Column({ name: 'seniority_levels', type: 'enum', enum: SeniorityLevels })
  seniorityLevel: SeniorityLevels;

  @Column({ name: 'is_visually_impaired', default: false })
  isVisuallyImpaired: boolean;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
