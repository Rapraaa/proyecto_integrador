import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { SurveyQuestion } from './entities/survey-question.entity';
import { SurveyOption } from './entities/survey-option.entity';
import { SurveyResponse } from './entities/survey-response.entity';

//Los CRUD de este módulo se implementan en BACK-11.
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      SurveyQuestion,
      SurveyOption,
      SurveyResponse,
    ]),
  ],
})
export class SurveysModule {}
