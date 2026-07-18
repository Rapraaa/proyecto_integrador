import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCatalogItemDto {
  @ApiProperty({ example: 'backend', description: 'Nombre único del ítem' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'Desarrollador orientado al servidor',
    description: 'Descripción del ítem',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true, description: 'Si el ítem está activo' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
