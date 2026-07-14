import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SurveyQuestion } from './survey-question.entity';
import { SurveyOption } from './survey-option.entity';

@Entity('survey_responses')
export class SurveyResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => SurveyQuestion, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: SurveyQuestion;

  //nullable: las preguntas de texto libre no tienen opción seleccionada
  @ManyToOne(() => SurveyOption, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'option_id' })
  option: SurveyOption | null;

  @Column({ name: 'free_text', type: 'text', nullable: true })
  freeText: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
