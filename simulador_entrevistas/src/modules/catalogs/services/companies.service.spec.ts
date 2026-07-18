import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from '../entities/company.entity';

describe('CompaniesService', () => {
  let service: CompaniesService;

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
        CompaniesService,
        { provide: getRepositoryToken(Company), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<CompaniesService>(CompaniesService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('crea una empresa cuando el nombre no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockImplementation(async (item) => ({
        id: 'co-1',
        ...item,
      }));
      const result = await service.create({ name: 'Startup Tech' });
      expect(result).toMatchObject({ name: 'Startup Tech' });
    });

    it('lanza BadRequestException si el nombre ya existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'co-1', name: 'Startup Tech' });
      await expect(service.create({ name: 'Startup Tech' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll()', () => {
    it('devuelve resultados paginados', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [{ id: 'co-1', name: 'Banco Nacional' }],
        1,
      ]);
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne()', () => {
    it('devuelve la empresa si existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'co-1', name: 'BigTech' });
      expect(await service.findOne('co-1')).toMatchObject({ name: 'BigTech' });
    });

    it('lanza NotFoundException si no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('actualiza la empresa', async () => {
      const existente = { id: 'co-1', name: 'Consultora' };
      mockRepository.findOneBy.mockResolvedValueOnce(existente);
      mockRepository.merge.mockImplementation((e, d) => Object.assign(e, d));
      mockRepository.save.mockImplementation(async (e) => e);
      const result = await service.update('co-1', { description: 'Global' });
      expect(result).toMatchObject({ description: 'Global' });
    });
  });

  describe('remove()', () => {
    it('elimina la empresa encontrada', async () => {
      const existente = { id: 'co-1', name: 'Startup Tech' };
      mockRepository.findOneBy.mockResolvedValue(existente);
      mockRepository.remove.mockResolvedValue(existente);
      await service.remove('co-1');
      expect(mockRepository.remove).toHaveBeenCalledWith(existente);
    });
  });
});
