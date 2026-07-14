import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../catalogs/entities/role.entity';
import { SeniorityLevel } from '../../catalogs/entities/seniority-level.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash', length: 255 }) //En SQL se usa snake_case, en JavaScriot se usa camelCase
  passwordHash: string;

  @Column({ name: 'first_name', length: 255, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 255, nullable: true })
  lastName: string;

  //FK al catálogo de roles (antes era un enum). eager para que el login
  //siempre tenga el rol disponible al firmar el JWT.
  //nullable a nivel de DB para no romper filas existentes con synchronize.
  @ManyToOne(() => Role, { eager: true, nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role | null;

  //FK al catálogo de seniority (antes era un enum)
  @ManyToOne(() => SeniorityLevel, { eager: true, nullable: true })
  @JoinColumn({ name: 'seniority_level_id' })
  seniorityLevel: SeniorityLevel | null;

  @Column({ name: 'is_blocked', default: false })
  isBlocked: boolean;

  @Column({ name: 'is_visually_impaired', default: false })
  isVisuallyImpaired: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP', //asi podemos usar funciones nativas de sql
  })
  createdAt: Date;
}
