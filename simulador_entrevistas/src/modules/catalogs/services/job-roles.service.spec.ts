import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JobRolesService } from './job-roles.service';
import { JobRole } from '../entities/job-role.entity';

describe('JobRolesService', () => {
  let service: JobRolesService;

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
        JobRolesService,
        { provide: getRepositoryToken(JobRole), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<JobRolesService>(JobRolesService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('crea un rol objetivo cuando el nombre no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockImplementation(async (item) => ({
        id: 'job-1',
        ...item,
      }));
      const result = await service.create({ name: 'backend' });
      expect(result).toMatchObject({ name: 'backend' });
    });

    it('lanza BadRequestException si el nombre ya existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'job-1', name: 'backend' });
      await expect(service.create({ name: 'backend' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll()', () => {
    it('devuelve resultados paginados', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [{ id: 'job-1', name: 'frontend' }],
        1,
      ]);
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne()', () => {
    it('devuelve el rol objetivo si existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'job-1', name: 'fullstack' });
      expect(await service.findOne('job-1')).toMatchObject({ name: 'fullstack' });
    });

    it('lanza NotFoundException si no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('actualiza el rol objetivo', async () => {
      const existente = { id: 'job-1', name: 'mobile' };
      mockRepository.findOneBy.mockResolvedValueOnce(existente);
      mockRepository.merge.mockImplementation((e, d) => Object.assign(e, d));
      mockRepository.save.mockImplementation(async (e) => e);
      const result = await service.update('job-1', { isActive: false });
      expect(result).toMatchObject({ isActive: false });
    });
  });

  describe('remove()', () => {
    it('elimina el rol objetivo encontrado', async () => {
      const existente = { id: 'job-1', name: 'devops' };
      mockRepository.findOneBy.mockResolvedValue(existente);
      mockRepository.remove.mockResolvedValue(existente);
      await service.remove('job-1');
      expect(mockRepository.remove).toHaveBeenCalledWith(existente);
    });
  });
});
