import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  const mockAppService = {
    getHealth: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();
    controller = module.get<AppController>(AppController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth()', () => {
    it('delega en appService y devuelve su resultado', () => {
      const healthResponse = {
        status: 'ok',
        service: 'simulador_entrevistas',
        timestamp: '2026-07-05T00:00:00.000Z',
        uptime: 12.3,
      };
      mockAppService.getHealth.mockReturnValue(healthResponse);

      const result = controller.getHealth();

      expect(mockAppService.getHealth).toHaveBeenCalled();
      expect(result).toEqual(healthResponse);
    });
  });
});
