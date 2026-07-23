import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { QuestionType, TIPOS_DE_PREGUNTA } from '../enums/question-type.enum';

export class CreateSurveyQuestionDto {
  @ApiProperty({ example: '¿Cuántos años de experiencia tienes?' })
  @IsString()
  @MinLength(3)
  questionText: string;

  @ApiPropertyOptional({
    enum: TIPOS_DE_PREGUNTA,
    default: QuestionType.SINGLE_CHOICE,
  })
  @IsOptional()
  @IsIn(TIPOS_DE_PREGUNTA)
  questionType?: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
