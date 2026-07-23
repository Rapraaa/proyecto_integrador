import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyQuestion } from '../entities/survey-question.entity';
import { SurveyOption } from '../entities/survey-option.entity';
import { SurveysService } from './surveys.service';
import { CreateSurveyQuestionDto } from '../dto/create-survey-question.dto';
import { UpdateSurveyQuestionDto } from '../dto/update-survey-question.dto';
import { CreateSurveyOptionDto } from '../dto/create-survey-option.dto';
import { UpdateSurveyOptionDto } from '../dto/update-survey-option.dto';
import { esPreguntaDeOpciones, QuestionType } from '../enums/question-type.enum';

@Injectable()
export class SurveyQuestionsService {
  constructor(
    @InjectRepository(SurveyQuestion)
    private readonly questionRepository: Repository<SurveyQuestion>,
    @InjectRepository(SurveyOption)
    private readonly optionRepository: Repository<SurveyOption>,
    private readonly surveysService: SurveysService,
  ) {}

  async findAllDeEncuesta(surveyId: string): Promise<SurveyQuestion[]> {
    await this.surveysService.findOne(surveyId);
    return await this.questionRepository.find({
      where: { survey: { id: surveyId } },
      relations: { options: true },
      order: { sortOrder: 'ASC', options: { sortOrder: 'ASC' } },
    });
  }

  async findOne(surveyId: string, questionId: string): Promise<SurveyQuestion> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId, survey: { id: surveyId } },
      relations: { options: true, survey: true },
      order: { options: { sortOrder: 'ASC' } },
    });
    if (!question) {
      throw new NotFoundException(
        `La pregunta ${questionId} no existe en la encuesta ${surveyId}`,
      );
    }
    return question;
  }

  async create(
    surveyId: string,
    createDto: CreateSurveyQuestionDto,
  ): Promise<SurveyQuestion> {
    const survey = await this.surveysService.findOne(surveyId);
    const question = this.questionRepository.create({
      survey,
      questionText: createDto.questionText,
      questionType: createDto.questionType ?? QuestionType.SINGLE_CHOICE,
      sortOrder: createDto.sortOrder ?? 0,
      isActive: createDto.isActive ?? true,
    });
    return await this.questionRepository.save(question);
  }

  async update(
    surveyId: string,
    questionId: string,
    updateDto: UpdateSurveyQuestionDto,
  ): Promise<SurveyQuestion> {
    const question = await this.findOne(surveyId, questionId);

    if (updateDto.questionText !== undefined) {
      question.questionText = updateDto.questionText;
    }
    if (updateDto.sortOrder !== undefined) {
      question.sortOrder = updateDto.sortOrder;
    }
    if (updateDto.isActive !== undefined) {
      question.isActive = updateDto.isActive;
    }

    if (updateDto.questionType !== undefined) {
      const pasaATexto = !esPreguntaDeOpciones(updateDto.questionType);
      if (pasaATexto && question.options?.length > 0) {
        throw new BadRequestException(
          'No se puede cambiar la pregunta a tipo texto porque todavía tiene opciones. Elimina primero sus opciones.',
        );
      }
      question.questionType = updateDto.questionType;
    }

    return await this.questionRepository.save(question);
  }

  async remove(
    surveyId: string,
    questionId: string,
  ): Promise<{ id: string; eliminada: boolean }> {
    const question = await this.findOne(surveyId, questionId);
    await this.questionRepository.remove(question);
    return { id: questionId, eliminada: true };
  }

  async agregarOpcion(
    surveyId: string,
    questionId: string,
    createDto: CreateSurveyOptionDto,
  ): Promise<SurveyOption> {
    const question = await this.findOne(surveyId, questionId);

    if (!esPreguntaDeOpciones(question.questionType)) {
      throw new BadRequestException(
        `Las preguntas de tipo "${question.questionType}" no admiten opciones`,
      );
    }

    const option = this.optionRepository.create({
      question,
      optionText: createDto.optionText,
      sortOrder: createDto.sortOrder ?? 0,
    });
    return await this.optionRepository.save(option);
  }

  async actualizarOpcion(
    surveyId: string,
    questionId: string,
    optionId: string,
    updateDto: UpdateSurveyOptionDto,
  ): Promise<SurveyOption> {
    const option = await this.buscarOpcion(surveyId, questionId, optionId);

    if (updateDto.optionText !== undefined) {
      option.optionText = updateDto.optionText;
    }
    if (updateDto.sortOrder !== undefined) {
      option.sortOrder = updateDto.sortOrder;
    }

    return await this.optionRepository.save(option);
  }

  async eliminarOpcion(
    surveyId: string,
    questionId: string,
    optionId: string,
  ): Promise<{ id: string; eliminada: boolean }> {
    const option = await this.buscarOpcion(surveyId, questionId, optionId);
    await this.optionRepository.remove(option);
    return { id: optionId, eliminada: true };
  }

  private async buscarOpcion(
    surveyId: string,
    questionId: string,
    optionId: string,
  ): Promise<SurveyOption> {
    await this.findOne(surveyId, questionId);
    const option = await this.optionRepository.findOne({
      where: { id: optionId, question: { id: questionId } },
    });
    if (!option) {
      throw new NotFoundException(
        `La opción ${optionId} no existe en la pregunta ${questionId}`,
      );
    }
    return option;
  }
}
