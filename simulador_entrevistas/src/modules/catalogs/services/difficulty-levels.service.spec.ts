import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DifficultyLevelsService } from './difficulty-levels.service';
import { DifficultyLevel } from '../entities/difficulty-level.entity';

describe('DifficultyLevelsService', () => {
  let service: DifficultyLevelsService;

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
        DifficultyLevelsService,
        {
          provide: getRepositoryToken(DifficultyLevel),
          useValue: mockRepository,
        },
      ],
    }).compile();
    service = module.get<DifficultyLevelsService>(DifficultyLevelsService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('crea una dificultad cuando no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockImplementation(async (item) => ({
        id: 'dif-1',
        ...item,
      }));
      const result = await service.create({ name: 'easy' });
      expect(result).toMatchObject({ name: 'easy' });
    });

    it('lanza BadRequestException si el nombre ya existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'dif-1', name: 'easy' });
      await expect(service.create({ name: 'easy' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll()', () => {
    it('devuelve resultados paginados', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [{ id: 'dif-1', name: 'hard' }],
        1,
      ]);
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne()', () => {
    it('devuelve la dificultad si existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'dif-1', name: 'medium' });
      expect(await service.findOne('dif-1')).toMatchObject({ name: 'medium' });
    });

    it('lanza NotFoundException si no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('actualiza la dificultad', async () => {
      const existente = { id: 'dif-1', name: 'easy' };
      mockRepository.findOneBy.mockResolvedValueOnce(existente);
      mockRepository.merge.mockImplementation((e, d) => Object.assign(e, d));
      mockRepository.save.mockImplementation(async (e) => e);
      const result = await service.update('dif-1', { description: 'Sencillo' });
      expect(result).toMatchObject({ description: 'Sencillo' });
    });
  });

  describe('remove()', () => {
    it('elimina la dificultad encontrada', async () => {
      const existente = { id: 'dif-1', name: 'hard' };
      mockRepository.findOneBy.mockResolvedValue(existente);
      mockRepository.remove.mockResolvedValue(existente);
      await service.remove('dif-1');
      expect(mockRepository.remove).toHaveBeenCalledWith(existente);
    });
  });
});
