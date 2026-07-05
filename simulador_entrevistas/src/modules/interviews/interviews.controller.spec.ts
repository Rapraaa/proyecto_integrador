import { Test, TestingModule } from '@nestjs/testing';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';

describe('InterviewsController', () => {
  let controller: InterviewsController;
  let service: InterviewsService;

  const mockInterviewsService = {
    crear: jest.fn(),
    enviarMensaje: jest.fn(),
    finalizar: jest.fn(),
    historial: jest.fn(),
    obtenerUna: jest.fn(),
  };

  const reqMock = {
    user: { id: 'user1', email: 'test@test.com', role: 'user' }
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterviewsController],
      providers: [
        {
          provide: InterviewsService,
          useValue: mockInterviewsService,
        },
      ],
    }).compile();

    controller = module.get<InterviewsController>(InterviewsController);
    service = module.get<InterviewsService>(InterviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('crear()', () => {
    it('should call interviewsService.crear', async () => {
      const dto = { target_role: 'dev', seniority: 'junior', technologies: [] };
      mockInterviewsService.crear.mockResolvedValue({ _id: '1' });
      const res = await controller.crear(reqMock, dto);
      expect(mockInterviewsService.crear).toHaveBeenCalledWith('user1', dto);
      expect(res).toEqual({ _id: '1' });
    });
  });

  describe('enviarMensaje()', () => {
    it('should call interviewsService.enviarMensaje', async () => {
      const dto = { content: 'hello' };
      mockInterviewsService.enviarMensaje.mockResolvedValue({ _id: '1' });
      const res = await controller.enviarMensaje(reqMock, 'id1', dto);
      expect(mockInterviewsService.enviarMensaje).toHaveBeenCalledWith('user1', 'id1', dto);
      expect(res).toEqual({ _id: '1' });
    });
  });

  describe('finalizar()', () => {
    it('should call interviewsService.finalizar', async () => {
      mockInterviewsService.finalizar.mockResolvedValue({ _id: 'id1' });
      const res = await controller.finalizar(reqMock, 'id1');
      expect(mockInterviewsService.finalizar).toHaveBeenCalledWith('user1', 'id1');
      expect(res).toEqual({ _id: 'id1' });
    });
  });

  describe('historial()', () => {
    it('should call interviewsService.historial', async () => {
      mockInterviewsService.historial.mockResolvedValue([{ _id: 'id1' }]);
      const res = await controller.historial(reqMock);
      expect(mockInterviewsService.historial).toHaveBeenCalledWith('user1');
      expect(res).toEqual([{ _id: 'id1' }]);
    });
  });

  describe('obtenerUna()', () => {
    it('should call interviewsService.obtenerUna', async () => {
      mockInterviewsService.obtenerUna.mockResolvedValue({ _id: 'id1' });
      const res = await controller.obtenerUna(reqMock, 'id1');
      expect(mockInterviewsService.obtenerUna).toHaveBeenCalledWith('user1', 'id1');
      expect(res).toEqual({ _id: 'id1' });
    });
  });
});
