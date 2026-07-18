import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterviewType } from '../entities/interview-type.entity';
import { BaseCatalogService } from '../base-catalog.service';

@Injectable()
export class InterviewTypesService extends BaseCatalogService<InterviewType> {
  constructor(
    @InjectRepository(InterviewType)
    repository: Repository<InterviewType>,
  ) {
    super(repository, 'Tipo de entrevista');
  }
}
