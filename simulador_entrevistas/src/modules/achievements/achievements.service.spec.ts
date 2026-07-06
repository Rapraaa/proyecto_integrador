import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { Achievement } from './entities/achievement.entity';

describe('AchievementsService', () => {
  let service: AchievementsService;

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
        AchievementsService,
        { provide: getRepositoryToken(Achievement), useValue: mockRepository },
      ],
    }).compile();
    service = module.get<AchievementsService>(AchievementsService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('crea un logro cuando no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto);
      mockRepository.save.mockImplementation(async (item) => ({
        id: 'ach-1',
        ...item,
      }));
      const result = await service.create({ name: 'primera_entrevista' });
      expect(result).toMatchObject({ name: 'primera_entrevista' });
    });

    it('lanza BadRequestException si el nombre ya existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({
        id: 'ach-1',
        name: 'primera_entrevista',
      });
      await expect(
        service.create({ name: 'primera_entrevista' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll()', () => {
    it('devuelve resultados paginados', async () => {
      mockRepository.findAndCount.mockResolvedValue([
        [{ id: 'ach-1', name: 'racha_5' }],
        1,
      ]);
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne()', () => {
    it('devuelve el logro si existe', async () => {
      mockRepository.findOneBy.mockResolvedValue({ id: 'ach-1', name: 'score_80' });
      expect(await service.findOne('ach-1')).toMatchObject({ name: 'score_80' });
    });

    it('lanza NotFoundException si no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('actualiza el logro', async () => {
      const existente = { id: 'ach-1', name: 'racha_5' };
      mockRepository.findOneBy.mockResolvedValueOnce(existente);
      mockRepository.merge.mockImplementation((e, d) => Object.assign(e, d));
      mockRepository.save.mockImplementation(async (e) => e);
      const result = await service.update('ach-1', { description: 'Cinco seguidas' });
      expect(result).toMatchObject({ description: 'Cinco seguidas' });
    });
  });

  describe('remove()', () => {
    it('elimina el logro encontrado', async () => {
      const existente = { id: 'ach-1', name: 'primera_entrevista' };
      mockRepository.findOneBy.mockResolvedValue(existente);
      mockRepository.remove.mockResolvedValue(existente);
      await service.remove('ach-1');
      expect(mockRepository.remove).toHaveBeenCalledWith(existente);
    });
  });
});
