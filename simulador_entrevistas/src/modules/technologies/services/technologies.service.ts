import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { paginate, PaginatedResult } from '../../../common/pagination/paginate';
import { Technology } from '../entities/technology.entity';
import { TechCategory } from '../entities/tech-category.entity';
import { CreateTechnologyDto } from '../dto/create-technology.dto';
import { UpdateTechnologyDto } from '../dto/update-technology.dto';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
    @InjectRepository(TechCategory)
    private readonly categoryRepository: Repository<TechCategory>,
  ) {}

  private async resolverCategoria(categoryId: string): Promise<TechCategory> {
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new BadRequestException(
        `La categoría con ID ${categoryId} no existe`,
      );
    }
    return category;
  }

  async create(createDto: CreateTechnologyDto): Promise<Technology> {
    const exists = await this.technologyRepository.findOneBy({
      name: createDto.name,
    });
    if (exists) {
      throw new BadRequestException(
        `Ya existe una tecnología con el nombre "${createDto.name}"`,
      );
    }
    const category = await this.resolverCategoria(createDto.categoryId);
    const technology = this.technologyRepository.create({
      name: createDto.name,
      isActive: createDto.isActive ?? true,
      category,
    });
    return await this.technologyRepository.save(technology);
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<Technology>> {
    return await paginate(this.technologyRepository, query, {
      searchFields: ['name'],
      sortableFields: ['name', 'createdAt', 'isActive'],
      relations: { category: true },
    });
  }

  async findOne(id: string): Promise<Technology> {
    const technology = await this.technologyRepository.findOneBy({ id });
    if (!technology) {
      throw new NotFoundException(`Tecnología con ID ${id} no encontrada`);
    }
    return technology;
  }

  async update(id: string, updateDto: UpdateTechnologyDto): Promise<Technology> {
    const technology = await this.findOne(id);

    if (updateDto.name && updateDto.name !== technology.name) {
      const exists = await this.technologyRepository.findOneBy({
        name: updateDto.name,
      });
      if (exists) {
        throw new BadRequestException(
          `Ya existe una tecnología con el nombre "${updateDto.name}"`,
        );
      }
      technology.name = updateDto.name;
    }

    if (updateDto.categoryId) {
      technology.category = await this.resolverCategoria(updateDto.categoryId);
    }

    if (updateDto.isActive !== undefined) {
      technology.isActive = updateDto.isActive;
    }

    return await this.technologyRepository.save(technology);
  }

  async remove(id: string): Promise<Technology> {
    const technology = await this.findOne(id);
    return await this.technologyRepository.remove(technology);
  }
}
