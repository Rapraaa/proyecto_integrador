import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTechnologyDto {
  @ApiProperty({ example: 'React', description: 'Nombre único de la tecnología' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: '9f1b0f6c-1f2a-4b3c-8d4e-5a6b7c8d9e0f',
    description: 'ID de la categoría a la que pertenece',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
