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
import { SurveysService } from '../services/surveys.service';
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { UpdateSurveyDto } from '../dto/update-survey.dto';

@ApiTags('Encuestas')
@Controller('surveys')
export class SurveysController {
  constructor(private readonly service: SurveysService) {}

  @Get()
  @ApiOperation({ summary: 'Listar encuestas con búsqueda, paginación y orden' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una encuesta con sus preguntas y opciones ordenadas',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOneConPreguntas(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una encuesta (solo admin)' })
  create(@Body() createDto: CreateSurveyDto) {
    return this.service.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una encuesta (solo admin)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateSurveyDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Eliminar una encuesta con sus preguntas, opciones y respuestas (solo admin)',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
