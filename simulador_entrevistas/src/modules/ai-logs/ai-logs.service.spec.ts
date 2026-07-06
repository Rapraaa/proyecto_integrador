import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AiLogsService } from './ai-logs.service';
import { AiLog } from './schemas/ai-log.schema';

describe('AiLogsService', () => {
  let service: AiLogsService;

  // Cadena de consulta de Mongoose: find().sort().skip().limit().exec()
  const queryChain = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  const mockModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnValue(queryChain),
    countDocuments: jest.fn().mockReturnValue({ exec: jest.fn() }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockModel.find.mockReturnValue(queryChain);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiLogsService,
        { provide: getModelToken(AiLog.name), useValue: mockModel },
      ],
    }).compile();
    service = module.get<AiLogsService>(AiLogsService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('record()', () => {
    it('registra el log de la interacción con la IA', async () => {
      mockModel.create.mockResolvedValue({ id: 'log-1' });
      await service.record({
        prompt: 'hola',
        response: 'respuesta',
        model: 'gemini-2.5-flash',
      });
      expect(mockModel.create).toHaveBeenCalled();
    });

    it('NO lanza excepción si falla el guardado (no debe tumbar la entrevista)', async () => {
      mockModel.create.mockRejectedValue(new Error('mongo caído'));
      await expect(
        service.record({ prompt: 'x', response: 'y', model: 'm' }),
      ).resolves.toBeUndefined();
    });
  });

  describe('findAll()', () => {
    it('devuelve los logs paginados con metadata', async () => {
      queryChain.exec.mockResolvedValue([{ id: 'log-1', prompt: 'hola' }]);
      mockModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('aplica el filtro por user_id cuando se envía', async () => {
      queryChain.exec.mockResolvedValue([]);
      mockModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      await service.findAll({ page: 1, limit: 10, user_id: 'u1' });

      expect(mockModel.find).toHaveBeenCalledWith({ user_id: 'u1' });
    });
  });
});
