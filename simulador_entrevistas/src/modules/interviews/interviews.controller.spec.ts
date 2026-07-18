import { Test, TestingModule } from '@nestjs/testing';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('InterviewsController', () => {
  let controller: InterviewsController;

  const mockService = {
    crear: jest.fn(),
    enviarMensaje: jest.fn(),
    finalizar: jest.fn(),
    historial: jest.fn(),
    obtenerUna: jest.fn(),
  };

  const req = { user: { id: 'user-1', email: 'a@a.com', role: 'user' } };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterviewsController],
      providers: [{ provide: InterviewsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<InterviewsController>(InterviewsController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('crear delega el id del usuario y el dto al servicio', async () => {
    const dto = {
      interview_type: 'technical',
      target_role: 'backend',
      seniority: 'senior',
      technologies: ['Node.js'],
    };
    mockService.crear.mockResolvedValue({ _id: 'int-1' });
    await controller.crear(req, dto);
    expect(mockService.crear).toHaveBeenCalledWith('user-1', dto);
  });

  it('enviarMensaje delega usuario, id y dto al servicio', async () => {
    const dto = { content: 'respuesta' };
    mockService.enviarMensaje.mockResolvedValue({ _id: 'int-1' });
    await controller.enviarMensaje(req, 'int-1', dto);
    expect(mockService.enviarMensaje).toHaveBeenCalledWith('user-1', 'int-1', dto);
  });

  it('finalizar delega usuario e id al servicio', async () => {
    mockService.finalizar.mockResolvedValue({ status: 'completed' });
    await controller.finalizar(req, 'int-1');
    expect(mockService.finalizar).toHaveBeenCalledWith('user-1', 'int-1');
  });

  it('historial delega el id del usuario al servicio', async () => {
    mockService.historial.mockResolvedValue([]);
    await controller.historial(req);
    expect(mockService.historial).toHaveBeenCalledWith('user-1');
  });

  it('obtenerUna delega usuario e id al servicio', async () => {
    mockService.obtenerUna.mockResolvedValue({ _id: 'int-1' });
    await controller.obtenerUna(req, 'int-1');
    expect(mockService.obtenerUna).toHaveBeenCalledWith('user-1', 'int-1');
  });
});
