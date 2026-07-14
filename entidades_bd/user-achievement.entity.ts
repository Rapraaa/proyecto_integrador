import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Achievement } from './achievement.entity';

//Join N:M entre usuarios y logros obtenidos.
@Entity('user_achievements')
@Unique(['user', 'achievement'])
export class UserAchievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Achievement, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'achievement_id' })
  achievement: Achievement;

  @CreateDateColumn({
    name: 'earned_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  earnedAt: Date;
}
