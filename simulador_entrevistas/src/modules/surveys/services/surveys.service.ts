import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { paginate, PaginatedResult } from '../../../common/pagination/paginate';
import { Survey } from '../entities/survey.entity';
import { CreateSurveyDto } from '../dto/create-survey.dto';
import { UpdateSurveyDto } from '../dto/update-survey.dto';

@Injectable()
export class SurveysService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
  ) {}

  async create(createDto: CreateSurveyDto): Promise<Survey> {
    const survey = this.surveyRepository.create({
      title: createDto.title,
      description: createDto.description ?? null,
      isActive: createDto.isActive ?? true,
    });
    return await this.surveyRepository.save(survey);
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<Survey>> {
    return await paginate(this.surveyRepository, query, {
      searchFields: ['title'],
      sortableFields: ['title', 'createdAt', 'isActive'],
    });
  }

  async findOne(id: string): Promise<Survey> {
    const survey = await this.surveyRepository.findOneBy({ id });
    if (!survey) {
      throw new NotFoundException(`Encuesta con ID ${id} no encontrada`);
    }
    return survey;
  }

  async findOneConPreguntas(id: string): Promise<Survey> {
    const survey = await this.surveyRepository.findOne({
      where: { id },
      relations: { questions: { options: true } },
      order: {
        questions: {
          sortOrder: 'ASC',
          options: { sortOrder: 'ASC' },
        },
      },
    });
    if (!survey) {
      throw new NotFoundException(`Encuesta con ID ${id} no encontrada`);
    }
    return survey;
  }

  async update(id: string, updateDto: UpdateSurveyDto): Promise<Survey> {
    const survey = await this.findOne(id);

    if (updateDto.title !== undefined) survey.title = updateDto.title;
    if (updateDto.description !== undefined) {
      survey.description = updateDto.description;
    }
    if (updateDto.isActive !== undefined) survey.isActive = updateDto.isActive;

    return await this.surveyRepository.save(survey);
  }

  async remove(id: string): Promise<{ id: string; eliminada: boolean }> {
    const survey = await this.findOne(id);
    await this.surveyRepository.remove(survey);
    return { id, eliminada: true };
  }
}
