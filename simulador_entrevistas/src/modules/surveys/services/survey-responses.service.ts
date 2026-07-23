import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { paginate, PaginatedResult } from '../../../common/pagination/paginate';
import { SurveyResponse } from '../entities/survey-response.entity';
import { SurveyQuestion } from '../entities/survey-question.entity';
import { SurveysService } from './surveys.service';
import {
  RespuestaDeUsuarioDto,
  SubmitSurveyResponseDto,
} from '../dto/submit-survey-response.dto';
import { QuestionType } from '../enums/question-type.enum';
import { RoleOptions } from '../../users/enums/user-roles.enum';

@Injectable()
export class SurveyResponsesService {
  constructor(
    @InjectRepository(SurveyResponse)
    private readonly responseRepository: Repository<SurveyResponse>,
    @InjectRepository(SurveyQuestion)
    private readonly questionRepository: Repository<SurveyQuestion>,
    private readonly surveysService: SurveysService,
    private readonly dataSource: DataSource,
  ) {}

  async responder(
    userId: string,
    surveyId: string,
    dto: SubmitSurveyResponseDto,
  ): Promise<{ surveyId: string; respuestasGuardadas: number }> {
    const survey = await this.surveysService.findOne(surveyId);
    if (!survey.isActive) {
      throw new BadRequestException('Esta encuesta ya no admite respuestas');
    }

    const preguntas = await this.questionRepository.find({
      where: { survey: { id: surveyId } },
      relations: { options: true },
    });
    const preguntasPorId = new Map(preguntas.map((p) => [p.id, p]));

    const idsVistos = new Set<string>();
    const filas: Array<{
      questionId: string;
      optionId: string | null;
      freeText: string | null;
    }> = [];

    for (const respuesta of dto.answers) {
      if (idsVistos.has(respuesta.questionId)) {
        throw new BadRequestException(
          `La pregunta ${respuesta.questionId} viene repetida en el envío`,
        );
      }
      idsVistos.add(respuesta.questionId);

      const pregunta = preguntasPorId.get(respuesta.questionId);
      if (!pregunta) {
        throw new BadRequestException(
          `La pregunta ${respuesta.questionId} no pertenece a esta encuesta`,
        );
      }
      if (!pregunta.isActive) {
        throw new BadRequestException(
          `La pregunta ${respuesta.questionId} está inactiva y no admite respuestas`,
        );
      }

      filas.push(...this.construirFilas(pregunta, respuesta));
    }

    return await this.dataSource.transaction(async (manager) => {
      await manager.delete(SurveyResponse, {
        user: { id: userId },
        question: { id: In([...preguntasPorId.keys()]) },
      });

      const entidades = filas.map((fila) =>
        manager.create(SurveyResponse, {
          user: { id: userId },
          question: { id: fila.questionId },
          option: fila.optionId ? { id: fila.optionId } : null,
          freeText: fila.freeText,
        }),
      );
      await manager.save(SurveyResponse, entidades);

      return { surveyId, respuestasGuardadas: entidades.length };
    });
  }

  private construirFilas(
    pregunta: SurveyQuestion,
    respuesta: RespuestaDeUsuarioDto,
  ): Array<{ questionId: string; optionId: string | null; freeText: string | null }> {
    const seleccionadas = respuesta.optionIds ?? [];

    if (pregunta.questionType === QuestionType.TEXT) {
      if (seleccionadas.length > 0) {
        throw new BadRequestException(
          `La pregunta "${pregunta.questionText}" es de texto libre y no admite opciones`,
        );
      }
      if (!respuesta.freeText?.trim()) {
        throw new BadRequestException(
          `La pregunta "${pregunta.questionText}" requiere una respuesta de texto`,
        );
      }
      return [
        {
          questionId: pregunta.id,
          optionId: null,
          freeText: respuesta.freeText.trim(),
        },
      ];
    }

    if (seleccionadas.length === 0) {
      throw new BadRequestException(
        `La pregunta "${pregunta.questionText}" requiere al menos una opción seleccionada`,
      );
    }

    if (
      pregunta.questionType === QuestionType.SINGLE_CHOICE &&
      seleccionadas.length > 1
    ) {
      throw new BadRequestException(
        `La pregunta "${pregunta.questionText}" admite una sola opción`,
      );
    }

    if (new Set(seleccionadas).size !== seleccionadas.length) {
      throw new BadRequestException(
        `La pregunta "${pregunta.questionText}" tiene opciones repetidas`,
      );
    }

    const idsValidos = new Set((pregunta.options ?? []).map((o) => o.id));
    for (const optionId of seleccionadas) {
      if (!idsValidos.has(optionId)) {
        throw new BadRequestException(
          `La opción ${optionId} no pertenece a la pregunta "${pregunta.questionText}"`,
        );
      }
    }

    return seleccionadas.map((optionId) => ({
      questionId: pregunta.id,
      optionId,
      freeText: null,
    }));
  }

  async misRespuestas(
    userId: string,
    surveyId: string,
  ): Promise<SurveyResponse[]> {
    await this.surveysService.findOne(surveyId);
    return await this.responseRepository.find({
      where: { user: { id: userId }, question: { survey: { id: surveyId } } },
      relations: { question: true, option: true },
      order: { question: { sortOrder: 'ASC' } },
    });
  }

  async todasLasRespuestas(
    surveyId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<SurveyResponse>> {
    await this.surveysService.findOne(surveyId);
    return await paginate(this.responseRepository, query, {
      sortableFields: ['createdAt'],
      where: { question: { survey: { id: surveyId } } },
      relations: { question: true, option: true, user: true },
    });
  }

  async eliminar(
    userId: string,
    rol: string,
    responseId: string,
  ): Promise<{ id: string; eliminada: boolean }> {
    const respuesta = await this.responseRepository.findOne({
      where: { id: responseId },
      relations: { user: true },
    });
    if (!respuesta) {
      throw new NotFoundException(`Respuesta con ID ${responseId} no encontrada`);
    }
    if (respuesta.user.id !== userId && rol !== RoleOptions.ADMIN) {
      throw new ForbiddenException('No puedes eliminar respuestas de otro usuario');
    }
    await this.responseRepository.remove(respuesta);
    return { id: responseId, eliminada: true };
  }
}
