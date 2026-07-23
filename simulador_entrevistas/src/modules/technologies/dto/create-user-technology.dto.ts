import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { NIVELES_DE_TECNOLOGIA } from '../enums/technology-level.enum';

export class CreateUserTechnologyDto {
  @ApiProperty({ description: 'ID de la tecnología del catálogo' })
  @IsUUID()
  technologyId: string;

  @ApiPropertyOptional({ enum: NIVELES_DE_TECNOLOGIA })
  @IsOptional()
  @IsIn(NIVELES_DE_TECNOLOGIA)
  level?: string;
}
