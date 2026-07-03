import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { paginate, PaginatedResult } from '../../common/pagination/paginate';
import { BaseCatalogEntity } from './entities/base-catalog.entity';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { UpdateCatalogItemDto } from './dto/update-catalog-item.dto';

//CRUD genérico para catálogos: cada catálogo concreto solo inyecta su repositorio.
export abstract class BaseCatalogService<T extends BaseCatalogEntity> {
  protected constructor(
    protected readonly repository: Repository<T>,
    protected readonly entityName: string,
  ) {}

  async create(createDto: CreateCatalogItemDto): Promise<T> {
    const exists = await this.repository.findOneBy({
      name: createDto.name,
    } as FindOptionsWhere<T>);
    if (exists) {
      throw new BadRequestException(
        `Ya existe un registro de ${this.entityName} con el nombre "${createDto.name}"`,
      );
    }
    const item = this.repository.create(createDto as DeepPartial<T>);
    return await this.repository.save(item);
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<T>> {
    return await paginate(this.repository, query, {
      searchFields: ['name', 'description'],
      sortableFields: ['name', 'createdAt', 'isActive'],
    });
  }

  async findOne(id: string): Promise<T> {
    const item = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<T>);
    if (!item) {
      throw new NotFoundException(
        `${this.entityName} con ID ${id} no encontrado`,
      );
    }
    return item;
  }

  async findByName(name: string): Promise<T | null> {
    return await this.repository.findOneBy({
      name,
    } as FindOptionsWhere<T>);
  }

  async update(id: string, updateDto: UpdateCatalogItemDto): Promise<T> {
    const item = await this.findOne(id);
    if (updateDto.name && updateDto.name !== item.name) {
      const exists = await this.findByName(updateDto.name);
      if (exists) {
        throw new BadRequestException(
          `Ya existe un registro de ${this.entityName} con el nombre "${updateDto.name}"`,
        );
      }
    }
    this.repository.merge(item, updateDto as DeepPartial<T>);
    return await this.repository.save(item);
  }

  async remove(id: string): Promise<T> {
    const item = await this.findOne(id);
    return await this.repository.remove(item);
  }
}
