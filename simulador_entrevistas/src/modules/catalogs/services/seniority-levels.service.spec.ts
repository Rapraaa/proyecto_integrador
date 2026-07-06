import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SeniorityLevelsService } from './seniority-levels.service';
import { SeniorityLevel } from '../entities/seniority-level.entity';

describe('SeniorityLevelsService', () => {
  let service: SeniorityLevelsService;

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
        SeniorityLevelsService,
        {
          provide: getRepositoryToken(SeniorityLevel),
          useValue: mockRepository,
        },
      ],
    }).compile();
    service = module.get<SeniorityLevelsService>(SeniorityLevelsService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('crea un nivel cuando el nombre no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockImplementation(async (item) => ({
        id: 'sen-1',
        ...item,
      }));

      const result = await service.create({ name: 'junior' });

      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toMatchObject({ name: 'junior' });
    });

    it('lanza BadRequestException si el nombre ya existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'sen-1', name: 'junior' });
      await expect(service.create({ name: 'junior' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll()', () => {
    it('devuelve resultados paginados', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [{ id: 'sen-1', name: 'junior' }],
        1,
      ]);
      const result = await service.findAll({ page: 1, limit: 5 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne()', () => {
    it('devuelve el nivel si existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'sen-1', name: 'senior' });
      expect(await service.findOne('sen-1')).toMatchObject({ name: 'senior' });
    });

    it('lanza NotFoundException si no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('actualiza y guarda el nivel', async () => {
      const existente = { id: 'sen-1', name: 'mid' };
      mockRepository.findOneBy.mockResolvedValueOnce(existente);
      mockRepository.merge.mockImplementation((e, d) => Object.assign(e, d));
      mockRepository.save.mockImplementation(async (e) => e);

      const result = await service.update('sen-1', { description: 'Intermedio' });
      expect(result).toMatchObject({ description: 'Intermedio' });
    });
  });

  describe('remove()', () => {
    it('elimina el nivel encontrado', async () => {
      const existente = { id: 'sen-1', name: 'lead' };
      mockRepository.findOneBy.mockResolvedValue(existente);
      mockRepository.remove.mockResolvedValue(existente);
      await service.remove('sen-1');
      expect(mockRepository.remove).toHaveBeenCalledWith(existente);
    });
  });
});
