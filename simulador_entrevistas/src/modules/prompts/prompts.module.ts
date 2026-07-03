import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptTemplate } from './entities/prompt-template.entity';
import { EvaluationCriterion } from './entities/evaluation-criterion.entity';

//Los CRUD de este módulo se implementan en BACK-12.
@Module({
  imports: [TypeOrmModule.forFeature([PromptTemplate, EvaluationCriterion])],
})
export class PromptsModule {}
