import { Test, TestingModule } from '@nestjs/testing';
import { AiLogsController } from './ai-logs.controller';
import { AiLogsService } from './ai-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('AiLogsController', () => {
  let controller: AiLogsController;

  const mockService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiLogsController],
      providers: [{ provide: AiLogsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<AiLogsController>(AiLogsController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('findAll delega la consulta al servicio', async () => {
    const query = { page: 1, limit: 10 };
    mockService.findAll.mockResolvedValue({ data: [], meta: {} });
    await controller.findAll(query);
    expect(mockService.findAll).toHaveBeenCalledWith(query);
  });
});
