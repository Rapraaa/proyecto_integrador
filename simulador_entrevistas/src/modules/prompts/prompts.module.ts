import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptTemplate } from './entities/prompt-template.entity';
import { EvaluationCriterion } from './entities/evaluation-criterion.entity';
import { EvaluationCriteriaService } from './services/evaluation-criteria.service';
import { EvaluationCriteriaController } from './controllers/evaluation-criteria.controller';

//El CRUD de prompt_templates se implementa en BACK-12.
@Module({
  imports: [TypeOrmModule.forFeature([PromptTemplate, EvaluationCriterion])],
  controllers: [EvaluationCriteriaController],
  providers: [EvaluationCriteriaService],
  exports: [EvaluationCriteriaService],
})
export class PromptsModule {}
