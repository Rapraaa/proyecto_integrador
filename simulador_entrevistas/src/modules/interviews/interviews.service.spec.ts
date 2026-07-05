import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { InterviewsService } from './interviews.service';
import { AiService } from '../ai/ai.service';
import { Interview } from './schemas/interview.schema';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('InterviewsService', () => {
  let service: InterviewsService;
  
  const mockInterviewModel = {
    new: jest.fn().mockResolvedValue({}),
    constructor: jest.fn().mockResolvedValue({}),
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
  };

  const mockAiService = {
    iniciarEntrevista: jest.fn(),
    continuarEntrevista: jest.fn(),
    evaluarEntrevista: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterviewsService,
        {
          provide: getModelToken(Interview.name),
          useValue: mockInterviewModel,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    service = module.get<InterviewsService>(InterviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crear()', () => {
    it('should create an interview', async () => {
      mockAiService.iniciarEntrevista.mockResolvedValue('Primera pregunta');
      
      const saveMock = jest.fn().mockResolvedValue({ _id: '1', user_id: 'user1' });
      let createdData: any;
      const MockModel = function(data: any) {
        createdData = data;
        this.save = saveMock;
      };
      
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          InterviewsService,
          { provide: getModelToken(Interview.name), useValue: MockModel },
          { provide: AiService, useValue: mockAiService },
        ],
      }).compile();
      
      const testService = module.get<InterviewsService>(InterviewsService);
      
      const dto = { target_role: 'dev', seniority: 'junior', technologies: ['react'] };
      const res = await testService.crear('user1', dto);
      expect(mockAiService.iniciarEntrevista).toHaveBeenCalledWith({
        rol: 'dev',
        nivel: 'junior',
        tecnologias: ['react']
      });
      expect(createdData).toEqual({
        user_id: 'user1',
        config: dto,
        status: 'in_progress',
        chat_history: [{ sequence: 1, sender: 'ai', content: 'Primera pregunta' }],
      });
      expect(saveMock).toHaveBeenCalled();
      expect(res._id).toBe('1');
    });

    it('should throw NotFoundException if interview does not exist when sending a message', async () => {
      mockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.enviarMensaje('user1', 'id', { content: 'hello' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('buscarPropia()', () => {
    it('should throw NotFoundException if interview does not exist', async () => {
      mockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.obtenerUna('user1', 'id')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      mockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ user_id: 'user2' }),
      });

      await expect(service.obtenerUna('user1', 'id')).rejects.toThrow(ForbiddenException);
    });

    it('should return interview if owner matches', async () => {
      mockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ user_id: 'user1', _id: 'id' }),
      });

      const res = await service.obtenerUna('user1', 'id');
      expect(res._id).toBe('id');
    });
  });

  describe('enviarMensaje()', () => {
    it('should throw BadRequestException if interview is completed', async () => {
      mockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ user_id: 'user1', status: 'completed' }),
      });

      await expect(service.enviarMensaje('user1', 'id', { content: 'hello' })).rejects.toThrow(BadRequestException);
    });

    it('should append message and ai response and save', async () => {
      const saveMock = jest.fn().mockResolvedValue({ _id: 'id', user_id: 'user1', status: 'in_progress' });
      const interview = {
        _id: 'id',
        user_id: 'user1',
        status: 'in_progress',
        chat_history: [{ sequence: 1, sender: 'ai', content: 'q1' }],
        save: saveMock,
      };

      mockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(interview),
      });

      mockAiService.continuarEntrevista.mockResolvedValue('next question');

      const res = await service.enviarMensaje('user1', 'id', { content: 'ans1' });

      expect(mockAiService.continuarEntrevista).toHaveBeenCalled();
      expect(interview.chat_history.length).toBe(3);
      expect(saveMock).toHaveBeenCalled();
      expect(res._id).toBe('id');
    });
  });

  describe('finalizar()', () => {
    it('should throw BadRequestException if interview is already completed', async () => {
      mockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ user_id: 'user1', status: 'completed' }),
      });

      await expect(service.finalizar('user1', 'id')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if interview is not found when finalizing', async () => {
      mockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.finalizar('user1', 'id')).rejects.toThrow(NotFoundException);
    });

    it('should evaluate and set status to completed', async () => {
      const saveMock = jest.fn().mockResolvedValue({ _id: 'id', user_id: 'user1', status: 'completed' });
      const interview = {
        _id: 'id',
        user_id: 'user1',
        status: 'in_progress',
        chat_history: [],
        save: saveMock,
        evaluation: null,
      };

      mockInterviewModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(interview),
      });

      mockAiService.evaluarEntrevista.mockResolvedValue('evaluation text');

      const res = await service.finalizar('user1', 'id');

      expect(mockAiService.evaluarEntrevista).toHaveBeenCalledWith(interview.chat_history);
      expect(interview.status).toBe('completed');
      expect(interview.evaluation).toBe('evaluation text');
      expect(saveMock).toHaveBeenCalled();
      expect(res._id).toBe('id');
    });
  });

  describe('historial()', () => {
    it('should return user history', async () => {
      const historyMock = [{ _id: '1' }, { _id: '2' }];
      mockInterviewModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(historyMock),
        }),
      });

      const res = await service.historial('user1');
      expect(res).toEqual(historyMock);
    });
  });
});
