import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    example: '¿Qué es el event loop de Node.js?',
    description: 'Enunciado de la pregunta',
  })
  @IsString()
  @IsNotEmpty()
  enunciado: string;

  @ApiProperty({ example: 'technical', description: 'Tipo de entrevista' })
  @IsString()
  @IsNotEmpty()
  interview_type: string;

  @ApiProperty({ example: 'Node.js', description: 'Tecnología asociada' })
  @IsString()
  @IsNotEmpty()
  technology: string;

  @ApiProperty({ example: 'medium', description: 'Nivel de dificultad' })
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @ApiPropertyOptional({ description: 'Respuesta modelo' })
  @IsString()
  @IsOptional()
  respuesta_modelo?: string;

  @ApiPropertyOptional({ example: ['async'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
