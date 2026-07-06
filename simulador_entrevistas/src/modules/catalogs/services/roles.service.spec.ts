import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from '../entities/role.entity';

describe('RolesService', () => {
  let service: RolesService;

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
        RolesService,
        { provide: getRepositoryToken(Role), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<RolesService>(RolesService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('crea un rol cuando el nombre no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockImplementation(async (item) => ({
        id: 'role-1',
        ...item,
      }));

      const result = await service.create({ name: 'admin' });

      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toMatchObject({ name: 'admin' });
    });

    it('lanza BadRequestException si el nombre ya existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'role-1', name: 'admin' });
      await expect(service.create({ name: 'admin' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll()', () => {
    it('devuelve resultados paginados con metadata', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [{ id: 'role-1', name: 'admin' }],
        1,
      ]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe('findOne()', () => {
    it('devuelve el rol si existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'role-1', name: 'admin' });
      const result = await service.findOne('role-1');
      expect(result).toMatchObject({ name: 'admin' });
    });

    it('lanza NotFoundException si no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('no-existe')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update()', () => {
    it('actualiza y guarda el rol', async () => {
      const existente = { id: 'role-1', name: 'admin' };
      mockRepository.findOneBy.mockResolvedValueOnce(existente);
      mockRepository.merge.mockImplementation((e, d) => Object.assign(e, d));
      mockRepository.save.mockImplementation(async (e) => e);

      const result = await service.update('role-1', { description: 'Gestor' });

      expect(mockRepository.merge).toHaveBeenCalled();
      expect(result).toMatchObject({ description: 'Gestor' });
    });

    it('lanza BadRequestException si el nuevo nombre ya lo usa otro registro', async () => {
      mockRepository.findOneBy
        .mockResolvedValueOnce({ id: 'role-1', name: 'admin' })
        .mockResolvedValueOnce({ id: 'role-2', name: 'user' });

      await expect(service.update('role-1', { name: 'user' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove()', () => {
    it('elimina el rol encontrado', async () => {
      const existente = { id: 'role-1', name: 'admin' };
      mockRepository.findOneBy.mockResolvedValue(existente);
      mockRepository.remove.mockResolvedValue(existente);

      await service.remove('role-1');

      expect(mockRepository.remove).toHaveBeenCalledWith(existente);
    });
  });
});
