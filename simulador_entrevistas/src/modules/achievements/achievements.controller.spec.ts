import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';

describe('AchievementsController', () => {
  let controller: AchievementsController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementsController],
      providers: [{ provide: AchievementsService, useValue: mockService }],
    }).compile();
    controller = module.get<AchievementsController>(AchievementsController);
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

  it('findOne delega el id al servicio', async () => {
    mockService.findOne.mockResolvedValue({ id: 'ach-1' });
    await controller.findOne('ach-1');
    expect(mockService.findOne).toHaveBeenCalledWith('ach-1');
  });

  it('create delega el dto al servicio', async () => {
    const dto = { name: 'primera_entrevista' };
    mockService.create.mockResolvedValue({ id: 'ach-1', ...dto });
    await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update delega id y dto al servicio', async () => {
    const dto = { description: 'Cinco seguidas' };
    mockService.update.mockResolvedValue({ id: 'ach-1', ...dto });
    await controller.update('ach-1', dto);
    expect(mockService.update).toHaveBeenCalledWith('ach-1', dto);
  });

  it('remove delega el id al servicio', async () => {
    mockService.remove.mockResolvedValue({ id: 'ach-1' });
    await controller.remove('ach-1');
    expect(mockService.remove).toHaveBeenCalledWith('ach-1');
  });
});
