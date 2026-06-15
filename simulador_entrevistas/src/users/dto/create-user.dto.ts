import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { SeniorityLevels } from '../enums/user-roles.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string; //aca se envia la password normal y se hashea luego

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsEnum(SeniorityLevels, {
    message:
      'El nivel de seniority debe ser: trainee, junior, mid, senior o lead',
  })
  seniority_level: SeniorityLevels;
}
