import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TechCategoriesService } from './tech-categories.service';
import { TechCategory } from '../entities/tech-category.entity';

describe('TechCategoriesService', () => {
  let service: TechCategoriesService;

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
        TechCategoriesService,
        { provide: getRepositoryToken(TechCategory), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<TechCategoriesService>(TechCategoriesService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('crea una categoría cuando no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockImplementation(async (item) => ({
        id: 'tc-1',
        ...item,
      }));
      const result = await service.create({ name: 'language' });
      expect(result).toMatchObject({ name: 'language' });
    });

    it('lanza BadRequestException si el nombre ya existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'tc-1', name: 'language' });
      await expect(service.create({ name: 'language' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll()', () => {
    it('devuelve resultados paginados', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [{ id: 'tc-1', name: 'framework' }],
        1,
      ]);
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne()', () => {
    it('devuelve la categoría si existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'tc-1', name: 'database' });
      expect(await service.findOne('tc-1')).toMatchObject({ name: 'database' });
    });

    it('lanza NotFoundException si no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('actualiza la categoría', async () => {
      const existente = { id: 'tc-1', name: 'devops' };
      mockRepository.findOneBy.mockResolvedValueOnce(existente);
      mockRepository.merge.mockImplementation((e, d) => Object.assign(e, d));
      mockRepository.save.mockImplementation(async (e) => e);
      const result = await service.update('tc-1', { isActive: false });
      expect(result).toMatchObject({ isActive: false });
    });
  });

  describe('remove()', () => {
    it('elimina la categoría encontrada', async () => {
      const existente = { id: 'tc-1', name: 'language' };
      mockRepository.findOneBy.mockResolvedValue(existente);
      mockRepository.remove.mockResolvedValue(existente);
      await service.remove('tc-1');
      expect(mockRepository.remove).toHaveBeenCalledWith(existente);
    });
  });
});
