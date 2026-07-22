import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserTechnologiesService } from '../services/user-technologies.service';
import { CreateUserTechnologyDto } from '../dto/create-user-technology.dto';
import { UpdateUserTechnologyDto } from '../dto/update-user-technology.dto';

interface RequestConUsuario {
  user: { id: string; email: string; role: string };
}

@ApiTags('Mi perfil')
@ApiBearerAuth()
@Controller('me/technologies')
@UseGuards(JwtAuthGuard)
export class UserTechnologiesController {
  constructor(private readonly service: UserTechnologiesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar las tecnologías de mi perfil' })
  listar(@Req() req: RequestConUsuario) {
    return this.service.listar(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Agregar una tecnología a mi perfil' })
  agregar(
    @Req() req: RequestConUsuario,
    @Body() createDto: CreateUserTechnologyDto,
  ) {
    return this.service.agregar(req.user.id, createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cambiar mi nivel en una tecnología' })
  actualizar(
    @Req() req: RequestConUsuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateUserTechnologyDto,
  ) {
    return this.service.actualizar(req.user.id, id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Quitar una tecnología de mi perfil' })
  eliminar(
    @Req() req: RequestConUsuario,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.eliminar(req.user.id, id);
  }
}
