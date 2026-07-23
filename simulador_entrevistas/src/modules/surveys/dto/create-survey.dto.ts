import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSurveyDto {
  @ApiProperty({ example: 'Encuesta de contextualización' })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional({
    example: 'Nos ayuda a adaptar la entrevista a tu perfil.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
