import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { SeniorityLevels } from '../enums/user-seniority.enum';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    example: 'mid',
    description: 'Nivel de seniority del usuario',
  })
  @IsEnum(SeniorityLevels, {
    message:
      'El nivel de seniority debe ser: trainee, junior, mid, senior o lead',
  })
  seniorityLevel: SeniorityLevels;
}
