import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Technology } from './technology.entity';

//Join N:M entre usuarios y tecnologías: los skills declarados por el usuario.
@Entity('user_technologies')
@Unique(['user', 'technology'])
export class UserTechnology {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Technology, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'technology_id' })
  technology: Technology;

  //nivel autodeclarado: basic | intermediate | advanced
  @Column({ length: 20, nullable: true })
  level: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
