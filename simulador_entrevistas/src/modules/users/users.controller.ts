import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleOptions } from './enums/user-roles.enum';

interface RequestConUsuario {
  user: { id: string; email: string; role: string };
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Verifica que quien pide sea el dueño del recurso o un administrador.
  private verificarPropioOAdmin(req: RequestConUsuario, id: string) {
    if (req.user.id !== id && req.user.role !== RoleOptions.ADMIN) {
      throw new ForbiddenException('No tienes permiso sobre este usuario');
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los usuarios (solo admin)' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 403, description: 'Requiere rol de administrador' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID (dueño o admin)' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin permiso sobre este usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Req() req: RequestConUsuario, @Param('id') id: string) {
    this.verificarPropioOAdmin(req, id);
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por ID (dueño o admin)' })
  @ApiParam({ name: 'id', description: 'ID del usuario a modificar' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin permiso sobre este usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(
    @Req() req: RequestConUsuario,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.verificarPropioOAdmin(req, id);
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiOperation({ summary: 'Cambiar el rol de un usuario (solo admin)' })
  @ApiParam({ name: 'id', description: 'ID del usuario a promover/degradar' })
  @ApiResponse({ status: 200, description: 'Rol actualizado exitosamente' })
  @ApiResponse({ status: 403, description: 'Requiere rol de administrador' })
  cambiarRol(@Param('id') id: string, @Body() dto: ChangeRoleDto) {
    return this.usersService.changeRole(id, dto.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiOperation({ summary: 'Eliminar un usuario por ID (solo admin)' })
  @ApiParam({ name: 'id', description: 'ID del usuario a eliminar' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 403, description: 'Requiere rol de administrador' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
