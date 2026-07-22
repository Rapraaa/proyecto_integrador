import { PartialType } from '@nestjs/swagger';
import { CreateSurveyOptionDto } from './create-survey-option.dto';

export class UpdateSurveyOptionDto extends PartialType(CreateSurveyOptionDto) {}
