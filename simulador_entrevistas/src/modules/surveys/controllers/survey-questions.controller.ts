import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RoleOptions } from '../../users/enums/user-roles.enum';
import { SurveyQuestionsService } from '../services/survey-questions.service';
import { CreateSurveyQuestionDto } from '../dto/create-survey-question.dto';
import { UpdateSurveyQuestionDto } from '../dto/update-survey-question.dto';
import { CreateSurveyOptionDto } from '../dto/create-survey-option.dto';
import { UpdateSurveyOptionDto } from '../dto/update-survey-option.dto';

@ApiTags('Encuestas')
@Controller('surveys/:surveyId/questions')
export class SurveyQuestionsController {
  constructor(private readonly service: SurveyQuestionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar las preguntas de una encuesta' })
  findAll(@Param('surveyId', ParseUUIDPipe) surveyId: string) {
    return this.service.findAllDeEncuesta(surveyId);
  }

  @Get(':questionId')
  @ApiOperation({ summary: 'Obtener una pregunta con sus opciones' })
  findOne(
    @Param('surveyId', ParseUUIDPipe) surveyId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    return this.service.findOne(surveyId, questionId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una pregunta en la encuesta (solo admin)' })
  create(
    @Param('surveyId', ParseUUIDPipe) surveyId: string,
    @Body() createDto: CreateSurveyQuestionDto,
  ) {
    return this.service.create(surveyId, createDto);
  }

  @Patch(':questionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una pregunta (solo admin)' })
  update(
    @Param('surveyId', ParseUUIDPipe) surveyId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Body() updateDto: UpdateSurveyQuestionDto,
  ) {
    return this.service.update(surveyId, questionId, updateDto);
  }

  @Delete(':questionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una pregunta y sus opciones (solo admin)' })
  remove(
    @Param('surveyId', ParseUUIDPipe) surveyId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    return this.service.remove(surveyId, questionId);
  }

  @Post(':questionId/options')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar una opción a la pregunta (solo admin)' })
  agregarOpcion(
    @Param('surveyId', ParseUUIDPipe) surveyId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Body() createDto: CreateSurveyOptionDto,
  ) {
    return this.service.agregarOpcion(surveyId, questionId, createDto);
  }

  @Patch(':questionId/options/:optionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una opción (solo admin)' })
  actualizarOpcion(
    @Param('surveyId', ParseUUIDPipe) surveyId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Param('optionId', ParseUUIDPipe) optionId: string,
    @Body() updateDto: UpdateSurveyOptionDto,
  ) {
    return this.service.actualizarOpcion(
      surveyId,
      questionId,
      optionId,
      updateDto,
    );
  }

  @Delete(':questionId/options/:optionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una opción (solo admin)' })
  eliminarOpcion(
    @Param('surveyId', ParseUUIDPipe) surveyId: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
    @Param('optionId', ParseUUIDPipe) optionId: string,
  ) {
    return this.service.eliminarOpcion(surveyId, questionId, optionId);
  }
}
