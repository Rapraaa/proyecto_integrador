import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePromptTemplateDto {
  @ApiProperty({ example: 'entrevista-tecnica-backend' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Eres un entrevistador técnico senior. Evalúa al candidato en {{tecnologias}}.',
  })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({ description: 'Tipo de entrevista al que aplica' })
  @IsOptional()
  @IsUUID()
  interviewTypeId?: string;

  @ApiPropertyOptional({ description: 'Rol objetivo al que aplica' })
  @IsOptional()
  @IsUUID()
  jobRoleId?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
