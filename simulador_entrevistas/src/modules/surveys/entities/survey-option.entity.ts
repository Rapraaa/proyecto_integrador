import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SurveyQuestion } from './survey-question.entity';

@Entity('survey_options')
export class SurveyOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SurveyQuestion, (question) => question.options, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: SurveyQuestion;

  @Column({ name: 'option_text', length: 255 })
  optionText: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;
}
