import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { paginate, PaginatedResult } from '../../../common/pagination/paginate';
import { PromptTemplate } from '../entities/prompt-template.entity';
import { InterviewType } from '../../catalogs/entities/interview-type.entity';
import { JobRole } from '../../catalogs/entities/job-role.entity';
import { CreatePromptTemplateDto } from '../dto/create-prompt-template.dto';
import { UpdatePromptTemplateDto } from '../dto/update-prompt-template.dto';

@Injectable()
export class PromptTemplatesService {
  constructor(
    @InjectRepository(PromptTemplate)
    private readonly templateRepository: Repository<PromptTemplate>,
    @InjectRepository(InterviewType)
    private readonly interviewTypeRepository: Repository<InterviewType>,
    @InjectRepository(JobRole)
    private readonly jobRoleRepository: Repository<JobRole>,
  ) {}

  async create(createDto: CreatePromptTemplateDto): Promise<PromptTemplate> {
    await this.verificarNombreLibre(createDto.name);

    const template = this.templateRepository.create({
      name: createDto.name,
      content: createDto.content,
      isActive: createDto.isActive ?? true,
      interviewType: await this.resolverTipo(createDto.interviewTypeId),
      jobRole: await this.resolverRol(createDto.jobRoleId),
    });
    return await this.templateRepository.save(template);
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<PromptTemplate>> {
    return await paginate(this.templateRepository, query, {
      searchFields: ['name'],
      sortableFields: ['name', 'createdAt', 'isActive'],
      relations: { interviewType: true, jobRole: true },
    });
  }

  async findOne(id: string): Promise<PromptTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: { interviewType: true, jobRole: true },
    });
    if (!template) {
      throw new NotFoundException(`Plantilla con ID ${id} no encontrada`);
    }
    return template;
  }

  async update(
    id: string,
    updateDto: UpdatePromptTemplateDto,
  ): Promise<PromptTemplate> {
    const template = await this.findOne(id);

    if (updateDto.name !== undefined && updateDto.name !== template.name) {
      await this.verificarNombreLibre(updateDto.name);
      template.name = updateDto.name;
    }
    if (updateDto.content !== undefined) template.content = updateDto.content;
    if (updateDto.isActive !== undefined) template.isActive = updateDto.isActive;
    if (updateDto.interviewTypeId !== undefined) {
      template.interviewType = await this.resolverTipo(updateDto.interviewTypeId);
    }
    if (updateDto.jobRoleId !== undefined) {
      template.jobRole = await this.resolverRol(updateDto.jobRoleId);
    }

    return await this.templateRepository.save(template);
  }

  async remove(id: string): Promise<{ id: string; eliminada: boolean }> {
    const template = await this.findOne(id);
    await this.templateRepository.remove(template);
    return { id, eliminada: true };
  }

  private async verificarNombreLibre(name: string): Promise<void> {
    const existe = await this.templateRepository.findOneBy({ name });
    if (existe) {
      throw new ConflictException(`Ya existe una plantilla llamada "${name}"`);
    }
  }

  private async resolverTipo(id?: string): Promise<InterviewType | null> {
    if (!id) return null;
    const tipo = await this.interviewTypeRepository.findOneBy({ id });
    if (!tipo) {
      throw new BadRequestException(`El tipo de entrevista ${id} no existe`);
    }
    return tipo;
  }

  private async resolverRol(id?: string): Promise<JobRole | null> {
    if (!id) return null;
    const rol = await this.jobRoleRepository.findOneBy({ id });
    if (!rol) {
      throw new BadRequestException(`El rol objetivo ${id} no existe`);
    }
    return rol;
  }
}
