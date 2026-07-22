import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptTemplate } from './entities/prompt-template.entity';
import { EvaluationCriterion } from './entities/evaluation-criterion.entity';
import { InterviewType } from '../catalogs/entities/interview-type.entity';
import { JobRole } from '../catalogs/entities/job-role.entity';
import { EvaluationCriteriaService } from './services/evaluation-criteria.service';
import { EvaluationCriteriaController } from './controllers/evaluation-criteria.controller';
import { PromptTemplatesService } from './services/prompt-templates.service';
import { PromptTemplatesController } from './controllers/prompt-templates.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromptTemplate,
      EvaluationCriterion,
      InterviewType,
      JobRole,
    ]),
  ],
  controllers: [EvaluationCriteriaController, PromptTemplatesController],
  providers: [EvaluationCriteriaService, PromptTemplatesService],
  exports: [EvaluationCriteriaService, PromptTemplatesService],
})
export class PromptsModule {}
