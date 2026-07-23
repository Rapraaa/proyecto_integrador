import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateSurveyOptionDto {
  @ApiProperty({ example: 'Menos de 1 año' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  optionText: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
