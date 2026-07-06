import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EvaluationCriteriaService } from './evaluation-criteria.service';
import { EvaluationCriterion } from '../entities/evaluation-criterion.entity';

describe('EvaluationCriteriaService', () => {
  let service: EvaluationCriteriaService;

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
        EvaluationCriteriaService,
        {
          provide: getRepositoryToken(EvaluationCriterion),
          useValue: mockRepository,
        },
      ],
    }).compile();
    service = module.get<EvaluationCriteriaService>(EvaluationCriteriaService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('crea un criterio cuando no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockImplementation(async (item) => ({
        id: 'ec-1',
        ...item,
      }));
      const result = await service.create({ name: 'claridad' });
      expect(result).toMatchObject({ name: 'claridad' });
    });

    it('lanza BadRequestException si el nombre ya existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'ec-1', name: 'claridad' });
      await expect(service.create({ name: 'claridad' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll()', () => {
    it('devuelve resultados paginados', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [{ id: 'ec-1', name: 'correctitud' }],
        1,
      ]);
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne()', () => {
    it('devuelve el criterio si existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'ec-1', name: 'complejidad' });
      expect(await service.findOne('ec-1')).toMatchObject({ name: 'complejidad' });
    });

    it('lanza NotFoundException si no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('actualiza el criterio', async () => {
      const existente = { id: 'ec-1', name: 'claridad' };
      mockRepository.findOneBy.mockResolvedValueOnce(existente);
      mockRepository.merge.mockImplementation((e, d) => Object.assign(e, d));
      mockRepository.save.mockImplementation(async (e) => e);
      const result = await service.update('ec-1', { description: 'Explica bien' });
      expect(result).toMatchObject({ description: 'Explica bien' });
    });
  });

  describe('remove()', () => {
    it('elimina el criterio encontrado', async () => {
      const existente = { id: 'ec-1', name: 'correctitud' };
      mockRepository.findOneBy.mockResolvedValue(existente);
      mockRepository.remove.mockResolvedValue(existente);
      await service.remove('ec-1');
      expect(mockRepository.remove).toHaveBeenCalledWith(existente);
    });
  });
});
