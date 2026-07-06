import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InterviewTypesService } from './interview-types.service';
import { InterviewType } from '../entities/interview-type.entity';

describe('InterviewTypesService', () => {
  let service: InterviewTypesService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterviewTypesService,
        { provide: getRepositoryToken(InterviewType), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<InterviewTypesService>(InterviewTypesService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('crea un tipo de entrevista cuando no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockImplementation(async (item) => ({
        id: 'it-1',
        ...item,
      }));
      const result = await service.create({ name: 'technical' });
      expect(result).toMatchObject({ name: 'technical' });
    });

    it('lanza BadRequestException si el nombre ya existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'it-1', name: 'technical' });
      await expect(service.create({ name: 'technical' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll()', () => {
    it('devuelve resultados paginados', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [{ id: 'it-1', name: 'theoretical' }],
        1,
      ]);
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne()', () => {
    it('devuelve el tipo si existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'it-1', name: 'technical' });
      expect(await service.findOne('it-1')).toMatchObject({ name: 'technical' });
    });

    it('lanza NotFoundException si no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('actualiza el tipo de entrevista', async () => {
      const existente = { id: 'it-1', name: 'technical' };
      mockRepository.findOneBy.mockResolvedValueOnce(existente);
      mockRepository.merge.mockImplementation((e, d) => Object.assign(e, d));
      mockRepository.save.mockImplementation(async (e) => e);
      const result = await service.update('it-1', { description: 'Con código' });
      expect(result).toMatchObject({ description: 'Con código' });
    });
  });

  describe('remove()', () => {
    it('elimina el tipo encontrado', async () => {
      const existente = { id: 'it-1', name: 'theoretical' };
      mockRepository.findOneBy.mockResolvedValue(existente);
      mockRepository.remove.mockResolvedValue(existente);
      await service.remove('it-1');
      expect(mockRepository.remove).toHaveBeenCalledWith(existente);
    });
  });
});
