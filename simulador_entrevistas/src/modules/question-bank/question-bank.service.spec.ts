import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { QuestionBankService } from './question-bank.service';
import { Question } from './schemas/question.schema';

describe('QuestionBankService', () => {
  let service: QuestionBankService;

  const findChain = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  const mockModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnValue(findChain),
    countDocuments: jest.fn().mockReturnValue({ exec: jest.fn() }),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockModel.find.mockReturnValue(findChain);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionBankService,
        { provide: getModelToken(Question.name), useValue: mockModel },
      ],
    }).compile();
    service = module.get<QuestionBankService>(QuestionBankService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('crea una pregunta', async () => {
      const dto = {
        enunciado: '¿Qué es un closure?',
        interview_type: 'theoretical',
        technology: 'JavaScript',
        difficulty: 'medium',
      };
      mockModel.create.mockResolvedValue({ id: 'q-1', ...dto });
      const result = await service.create(dto);
      expect(mockModel.create).toHaveBeenCalledWith(dto);
      expect(result).toMatchObject({ enunciado: '¿Qué es un closure?' });
    });
  });

  describe('findAll()', () => {
    it('devuelve preguntas paginadas y aplica filtros', async () => {
      findChain.exec.mockResolvedValue([{ id: 'q-1' }]);
      mockModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.findAll({
        page: 1,
        limit: 10,
        technology: 'JavaScript',
        difficulty: 'medium',
      });

      expect(mockModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          technology: 'JavaScript',
          difficulty: 'medium',
        }),
      );
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne()', () => {
    it('devuelve la pregunta si existe', async () => {
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ id: 'q-1' }),
      });
      expect(await service.findOne('q-1')).toMatchObject({ id: 'q-1' });
    });

    it('lanza NotFoundException si no existe', async () => {
      mockModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('actualiza la pregunta', async () => {
      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ id: 'q-1', difficulty: 'hard' }),
      });
      const result = await service.update('q-1', { difficulty: 'hard' });
      expect(result).toMatchObject({ difficulty: 'hard' });
    });

    it('lanza NotFoundException si la pregunta no existe', async () => {
      mockModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(
        service.update('x', { difficulty: 'hard' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('elimina la pregunta', async () => {
      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ id: 'q-1' }),
      });
      expect(await service.remove('q-1')).toMatchObject({ id: 'q-1' });
    });

    it('lanza NotFoundException si la pregunta no existe', async () => {
      mockModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.remove('x')).rejects.toThrow(NotFoundException);
    });
  });
});
