import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import type { RequestConUsuario } from '../../../common/types/request-con-usuario';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RoleOptions } from '../../users/enums/user-roles.enum';
import { SurveyResponsesService } from '../services/survey-responses.service';
import { SubmitSurveyResponseDto } from '../dto/submit-survey-response.dto';

@ApiTags('Encuestas')
@ApiBearerAuth()
@Controller('surveys/:surveyId/responses')
@UseGuards(JwtAuthGuard)
export class SurveyResponsesController {
  constructor(private readonly service: SurveyResponsesService) {}

  @Post()
  @ApiOperation({
    summary:
      'Responder la encuesta. Reemplaza las respuestas previas del usuario en esa encuesta.',
  })
  responder(
    @Req() req: RequestConUsuario,
    @Param('surveyId', ParseUUIDPipe) surveyId: string,
    @Body() dto: SubmitSurveyResponseDto,
  ) {
    return this.service.responder(req.user.id, surveyId, dto);
  }

  @Get('mias')
  @ApiOperation({ summary: 'Ver mis respuestas de esta encuesta' })
  misRespuestas(
    @Req() req: RequestConUsuario,
    @Param('surveyId', ParseUUIDPipe) surveyId: string,
  ) {
    return this.service.misRespuestas(req.user.id, surveyId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiOperation({
    summary: 'Ver todas las respuestas de la encuesta (solo admin)',
  })
  todas(
    @Param('surveyId', ParseUUIDPipe) surveyId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.service.todasLasRespuestas(surveyId, query);
  }

  @Delete(':responseId')
  @ApiOperation({
    summary: 'Eliminar una respuesta propia; un admin puede eliminar cualquiera',
  })
  eliminar(
    @Req() req: RequestConUsuario,
    @Param('responseId', ParseUUIDPipe) responseId: string,
  ) {
    return this.service.eliminar(req.user.id, req.user.role, responseId);
  }
}
