import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { SurveyQuestion } from './entities/survey-question.entity';
import { SurveyOption } from './entities/survey-option.entity';
import { SurveyResponse } from './entities/survey-response.entity';
import { SurveysService } from './services/surveys.service';
import { SurveyQuestionsService } from './services/survey-questions.service';
import { SurveyResponsesService } from './services/survey-responses.service';
import { SurveysController } from './controllers/surveys.controller';
import { SurveyQuestionsController } from './controllers/survey-questions.controller';
import { SurveyResponsesController } from './controllers/survey-responses.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      SurveyQuestion,
      SurveyOption,
      SurveyResponse,
    ]),
  ],
  controllers: [
    SurveysController,
    SurveyQuestionsController,
    SurveyResponsesController,
  ],
  providers: [SurveysService, SurveyQuestionsService, SurveyResponsesService],
  exports: [SurveysService, SurveyResponsesService],
})
export class SurveysModule {}
