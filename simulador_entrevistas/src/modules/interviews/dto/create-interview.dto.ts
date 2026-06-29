import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInterviewDto {
  @ApiProperty({ example: 'technical', description: 'Tipo de entrevista' })
  @IsString()
  @IsNotEmpty()
  interview_type: string;

  @ApiProperty({ example: 'backend', description: 'Rol objetivo' })
  @IsString()
  @IsNotEmpty()
  target_role: string;

  @ApiProperty({ example: 'Senior', description: 'Nivel de seniority' })
  @IsString()
  @IsNotEmpty()
  seniority: string;

  @ApiProperty({
    example: ['Node.js', 'NestJS'],
    description: 'Tecnologías objetivo',
  })
  @IsArray()
  @IsString({ each: true })
  technologies: string[];
}
