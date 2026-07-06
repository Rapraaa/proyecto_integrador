import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InterviewType } from '../../catalogs/entities/interview-type.entity';
import { JobRole } from '../../catalogs/entities/job-role.entity';

//Plantillas de System Prompt gestionables por el admin sin tocar código
//(doc sección 3: el admin refina los prompts base de la IA).
@Entity('prompt_templates')
export class PromptTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => InterviewType, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'interview_type_id' })
  interviewType: InterviewType | null;

  @ManyToOne(() => JobRole, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'job_role_id' })
  jobRole: JobRole | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
