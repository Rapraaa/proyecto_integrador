import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { Interview } from './schemas/interview.schema';
import { AiService } from '../ai/ai.service';

describe('InterviewsService', () => {
  let service: InterviewsService;

  const mockSave = jest.fn();
  const MockInterviewModel: any = jest.fn().mockImplementation((doc) => ({
    ...doc,
    save: mockSave,
  }));

  const mockAiService = {
    iniciarEntrevista: jest.fn(),
    continuarEntrevista: jest.fn(),
    evaluarEntrevista: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    MockInterviewModel.findById = jest.fn();
    MockInterviewModel.find = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterviewsService,
        {
          provide: getModelToken(Interview.name),
          useValue: MockInterviewModel,
        },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();
    service = module.get<InterviewsService>(InterviewsService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('crear()', () => {
    it('pide la primera pregunta a la IA y guarda la entrevista', async () => {
      mockAiService.iniciarEntrevista.mockResolvedValue('Primera pregunta');
      mockSave.mockResolvedValue({ _id: 'int-1' });

      const dto = {
        interview_type: 'technical',
        target_role: 'backend',
        seniority: 'senior',
        technologies: ['Node.js'],
      };

      await service.crear('user-1', dto);

      expect(mockAiService.iniciarEntrevista).toHaveBeenCalledWith({
        rol: 'backend',
        nivel: 'senior',
        tecnologias: ['Node.js'],
      });
      expect(MockInterviewModel).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: 'user-1', status: 'in_progress' }),
      );
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('enviarMensaje()', () => {
    it('guarda la respuesta del usuario y agrega la repregunta de la IA', async () => {
      const interview: any = {
        user_id: 'user-1',
        status: 'in_progress',
        chat_history: [{ sequence: 1, sender: 'ai', content: 'P1' }],
        save: jest.fn(),
      };
      interview.save.mockResolvedValue(interview);
      MockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(interview),
      });
      mockAiService.continuarEntrevista.mockResolvedValue('Siguiente pregunta');

      await service.enviarMensaje('user-1', 'int-1', {
        content: 'mi respuesta',
      });

      expect(interview.chat_history).toHaveLength(3);
      expect(mockAiService.continuarEntrevista).toHaveBeenCalled();
      expect(interview.save).toHaveBeenCalled();
    });

    it('lanza BadRequestException si la entrevista ya finalizó', async () => {
      const interview = {
        user_id: 'user-1',
        status: 'completed',
        chat_history: [],
        save: jest.fn(),
      };
      MockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(interview),
      });

      await expect(
        service.enviarMensaje('user-1', 'int-1', { content: 'x' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('finalizar()', () => {
    it('genera la evaluación con la IA y marca la entrevista como completed', async () => {
      const interview: any = {
        user_id: 'user-1',
        status: 'in_progress',
        chat_history: [{ sequence: 1, sender: 'ai', content: 'P1' }],
        save: jest.fn(),
      };
      interview.save.mockResolvedValue(interview);
      MockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(interview),
      });
      mockAiService.evaluarEntrevista.mockResolvedValue({ score: 80 });

      await service.finalizar('user-1', 'int-1');

      expect(interview.status).toBe('completed');
      expect(interview.evaluation).toEqual({ score: 80 });
      expect(interview.save).toHaveBeenCalled();
    });

    it('lanza BadRequestException si ya fue evaluada', async () => {
      const interview = {
        user_id: 'user-1',
        status: 'completed',
        chat_history: [],
        save: jest.fn(),
      };
      MockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(interview),
      });

      await expect(service.finalizar('user-1', 'int-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('historial()', () => {
    it('devuelve las entrevistas del usuario ordenadas', async () => {
      MockInterviewModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([{ _id: 'int-1' }]),
        }),
      });

      const result = await service.historial('user-1');

      expect(MockInterviewModel.find).toHaveBeenCalledWith({
        user_id: 'user-1',
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('buscarPropia() (vía obtenerUna)', () => {
    it('lanza NotFoundException si la entrevista no existe', async () => {
      MockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.obtenerUna('user-1', 'x')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('lanza ForbiddenException si la entrevista es de otro usuario', async () => {
      MockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          user_id: 'otro-usuario',
          status: 'in_progress',
        }),
      });
      await expect(service.obtenerUna('user-1', 'int-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
