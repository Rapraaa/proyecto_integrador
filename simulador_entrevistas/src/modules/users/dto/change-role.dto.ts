import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleOptions } from '../enums/user-roles.enum';

export class ChangeRoleDto {
  @ApiProperty({
    enum: RoleOptions,
    example: RoleOptions.ADMIN,
    description: 'Nombre del rol a asignar (debe existir en el catálogo)',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn([RoleOptions.USER, RoleOptions.ADMIN])
  role: string;
}
