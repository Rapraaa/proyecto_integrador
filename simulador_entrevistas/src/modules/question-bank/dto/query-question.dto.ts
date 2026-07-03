import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryQuestionDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'technical' })
  @IsOptional()
  @IsString()
  interview_type?: string;

  @ApiPropertyOptional({ example: 'Node.js' })
  @IsOptional()
  @IsString()
  technology?: string;

  @ApiPropertyOptional({ example: 'medium' })
  @IsOptional()
  @IsString()
  difficulty?: string;
}
