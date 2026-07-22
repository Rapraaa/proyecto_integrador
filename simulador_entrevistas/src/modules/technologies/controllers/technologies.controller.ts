import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RoleOptions } from '../../users/enums/user-roles.enum';
import { TechnologiesService } from '../services/technologies.service';
import { CreateTechnologyDto } from '../dto/create-technology.dto';
import { UpdateTechnologyDto } from '../dto/update-technology.dto';

@ApiTags('Tecnologías')
@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly service: TechnologiesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tecnologías con búsqueda, paginación y orden' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tecnología por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una tecnología (solo admin)' })
  create(@Body() createDto: CreateTechnologyDto) {
    return this.service.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una tecnología (solo admin)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateTechnologyDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una tecnología (solo admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
