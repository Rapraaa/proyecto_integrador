import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string; //aca se envia la password normal y se hashea luego

  @ApiProperty({ example: 'John', description: 'Nombre del usuario' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Apellido del usuario' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'mid',
    description:
      'Nivel de seniority del usuario (debe existir en el catálogo seniority_levels)',
  })
  @IsString()
  @IsOptional()
  seniorityLevel?: string;

  @ApiPropertyOptional({
    description: 'Foto de perfil (URL o imagen en base64)',
  })
  @IsString()
  @IsOptional()
  profilePicture?: string;
}
