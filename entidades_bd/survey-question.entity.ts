import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Survey } from './survey.entity';
import { SurveyOption } from './survey-option.entity';

@Entity('survey_questions')
export class SurveyQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Survey, (survey) => survey.questions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;

  @Column({ name: 'question_text', type: 'text' })
  questionText: string;

  //single_choice | multiple_choice | text
  @Column({ name: 'question_type', length: 30, default: 'single_choice' })
  questionType: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => SurveyOption, (option) => option.question)
  options: SurveyOption[];
}
