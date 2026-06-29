import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    example: 'La respuesta es...',
    description: 'Respuesta del candidato',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false, description: 'Código opcional enviado' })
  @IsOptional()
  @IsString()
  code_snippet?: string;
}
