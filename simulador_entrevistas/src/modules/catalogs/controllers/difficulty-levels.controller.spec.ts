import { Test, TestingModule } from '@nestjs/testing';
import { DifficultyLevelsController } from './difficulty-levels.controller';
import { DifficultyLevelsService } from '../services/difficulty-levels.service';

describe('DifficultyLevelsController', () => {
  let controller: DifficultyLevelsController;

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
      controllers: [DifficultyLevelsController],
      providers: [
        { provide: DifficultyLevelsService, useValue: mockService },
      ],
    }).compile();
    controller = module.get<DifficultyLevelsController>(
      DifficultyLevelsController,
    );
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
    mockService.findOne.mockResolvedValue({ id: 'dif-1' });
    await controller.findOne('dif-1');
    expect(mockService.findOne).toHaveBeenCalledWith('dif-1');
  });

  it('create delega el dto al servicio', async () => {
    const dto = { name: 'easy' };
    mockService.create.mockResolvedValue({ id: 'dif-1', ...dto });
    await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update delega id y dto al servicio', async () => {
    const dto = { description: 'Sencillo' };
    mockService.update.mockResolvedValue({ id: 'dif-1', ...dto });
    await controller.update('dif-1', dto);
    expect(mockService.update).toHaveBeenCalledWith('dif-1', dto);
  });

  it('remove delega el id al servicio', async () => {
    mockService.remove.mockResolvedValue({ id: 'dif-1' });
    await controller.remove('dif-1');
    expect(mockService.remove).toHaveBeenCalledWith('dif-1');
  });
});
