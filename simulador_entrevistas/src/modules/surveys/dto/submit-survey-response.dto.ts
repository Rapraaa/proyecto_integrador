import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class RespuestaDeUsuarioDto {
  @ApiProperty({ description: 'ID de la pregunta que se está respondiendo' })
  @IsUUID()
  questionId: string;

  @ApiPropertyOptional({
    description:
      'Opciones seleccionadas. Una sola para single_choice, una o más para multiple_choice.',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  optionIds?: string[];

  @ApiPropertyOptional({ description: 'Texto libre, solo para preguntas de tipo text' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  freeText?: string;
}

export class SubmitSurveyResponseDto {
  @ApiProperty({ type: [RespuestaDeUsuarioDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RespuestaDeUsuarioDto)
  answers: RespuestaDeUsuarioDto[];
}
