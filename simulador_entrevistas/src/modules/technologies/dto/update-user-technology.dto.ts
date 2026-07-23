import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { NIVELES_DE_TECNOLOGIA } from '../enums/technology-level.enum';

export class UpdateUserTechnologyDto {
  @ApiPropertyOptional({ enum: NIVELES_DE_TECNOLOGIA })
  @IsOptional()
  @IsIn(NIVELES_DE_TECNOLOGIA)
  level?: string;
}
